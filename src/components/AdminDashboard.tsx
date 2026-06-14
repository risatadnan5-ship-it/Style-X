import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, ShoppingBag, ShieldAlert, Users, MessageSquare, 
  Settings, CheckCircle, Clock, Package, Trash2, Edit3, Plus, RefreshCw, Star, Tag, X, FileMinus 
} from 'lucide-react';
import { db } from '../dbMock';
import { supabase } from '../supabaseClient';
import { Product, Order, Review, ChatMessage, Coupon } from '../types';
import SupabaseGuide from './SupabaseGuide';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'reviews' | 'chat' | 'coupons' | 'database'>('analytics');
  
  // Real-time admin state loads from DB mock
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [dbStatus, setDbStatus] = useState(db.getSupabaseStatus());

  // Product Creator Form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Horology Elegance');
  const [newProdPrice, setNewProdPrice] = useState(2500);
  const [newProdStock, setNewProdStock] = useState(5);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800');
  const [formErr, setFormErr] = useState('');
  const [uploadType, setUploadType] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormErr('Sovereign catalog registry only supports true image files (JPEG, PNG, WEBP, AVIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewProdImg(event.target.result as string);
        setFormErr('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Admin Reply Form for chat
  const [adminReplyText, setAdminReplyText] = useState('');

  // Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');

  useEffect(() => {
    loadAllAdminData();
    
    const handleDbUpdate = () => {
      loadAllAdminData();
    };

    window.addEventListener('stylex_db_update', handleDbUpdate);

    // Refresh interval for realtime chat simulation
    const chatInterval = setInterval(() => {
      setChatMessages(db.getChatMessages());
    }, 1500);

    return () => {
      window.removeEventListener('stylex_db_update', handleDbUpdate);
      clearInterval(chatInterval);
    };
  }, []);

  const loadAllAdminData = () => {
    setProducts(db.getProducts());
    setOrders(db.getOrders());
    setReviews(db.getReviews());
    setChatMessages(db.getChatMessages());
    setCoupons(db.getCoupons());
    setDbStatus(db.getSupabaseStatus());
  };

  // Orders dispatcher
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const all = db.getOrders();
    const updated = all.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status };
      }
      return ord;
    });
    db.setOrders(updated);
    setOrders(updated);
  };

  // Product Add / Update stock
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || newProdPrice <= 0) {
      setFormErr('Provide a valid name and price.');
      return;
    }

    const newProdItem: Product = {
      id: `prod-${Date.now()}`,
      sku: `SX-${newProdCategory.substring(0,2).toUpperCase()}-${Math.floor(100+Math.random()*900)}`,
      name: newProdName,
      description: newProdDesc || 'Genuine hand finished luxury item curated by Style X.',
      category: newProdCategory,
      price: Number(newProdPrice),
      rating: 5.0,
      image_urls: [newProdImg],
      featured: true,
      stock: Number(newProdStock),
      specs: {
        'Assembly': 'Atelier hand engineered',
        'Finish': 'Polished mirror bevel',
        'Rarity': 'Exclusive lot release'
      },
      created_at: new Date().toISOString()
    };

    setFormErr('');

    // Try to save directly to live Supabase, but fall back gracefully
    let supabaseSuccess = false;
    let supabaseErrorDetails = 'Unknown connection error';
    try {
      const { error } = await supabase
        .from('products')
        .insert([newProdItem]);

      if (!error) {
        supabaseSuccess = true;
      } else {
        supabaseErrorDetails = error.message;
        console.warn('[SUPABASE PRODUCT CREATION WARNING - FALLING BACK TO LOCAL]', error);
      }
    } catch (exc: any) {
      supabaseErrorDetails = exc?.message || String(exc);
      console.warn('[SUPABASE PRODUCT CREATION EXCEPTION - FALLING BACK TO LOCAL]', exc);
    }

    // Always update and refresh client views locally using dbMock so it successfully runs
    const updatedProducts = [newProdItem, ...db.getProducts()];
    db.setProducts(updatedProducts);
    setProducts(updatedProducts);

    // Clear Form
    setNewProdName('');
    setNewProdPrice(0);
    setNewProdStock(5);
    setNewProdDesc('');
    setShowProductForm(false);
    
    if (supabaseSuccess) {
      alert('🌟 SUCCESS: Bespoke product officially added and live in your Supabase database! Other customers can see it immediately!');
    } else {
      alert(`⚠️ DATABASE WARNING: Product uploaded but only visible in YOUR browser!

Why this happened:
It failed to save to the Supabase database (Error: ${supabaseErrorDetails}). Because of this, the product is stored only in your local browser cache instead of the cloud database, which is why other customers cannot see it.

How to fix this:
1. Ensure you have defined 'VITE_SUPABASE_URL' and 'VITE_SUPABASE_ANON_KEY' in your env variables (Vercel Settings -> Environment Variables) and redeployed.
2. Ensure you have created all tables via the SQL Script! Go to the "Database" tab in this admin panel, copy the SQL migration script, and run it in your Supabase SQL Editor.`);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm('Are you authorized to delete this lot permanently from sovereign archives?')) return;

    let supabaseSuccess = false;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', prodId);

      if (!error) {
        supabaseSuccess = true;
      } else {
        console.warn('[SUPABASE PRODUCT DELETION WARNING - FALLING BACK TO LOCAL]', error);
      }
    } catch (exc) {
      console.warn('[SUPABASE PRODUCT DELETION EXCEPTION - FALLING BACK TO LOCAL]', exc);
    }

    const updated = db.getProducts().filter(p => p.id !== prodId);
    db.setProducts(updated);
    setProducts(updated);

    if (!supabaseSuccess) {
      console.log('[SUPABASE] Handled delete locally under sandbox fail-safe.');
    }
  };

  const handleAdjustStock = async (prodId: string, delta: number) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    const nextStock = Math.max(0, prod.stock + delta);

    let supabaseSuccess = false;
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: nextStock })
        .eq('id', prodId);

      if (!error) {
        supabaseSuccess = true;
      } else {
        console.warn('[SUPABASE PRODUCT UPDATE WARNING - FALLING BACK TO LOCAL]', error);
      }
    } catch (exc) {
      console.warn('[SUPABASE PRODUCT UPDATE EXCEPTION - FALLING BACK TO LOCAL]', exc);
    }

    const updated = db.getProducts().map(p => {
      if (p.id === prodId) {
        return { ...p, stock: nextStock };
      }
      return p;
    });
    db.setProducts(updated);
    setProducts(updated);

    if (!supabaseSuccess) {
      console.log('[SUPABASE] Handled stock update locally under sandbox fail-safe.');
    }
  };

  // Reviews Moderation
  const handleModerateReview = (revId: string, status: Review['status']) => {
    const updated = db.getReviews().map(rev => {
      if (rev.id === revId) {
        return { ...rev, status };
      }
      return rev;
    });
    db.setReviews(updated);
    setReviews(updated);
  };

  // Realtime Chat Replies
  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;

    const currentMsg = db.getChatMessages();
    const newMsg: ChatMessage = {
      id: `admin-msg-${Date.now()}`,
      sender_id: 'admin-id',
      sender_name: 'Style X Private Concierge',
      message: adminReplyText.trim(),
      created_at: new Date().toISOString(),
      is_admin: true
    };

    const final = [...currentMsg, newMsg];
    db.setChatMessages(final);
    setChatMessages(final);
    setAdminReplyText('');
  };

  // Coupons Add
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const newCup: Coupon = {
      id: `cup-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discount_type: newCouponType,
      value: newCouponValue,
      active: true
    };

    const updated = [newCup, ...db.getCoupons()];
    db.setCoupons(updated);
    setCoupons(updated);
    setNewCouponCode('');
  };

  const handleToggleCoupon = (id: string) => {
    const updated = db.getCoupons().map(c => {
      if (c.id === id) {
        return { ...c, active: !c.active };
      }
      return c;
    });
    db.setCoupons(updated);
    setCoupons(updated);
  };

  // Analytics helper metrics
  const grossRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, current) => acc + current.final_total, 0);

  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  // Render dummy premium sales progression chart using recharts
  const chartData = [
    { name: 'Week 1', Revenue: grossRevenue * 0.2 },
    { name: 'Week 2', Revenue: grossRevenue * 0.45 },
    { name: 'Week 3', Revenue: grossRevenue * 0.7 },
    { name: 'Week 4', Revenue: grossRevenue }
  ];

  return (
    <div id="admin-dashboard-container" className="mx-auto max-w-7xl px-6 lg:px-8 py-10 md:py-16 text-left">
      
      {/* Premium Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-[#D4AF37]/25 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase font-bold">Style X Executive Console</span>
          <h1 className="text-3xl font-serif font-black text-white uppercase tracking-wider mt-1">Directorship Suite</h1>
          
          {/* Active Database Synchronization Diagnostics Bar */}
          <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[10px] font-mono uppercase">
            {dbStatus.connected ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-950/40 border border-green-800 text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Supabase Live Connected
              </span>
            ) : dbStatus.connected === false ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/40 border border-red-800 text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Supabase Integration Pending / Blocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/45 border border-amber-800 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Syncing with Supabase clouds...
              </span>
            )}

            {/* Check sandbox vs custom credentials */}
            {(!(import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL === 'https://khlmfaodrzzjonjhzodu.supabase.co') ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/20 border border-amber-900/45 text-amber-500 font-bold">
                ⚠️ Sandbox Mode (Requires Vercel Env Config)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/30 border border-purple-900 text-purple-400 font-semibold">
                🛡️ Custom Production Database Loaded
              </span>
            )}
          </div>
        </div>
        
        {/* Quick controls tab */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {(['analytics', 'orders', 'products', 'reviews', 'chat', 'coupons', 'database'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded uppercase tracking-wider transition-colors cursor-pointer border ${activeTab === tab ? 'bg-[#4C1D95] border-[#D4AF37] text-white' : 'bg-transparent border-gray-800 text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* DASHBOARD ANALYTICS SECTION */}
      {activeTab === 'analytics' && (
        <div id="analytics-deck" className="space-y-8 animate-fadeIn">
          {/* Main Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-lg border border-[#D4AF37]/25 bg-gradient-to-tr from-[#120F1C] to-zinc-950">
              <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase">Gross Revenue (COD)</span>
              <p className="text-3xl font-serif font-bold text-white mt-1.5">${grossRevenue.toLocaleString()}</p>
              <span className="text-[9px] text-[#D4AF37] font-mono flex items-center gap-1.5 mt-2">
                <TrendingUp className="h-3 w-3" />
                Live database sum
              </span>
            </div>

            <div className="p-5 rounded-lg border border-gray-800 bg-[#0E0E0E]">
              <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase">Awaiting Escrow Validation</span>
              <p className="text-3xl font-serif font-bold text-[#D4AF37] mt-1.5">{pendingCount} Lots</p>
              <span className="text-[9px] text-[#D4AF37] font-mono flex items-center gap-1.5 mt-2">
                <Clock className="h-3 w-3" />
                Requires phone callbacks
              </span>
            </div>

            <div className="p-5 rounded-lg border border-gray-800 bg-[#0E0E0E]">
              <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase">VIP Attendants Saved</span>
              <p className="text-3xl font-serif font-bold text-white mt-1.5">{reviews.length + 12}</p>
              <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1.5 mt-2">
                <Users className="h-3 w-3 text-purple-400" />
                Active browser sessions
              </span>
            </div>

            <div className="p-5 rounded-lg border border-gray-800 bg-[#0E0E0E]">
              <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase">Exclusive Catalog Lots</span>
              <p className="text-3xl font-serif font-bold text-white mt-1.5">{products.length}</p>
              <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1.5 mt-2">
                <Package className="h-3 w-3 text-blue-400" />
                In Stock & active
              </span>
            </div>

          </div>

          {/* Area Chart block */}
          <div className="p-6 bg-[#0E0E0E] rounded-lg border border-[#D4AF37]/15">
            <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-widest mb-4">Escrow Invoicing progression</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4C1D95" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#555" fontSize={11} />
                  <YAxis stroke="#555" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#070707', border: '1px solid #D4AF37' }} />
                  <Area type="monotone" dataKey="Revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* COURIER ORDER MANAGEMENT SECTION */}
      {activeTab === 'orders' && (
        <div id="orders-deck" className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center bg-[#111111] p-4 rounded-lg border border-gray-800">
            <p className="text-xs font-mono text-gray-400">Manage order verification pipelines for Cash on Delivery (COD).</p>
            <button onClick={loadAllAdminData} className="p-2 bg-transparent hover:bg-zinc-800 text-[#D4AF37] border border-gray-800 rounded">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-800 rounded-lg">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="text-[10px] font-mono uppercase bg-[#161616] tracking-wider border-b border-gray-800 text-gray-400">
                <tr>
                  <th className="px-6 py-4">Serial / Date</th>
                  <th className="px-6 py-4">Client Detail</th>
                  <th className="px-6 py-4">Coordinate / Address</th>
                  <th className="px-6 py-4">Total Invoice</th>
                  <th className="px-6 py-4">Verification Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 bg-[#0A0A0A]">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500 font-mono italic">No COD orders logged yet. Place orders as Customer to check flow.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-zinc-950 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        {order.id}
                        <span className="block text-[9px] text-gray-500 font-light mt-0.5">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-100">{order.customer_name}</p>
                        <p className="font-mono text-[10px] text-[#D4AF37]">{order.customer_phone}</p>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-gray-400" title={order.customer_address}>
                        {order.customer_address}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        ${order.final_total.toLocaleString()}
                        {order.discount_amount > 0 && (
                          <span className="block text-[8px] text-purple-400 font-normal">Discount value included</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`bg-zinc-950 border text-xs px-2.5 py-1 rounded focus:outline-none ${
                            order.status === 'Pending' ? 'border-yellow-600 text-yellow-300' :
                            order.status === 'Confirmed' ? 'border-indigo-600 text-indigo-300' :
                            order.status === 'Packed' ? 'border-orange-600 text-orange-300' :
                            order.status === 'Shipped' ? 'border-blue-600 text-blue-300' :
                            order.status === 'Delivered' ? 'border-green-600 text-green-300' :
                            'border-red-600 text-red-300'
                          }`}
                        >
                          <option value="Pending">🛡️ Pending Callback</option>
                          <option value="Confirmed">✅ Confirmed</option>
                          <option value="Packed">📦 Lot Packed</option>
                          <option value="Shipped">✈️ Lot Shipped</option>
                          <option value="Delivered">🏠 Delivered / Paid</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT LISTINGS MANAGEMENT */}
      {activeTab === 'products' && (
        <div id="products-deck" className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Atelier Registry</h3>
            <button
              onClick={() => setShowProductForm(!showProductForm)}
              className="px-4 py-2 bg-[#D4AF37] text-black rounded text-xs font-mono font-medium uppercase hover:bg-[#E6C657] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Register New Lot</span>
            </button>
          </div>

          {/* Form to create products */}
          {showProductForm && (
            <form onSubmit={handleAddProductSubmit} className="p-5 rounded bg-zinc-950 border border-[#D4AF37]/30 space-y-4 text-left">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">Product Lot Definition</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase mb-1 font-mono">Lot Title</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Monte Carlo Chrono"
                    className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase mb-1 font-mono">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Horology Elegance">⏱ Horology Elegance</option>
                    <option value="Haute Leather">👜 Haute Leather</option>
                    <option value="Atelier Apparel">🧥 Atelier Apparel</option>
                    <option value="Signature Icons">✨ Signature Icons</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase mb-1 font-mono">Lot Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] text-gray-500 uppercase font-mono">Lot Photograph Source</label>
                  <div className="flex border-b border-zinc-800 pb-1.5 gap-3">
                    <button
                      type="button"
                      onClick={() => setUploadType('upload')}
                      className={`text-[9px] font-mono uppercase pb-1 tracking-wider transition-all ${uploadType === 'upload' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      ↑ Upload Asset
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadType('url')}
                      className={`text-[9px] font-mono uppercase pb-1 tracking-wider transition-all ${uploadType === 'url' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      🔗 Photograph URL
                    </button>
                  </div>

                  {uploadType === 'upload' ? (
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileChange(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => document.getElementById('lot-file-input')?.click()}
                      className={`border border-dashed rounded p-4 text-center transition-all cursor-pointer ${
                        isDragging 
                          ? 'border-[#D4AF37] bg-zinc-900/50 text-white' 
                          : 'border-zinc-800 bg-[#0A0A0A] hover:border-[#D4AF37]/50 text-gray-400'
                      }`}
                    >
                      <input 
                        id="lot-file-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          {newProdImg ? (
                            <div className="relative group">
                              <img src={newProdImg} alt="Preview" className="h-14 w-14 object-cover rounded border border-[#D4AF37]/30" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                                <span className="text-[8px] text-[#D4AF37] uppercase font-mono">Change</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#D4AF37] text-xs">
                              ↑
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-gray-300">
                          {newProdImg ? 'Custom photograph loaded!' : 'Drag photograph here or click to choose'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={newProdImg}
                        placeholder="https://images.unsplash.com/..."
                        onChange={(e) => setNewProdImg(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                      {newProdImg && (
                        <div className="mt-1 text-left">
                          <img src={newProdImg} alt="URL Preview" className="h-10 w-10 object-cover rounded border border-gray-800" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase mb-1 font-mono">Starter Stock</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase mb-1 font-mono">Editorial Narrative</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Masterpiece story parameters..."
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              {formErr && (
                <div className="bg-red-950/20 border border-red-900/40 p-3 text-red-400 font-mono text-[10px] uppercase leading-relaxed tracking-wider">
                  <span className="font-bold text-red-500 block mb-0.5">Validation Alert:</span>
                  {formErr}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-purple-950 border border-[#D4AF37]/50 text-[#D4AF37] px-5 py-2.5 text-xs font-mono uppercase hover:bg-purple-900 rounded cursor-pointer"
                >
                  Confirm Lot Design Range
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="bg-transparent text-gray-400 px-4 py-2 text-xs font-mono"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Catalog grid inside admin view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="p-4 border border-zinc-800 bg-[#0E0E0E] rounded-md flex gap-4 text-left items-start relative group">
                <img src={p.image_urls[0] || undefined} alt="" className="h-16 w-16 object-cover rounded border border-gray-800" />
                <div className="flex-1 min-w-0 font-light text-xs">
                  <h4 className="font-serif font-black text-white truncate text-sm">{p.name}</h4>
                  <p className="text-gray-500 font-mono mt-0.5">{p.sku}</p>
                  <p className="text-[#D4AF37] font-mono mt-1 font-semibold">${p.price.toLocaleString()}</p>
                  
                  {/* Stock adjuster */}
                  <div className="flex items-center gap-2 mt-3.5">
                    <span className="text-gray-400 font-mono text-[10px]">Stk: {p.stock}</span>
                    <button onClick={() => handleAdjustStock(p.id, -1)} className="px-1.5 py-0.5 bg-neutral-900 hover:bg-neutral-800 border border-gray-800 rounded font-serif">-</button>
                    <button onClick={() => handleAdjustStock(p.id, 1)} className="px-1.5 py-0.5 bg-neutral-900 hover:bg-neutral-800 border border-gray-800 rounded font-serif">+</button>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="absolute bottom-3 right-3 text-gray-600 hover:text-red-400 p-1 rounded hover:bg-red-950/20"
                  title="Delete product"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* REVIEWS MODERATION PANEL */}
      {activeTab === 'reviews' && (
        <div id="reviews-deck" className="space-y-6 animate-fadeIn">
          <div className="bg-[#111111] p-4 rounded border border-gray-800">
            <p className="text-xs font-mono text-gray-400">Moderating submitted client evaluations. Only approved evaluations will populate product detailed tabs.</p>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-[#0A0A0A] border border-gray-800 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-white text-sm">{rev.user_name}</span>
                    <span className="text-[10px] font-mono bg-zinc-900 px-2 py-0.5 rounded text-gray-400">{rev.product_name}</span>
                    <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full ${rev.status === 'approved' ? 'bg-green-950 text-green-300' : rev.status === 'pending' ? 'bg-yellow-950 text-yellow-300' : 'bg-red-950 text-red-300'}`}>
                      {rev.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 italic">"{rev.comment}"</p>
                  <div className="flex text-amber-500 gap-0.5 text-xs font-mono">
                    Rating: {rev.rating} ★
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleModerateReview(rev.id, 'approved')}
                      className="px-3 py-1.5 bg-green-950 hover:bg-green-900 text-green-300 border border-green-700/40 text-[10px] font-mono uppercase font-bold rounded"
                    >
                      Approve Evaluation
                    </button>
                  )}
                  {rev.status !== 'rejected' && (
                    <button
                      onClick={() => handleModerateReview(rev.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-700/40 text-[10px] font-mono uppercase font-bold rounded"
                    >
                      Reject / Quarantine
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const final = db.getReviews().filter(r => r.id !== rev.id);
                      db.setReviews(final);
                      setReviews(final);
                    }}
                    className="p-1.5 text-gray-600 hover:text-red-400 border border-zinc-900 hover:border-red-950 rounded bg-transparent"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REALTIME CHAT COMMUNICATIONS */}
      {activeTab === 'chat' && (
        <div id="chat-deck" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn text-left">
          
          {/* Active Chats Sidebar Column */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-widest border-b border-gray-800 pb-2">VIP Signal Logs</h3>
            <div className="p-3.5 bg-zinc-950 rounded border border-[#D4AF37]/25 text-xs space-y-1">
              <p className="font-bold text-white flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                Active Guest Suite #1
              </p>
              <p className="text-gray-500 font-mono">Host ID: client-user-1</p>
              <p className="text-gray-400 mt-2 line-clamp-1 italic">"{chatMessages[chatMessages.length - 1]?.message}"</p>
            </div>
          </div>

          {/* Unified Messages Window */}
          <div className="lg:col-span-8 flex flex-col h-[500px] border border-gray-800 bg-[#0E0E0E] rounded-lg overflow-hidden">
            <div className="p-4 bg-[#161616] border-b border-gray-800 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-serif font-black text-white uppercase tracking-wider">Style X Attache Dispatch Terminal</h4>
                <p className="text-[10px] text-emerald-400 font-mono">SYSTEM LOG: ONLINE</p>
              </div>
              <span className="text-[9px] bg-purple-900/30 text-purple-300 font-mono border border-purple-800 px-2 py-0.5 rounded font-bold">REALTIME CONSOLE</span>
            </div>

            {/* Message Flow */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/40">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg text-xs leading-relaxed ${msg.is_admin ? 'bg-[#4C1D95] text-white rounded-tr-none' : 'bg-zinc-900 text-gray-300 border border-zinc-800 rounded-tl-none'}`}>
                    <span className="block text-[8px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                      {msg.sender_name} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Response Box */}
            <form onSubmit={handleSendAdminReply} className="p-4 bg-[#111111] border-t border-gray-800 flex gap-2">
              <input
                type="text"
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                placeholder="State private attache response..."
                className="flex-1 bg-zinc-950 border border-gray-800 text-xs px-3.5 py-3 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#E6C657] text-black px-6 text-xs font-mono font-bold uppercase rounded"
              >
                Dispatch
              </button>
            </form>
          </div>

        </div>
      )}

      {/* PROMOTIONAL COUPONS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div id="coupons-deck" className="space-y-6 animate-fadeIn">
          <form onSubmit={handleAddCoupon} className="p-5 rounded bg-zinc-950 border border-gray-800 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">Define Executive Passcode</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Passcode string</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. MONACOVIP50"
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2.5 text-xs text-white uppercase focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Discount Scale Value</label>
                <input
                  type="number"
                  required
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Type</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as 'percent' | 'fixed')}
                  className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="percent">Percentage % Off</option>
                  <option value="fixed">Absolute Fixed $ Off</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-purple-950 hover:bg-purple-900 border border-[#D4AF37]/45 text-[#D4AF37] px-5 py-2.5 text-xs font-mono uppercase rounded-sm cursor-pointer"
            >
              Issue Promotion Lot Code
            </button>
          </form>

          {/* Current Coupons List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 bg-[#0E0E0E] rounded border border-gray-800 flex justify-between items-center text-left">
                <div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono bg-purple-900/30 text-purple-300 border border-purple-800 px-2 py-0.5 rounded uppercase font-bold mb-1.5">
                    <Tag className="h-2.5 w-2.5 text-[#D4AF37]" /> {c.code}
                  </span>
                  <p className="text-xs text-white font-mono">
                    Discount Rate: {c.discount_type === 'percent' ? `${c.value}%` : `$${c.value}`} Value
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCoupon(c.id)}
                  className={`px-3 py-1 text-[10px] font-mono rounded cursor-pointer ${c.active ? 'bg-emerald-950/70 border border-emerald-700/50 text-emerald-300' : 'bg-zinc-800 border border-zinc-700 text-gray-500'}`}
                >
                  {c.active ? 'Armed' : 'Disarmed'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div id="database-deck" className="space-y-6 animate-fadeIn">
          <SupabaseGuide />
        </div>
      )}

    </div>
  );
}
