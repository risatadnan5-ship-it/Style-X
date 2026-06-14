import React, { useState, useEffect } from 'react';
import { X, Trash2, Tag, ChevronRight, ShoppingBag, ShieldAlert, CheckCircle, Smartphone, User, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../dbMock';
import { Product, Coupon, Order, OrderItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCartUpdate: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCartUpdate }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<{ id: string; product: Product; quantity: number }[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  
  // Checkout Form Details
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  
  // Order placed notification
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCart();
      setPlacedOrder(null);
      setIsCheckingOut(false);
    }
  }, [isOpen]);

  const loadCart = () => {
    const rawCart = db.getCart();
    const allProducts = db.getProducts();
    const resolved = rawCart.map(item => {
      const p = allProducts.find(prod => prod.id === item.product_id);
      return p ? { id: item.product_id, product: p, quantity: item.quantity } : null;
    }).filter(Boolean) as { id: string; product: Product; quantity: number }[];
    
    setCartItems(resolved);
  };

  const handleUpdateQty = (prodId: string, delta: number) => {
    const rawCart = db.getCart();
    const updated = rawCart.map(item => {
      if (item.product_id === prodId) {
        const nextQty = Math.max(1, Math.min(10, item.quantity + delta));
        return { ...item, quantity: nextQty };
      }
      return item;
    });
    db.setCart(updated);
    loadCart();
    onCartUpdate();
  };

  const handleRemove = (prodId: string) => {
    const rawCart = db.getCart();
    const updated = rawCart.filter(item => item.product_id !== prodId);
    db.setCart(updated);
    loadCart();
    onCartUpdate();
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const coupons = db.getCoupons();
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
    
    if (found) {
      setAppliedCoupon(found);
    } else {
      setCouponError('Invalid or inactive luxury credentials code.');
    }
  };

  // Computations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percent') {
      discount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discount = appliedCoupon.value;
    }
  }
  const finalTotal = Math.max(0, subtotal - discount);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || !shippingName || !shippingPhone || !shippingAddress) return;

    // Simulate Supabase Order creation
    const orderId = `SX-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      user_id: 'client-user-1',
      customer_name: shippingName,
      customer_phone: shippingPhone,
      customer_address: shippingAddress,
      status: 'Pending',
      total: subtotal,
      coupon_code: appliedCoupon?.code,
      discount_amount: discount,
      final_total: finalTotal,
      created_at: new Date().toISOString()
    };

    // Save items mapping
    const orderItems: OrderItem[] = cartItems.map(item => ({
      id: `item-${Date.now()}-${item.product.id}`,
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image_urls[0],
      quantity: item.quantity,
      price: item.product.price
    }));

    // Update global databases
    const existingOrders = db.getOrders();
    const existingItems = db.getOrderItems();
    db.setOrders([newOrder, ...existingOrders]);
    db.setOrderItems([...orderItems, ...existingItems]);

    // Track state adjust: subtract inventory stock
    const products = db.getProducts();
    const adjustedProducts = products.map(p => {
      const match = cartItems.find(item => item.product.id === p.id);
      if (match) {
        return { ...p, stock: Math.max(0, p.stock - match.quantity) };
      }
      return p;
    });
    db.setProducts(adjustedProducts);

    // Empty active client basket
    db.setCart([]);
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
    
    setPlacedOrder(newOrder);
    onCartUpdate();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" 
          />

          {/* Drawer panel */}
          <motion.div
            id="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0A0A0A] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
                <h2 className="font-serif text-base font-bold tracking-widest text-white uppercase">Your Atelier Bag</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 rounded-none border border-white/10 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {placedOrder ? (
                /* SUCCESS CONCIERGE STATEMENT */
                <div id="checkout-success-view" className="text-center py-12 px-4 space-y-6">
                  <div className="h-16 w-16 bg-[#111111] rounded-none border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-white tracking-wide uppercase">Order Safely Logged</h3>
                    <p className="text-xs font-mono text-gray-500">ID Ref: {placedOrder.id}</p>
                    <p className="text-xs text-gray-400 leading-relaxed pt-2">
                      Our dispatch attache will contact you shortly via <strong>{placedOrder.customer_phone}</strong> to confirm shipping coordinates and schedule premium door delivering.
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-950 rounded-none border border-white/10 text-left space-y-2">
                    <p className="text-[10px] font-mono uppercase text-[#D4AF37] tracking-wider">Acquisition Receipt</p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Total Invoice</span>
                      <span className="font-bold text-white">${placedOrder.final_total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Gateway Method</span>
                      <span className="text-[#D4AF37] uppercase font-semibold">Cash On Delivery</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Consignee</span>
                      <span className="text-gray-300 font-medium">{placedOrder.customer_name}</span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-[#D4AF37] text-black text-xs font-mono uppercase tracking-widest font-bold rounded-none mt-4 hover:bg-white hover:text-black transition-all cursor-pointer"
                  >
                    Return to Atelier
                  </button>
                </div>
              ) : isCheckingOut ? (
                /* SECURE CHECKOUT FORM SCREEN */
                <form id="checkout-shipping-form" onSubmit={handlePlaceOrder} className="space-y-5 text-left">
                  <h3 className="text-sm font-serif font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    Consignor Specifications
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1 flex items-center gap-1.5">
                        <User className="h-3 w-3" /> Consignee Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder="e.g. Sir Archibald Harrison"
                        className="w-full bg-[#111111] border border-white/10 rounded-none p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1 flex items-center gap-1.5">
                        <Smartphone className="h-3 w-3" /> Secure Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        placeholder="e.g. +44 20 7946 0958"
                        className="w-full bg-[#111111] border border-white/10 rounded-none p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1 flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> Delivery Coordinates
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Suite block/Street address line, city, post code"
                        className="w-full bg-[#111111] border border-white/10 rounded-none p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Cash On Delivery Seal Panel */}
                  <div className="p-3 bg-[#111111] border border-[#D4AF37]/30 rounded-none flex items-start gap-2.5">
                    <ShieldAlert className="h-4.5 w-4.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div className="text-[11px] text-gray-300 leading-normal">
                      <strong className="text-white block uppercase font-mono tracking-wider mb-0.5">Verified Cash On Delivery Seal</strong>
                      No online digital transaction. Check the product authenticity at delivery, then pay on hand in physical currency. Safe, private, premium.
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-none hover:bg-white cursor-pointer transition-all flex items-center justify-center gap-2 shadow-2xl"
                    >
                      <span>Certify & Submit Order</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="w-full text-center py-2 text-[10px] font-mono uppercase tracking-wider text-gray-500 mt-2.5 hover:text-white"
                    >
                      Back to Bag View
                    </button>
                  </div>
                </form>
              ) : (
                /* CARDS AND BASKET CONTENTS */
                <>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <div className="h-12 w-12 rounded-none border border-white/10 flex items-center justify-center mx-auto text-gray-600">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Your Private collection is vacant.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 rounded-none bg-neutral-950 border border-white/10 text-left relative group">
                          <img 
                            src={item.product.image_urls[0] || undefined} 
                            alt="" 
                            className="h-16 w-16 object-cover rounded-none border border-white/10" 
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-serif font-bold text-white truncate">{item.product.name}</h4>
                            <p className="text-[10px] font-mono text-[#D4AF37] mt-0.5">${item.product.price.toLocaleString()}</p>
                            
                            <div className="flex items-center gap-3.5 mt-2.5">
                              <div className="flex items-center border border-white/10 rounded-none bg-black h-7">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(item.id, -1)}
                                  className="px-2 text-gray-500 hover:text-white text-xs"
                                >
                                  -
                                </button>
                                <span className="px-1 text-xs font-mono text-white">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(item.id, 1)}
                                  className="px-2 text-gray-500 hover:text-white text-xs"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="text-gray-500 hover:text-red-400 text-xs transition-colors flex items-center gap-1 font-mono text-[9px] uppercase"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Discard</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Luxury Coupon Form */}
                  {cartItems.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="ENTER PASSCODE (e.g. STYLEUX10)"
                          className="flex-1 bg-zinc-950 border border-white/10 rounded-none px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="submit"
                          className="bg-black border border-white/20 text-[#D4AF37] px-4 py-2 text-[10px] font-mono font-bold uppercase rounded-none hover:bg-white hover:text-black transition-all cursor-pointer"
                        >
                          Unlock
                        </button>
                      </form>
                      {couponError && <p className="text-[10px] text-red-400 text-left mt-1.5 font-mono">{couponError}</p>}
                      {appliedCoupon && (
                        <div className="flex justify-between items-center bg-[#111111] border border-[#D4AF37]/30 rounded-none px-3 py-1.5 mt-2.5 text-left">
                          <span className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1.5">
                            <Tag className="h-3 w-3 text-[#D4AF37]" />
                            Code Active: {appliedCoupon.code} ({appliedCoupon.discount_type === 'percent' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`} discount)
                          </span>
                          <button 
                            onClick={() => setAppliedCoupon(null)}
                            className="text-[9px] font-mono uppercase text-gray-500 hover:text-white"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Bottom aggregate breakdown summary */}
            {cartItems.length > 0 && !isCheckingOut && (
              <div id="cart-drawer-totalizer" className="p-6 border-t border-white/10 bg-black space-y-4">
                <div className="space-y-2 text-left font-mono text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-red-400">
                      <span>Passcode Discount</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-2.5 text-sm font-bold">
                    <span className="text-white uppercase leading-normal">Bespoke Invoice</span>
                    <span className="text-[#D4AF37] font-mono">${finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  id="checkout-drawer-primary-btn"
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-4 bg-[#D4AF37] text-black text-xs font-mono uppercase tracking-widest font-bold rounded-none hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Verify Coordinates</span>
                  <ChevronRight className="h-3.5 w-3.5 text-black animate-pulse" />
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
