import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../dbMock';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCartAdd: (prodId: string) => void;
  onToggleWishlist: (prodId: string) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  onCartAdd,
  onToggleWishlist,
}: WishlistDrawerProps) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadWishlist();
    }
  }, [isOpen]);

  const loadWishlist = () => {
    const ids = db.getWishlist();
    const all = db.getProducts();
    const resolved = ids.map(id => all.find(p => p.id === id)).filter(Boolean) as Product[];
    setItems(resolved);
  };

  const handleRemove = (id: string) => {
    onToggleWishlist(id);
    // instant update locally
    setItems(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm" 
          />

          <motion.div
            id="wishlist-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#0A0A0A] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <Heart className="h-5 w-5 fill-current text-red-500" />
                <h2 className="font-serif text-base font-bold tracking-widest text-white uppercase col-span-3">My Saved Lots</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 rounded-none border border-white/10 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <div className="h-10 w-10 flex items-center justify-center border border-white/10 rounded-none mx-auto text-gray-500">
                    <Heart className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">No saved masterpieces inside.</p>
                </div>
              ) : (
                items.map((prod) => (
                  <div key={prod.id} className="flex gap-4 p-3 bg-[#111111] rounded-none border border-white/10 text-left items-center justify-between relative group">
                    <img 
                      src={prod.image_urls[0] || undefined} 
                      alt="" 
                      className="h-14 w-14 object-cover rounded-none border border-white/10" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif font-bold text-white truncate">{prod.name}</h4>
                      <p className="text-[10px] font-mono text-[#D4AF37] mt-0.5">${prod.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onCartAdd(prod.id);
                          onClose();
                        }}
                        className="p-1.5 bg-transparent text-[#D4AF37] border border-[#D4AF37]/30 rounded-none hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
                        title="Acquire lot"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemove(prod.id)}
                        className="p-1.5 bg-transparent text-gray-600 hover:text-red-500 rounded-none transition-colors text-xs font-mono"
                        title="Delete lot"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black">
                <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest text-center leading-normal">
                  SAVED DIRECTIVES ARE SAFELY ENCRYPTED LOCALLY
                </p>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
