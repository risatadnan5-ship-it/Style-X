import React, { useState, useEffect } from 'react';
import { X, Star, CreditCard, ShieldCheck, Heart, ShoppingBag, Send } from 'lucide-react';
import { Product, Review } from '../types';
import { db } from '../dbMock';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
  onToggleWishlist: () => void;
  isWishlisted: boolean;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: ProductDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState(product ? (product.image_urls[0] || '') : '');
  const [quantity, setQuantity] = useState(1);
  const [currentTab, setCurrentTab] = useState<'details' | 'specs' | 'reviews'>('details');
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image_urls[0]);
      setQuantity(1);
      setSuccessMsg('');
      setNewComment('');
      
      // Load current approved reviews
      const allReviews = db.getReviews();
      const productReviews = allReviews.filter(r => r.product_id === product.id && r.status === 'approved');
      setReviews(productReviews);
    }
  }, [product]);

  if (!product) return null;

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !newName) return;

    setIsSubmittingReview(true);
    
    // Simulate Supabase INSERT
    const newRevItem: Review = {
      id: `rev-${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      user_name: newName,
      rating: newRating,
      comment: newComment,
      status: 'pending', // Admins moderated before approving!
      created_at: new Date().toISOString()
    };

    const currentAll = db.getReviews();
    db.setReviews([newRevItem, ...currentAll]);

    setTimeout(() => {
      setIsSubmittingReview(false);
      setSuccessMsg('Your review was successfully transmitted. Style X Moderation officers will verify and approve your entry shortly.');
      setNewComment('');
      setNewName('');
    }, 1000);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div id="product-detail-modal-root" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-outer-frame"
        className="relative w-full max-w-5xl rounded-none bg-[#0A0A0A] border border-white/10 shadow-2xl p-6 lg:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        
        {/* Absolute top close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 text-gray-400 hover:text-white hover:bg-neutral-900 rounded-none border border-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Carousel Segment (5 cols) */}
          <div id="modal-image-segment" className="lg:col-span-12 xl:col-span-5 space-y-4">
            <div className="aspect-square bg-zinc-950 rounded-none border border-white/10 overflow-hidden relative">
              <img
                src={selectedImage || undefined}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-all"
              />
            </div>
            
            {/* Gallery Selector Rows */}
            {product.image_urls.length > 1 && (
              <div className="flex gap-3">
                {product.image_urls.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`h-16 w-16 rounded-none border overflow-hidden ${img === selectedImage ? 'border-[#D4AF37]' : 'border-white/10'}`}
                  >
                    <img src={img || undefined} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specification details (7 cols) */}
          <div id="modal-text-segment" className="lg:col-span-12 xl:col-span-7 flex flex-col h-full text-left">
            <div className="border-b border-white/10 pb-5">
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">{product.category}</span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1 leading-relaxed">{product.name}</h2>
              <p className="text-xs font-mono text-gray-500 mt-1">SKU: {product.sku} | Rating: {product.rating} ★</p>
              
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-mono text-white font-bold">${product.price.toLocaleString()}</span>
                {product.original_price && (
                  <span className="text-sm text-gray-500 line-through">${product.original_price.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Custom Interactive Tab Bar */}
            <div className="flex border-b border-white/10 text-xs uppercase font-mono tracking-widest my-5 gap-6">
              <button
                onClick={() => setCurrentTab('details')}
                className={`pb-2.5 transition-all ${currentTab === 'details' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-gray-400 hover:text-white'}`}
              >
                Atelier Narrative
              </button>
              <button
                onClick={() => setCurrentTab('specs')}
                className={`pb-2.5 transition-all ${currentTab === 'specs' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-gray-400 hover:text-white'}`}
              >
                Calibre Specs
              </button>
              <button
                onClick={() => setCurrentTab('reviews')}
                className={`pb-2.5 transition-all ${currentTab === 'reviews' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-gray-400 hover:text-white'}`}
              >
                Client Reviews ({reviews.length})
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 min-h-[160px] text-sm font-light text-gray-300 leading-relaxed">
              
              {currentTab === 'details' && (
                <div className="space-y-4">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-900">
                    <div className="flex items-center gap-2.5 text-xs text-gray-400">
                      <ShieldCheck className="h-4.5 w-4.5 text-[#D4AF37]" />
                      <span>2-Year International Warranty</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-400">
                      <CreditCard className="h-4.5 w-4.5 text-[#D4AF37]" />
                      <span>Cash on Delivery Only</span>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'specs' && (
                <div className="space-y-2.5 font-mono text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-neutral-900">
                      <span className="text-gray-500 uppercase tracking-wider">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentTab === 'reviews' && (
                <div className="space-y-5 max-h-72 overflow-y-auto pr-1">
                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-xs text-gray-500 font-mono italic">No approved client reviews registered for this lot yet. Yours could be first.</p>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-neutral-950 rounded-none border border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-serif font-bold text-[#D4AF37]">{rev.user_name}</span>
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-gray-800'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed italic">"{rev.comment}"</p>
                          <span className="text-[9px] text-gray-600 block mt-2 font-mono">
                            Verified Purchase • {new Date(rev.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleCreateReview} className="mt-6 pt-5 border-t border-white/10 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">Bespoke Review Submission</h4>
                    
                    {successMsg && (
                      <div className="p-2.5 bg-[#111111] border border-white/10 text-[#D4AF37] text-[11px] rounded-none">
                        {successMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Name</label>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Duke Wellington"
                          className="w-full bg-neutral-950 border border-white/10 rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Rating</label>
                        <select
                          value={newRating}
                          onChange={(e) => setNewRating(Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-white/10 rounded-none px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="5">5 Stars (Exquisite)</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="2">2 Stars</option>
                          <option value="1">1 Star</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Detailed Comment</label>
                      <textarea
                        required
                        rows={2}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="State your appreciation or critique..."
                        className="w-full bg-neutral-950 border border-white/10 rounded-none p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="inline-flex items-center gap-2 bg-[#111111] hover:bg-white hover:text-black border border-white/20 px-4 py-2 text-xs font-mono uppercase tracking-widest text-[#D4AF37] rounded-none transition-all cursor-pointer"
                    >
                      <Send className="h-3 w-3" />
                      <span>Submit Lot Evaluation</span>
                    </button>
                  </form>

                </div>
              )}

            </div>

            {/* Bottom Actions Row */}
            {!isOutOfStock && (
              <div id="modal-buy-action-panel" className="mt-6 pt-5 border-t border-white/10 flex items-center gap-4">
                <div className="flex items-center border border-white/10 bg-black rounded-none h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 text-gray-400 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-mono text-white font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 text-gray-400 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  id="add-to-cart-modal-btn"
                  onClick={() => onAddToCart(quantity)}
                  className="flex-1 flex items-center justify-center gap-3.5 px-8 h-12 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-none hover:bg-white hover:text-black transition-all duration-300"
                >
                  <ShoppingBag className="h-4.5 w-4.5 text-black" />
                  Add to Private Bag
                </button>

                <button
                  onClick={onToggleWishlist}
                  className={`h-12 w-12 border border-white/10 rounded-none flex items-center justify-center hover:border-red-500/40 hover:text-red-400 transition-all ${isWishlisted ? 'text-red-500 bg-red-950/10' : 'text-gray-400'}`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}

            {isOutOfStock && (
              <div className="mt-6 p-4 rounded bg-[#161616] text-center border border-gray-800">
                <p className="text-xs font-mono uppercase tracking-widest text-gray-400">Inventory Exhausted For Handcrafted Production</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
