import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isWishlisted: boolean;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: ProductCardProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const discountAmount = product.original_price ? product.original_price - product.price : 0;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div
      id={`product-card-${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-none border border-white/10 bg-[#0A0A0A] transition-all duration-300 hover:border-[#D4AF37]/45 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)]"
    >
      {/* Top badges bar */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
        {discountAmount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-none bg-red-950/90 border border-red-500/30 px-2 py-0.5 text-[8px] font-mono font-bold tracking-widest text-red-200 uppercase">
            <Sparkles className="h-2 w-2 text-red-300" />
            Save ${(product.original_price! - product.price).toLocaleString()}
          </span>
        )}
        {product.featured && (
          <span className="inline-flex items-center gap-1 rounded-none bg-[#0A0A0A] border border-[#D4AF37]/50 px-2 py-0.5 text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase font-semibold">
            Atelier Exclusive
          </span>
        )}
        {isOutOfStock ? (
          <span className="rounded-none bg-gray-950 border border-gray-800 px-2 py-0.5 text-[8px] font-mono tracking-widest text-gray-400 uppercase font-bold">
            Acquired / Out Of Stock
          </span>
        ) : isLowStock ? (
          <span className="rounded-none bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 text-[8px] font-mono tracking-widest text-amber-300 uppercase font-bold animate-pulse">
            Only {product.stock} Left
          </span>
        ) : null}
      </div>

      {/* Top right quick-wishlist button */}
      <button
        id={`wish-toggle-${product.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist();
        }}
        className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-none bg-[#0A0A0A]/95 backdrop-blur-md border border-white/10 text-gray-300 hover:border-[#D4AF37] hover:text-red-400 transition-all duration-200"
      >
        <Heart className={`h-4 w-4 transition-transform duration-200 active:scale-125 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Product Image Section */}
      <div 
        id={`image-viewer-${product.id}`}
        onClick={onViewDetails}
        className="relative aspect-square w-full overflow-hidden bg-zinc-950 cursor-pointer"
      >
        <img
          src={product.image_urls[activeImageIdx] || 'https://images.unsplash.com/photo-1547996160-81dfa63595aa'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Thumbnail switcher overlay on hover (if multi-image) */}
        {product.image_urls.length > 1 && isHovered && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-[#0A0A0A]/85 px-2.5 py-1 rounded-none backdrop-blur-md border border-white/10">
            {product.image_urls.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx(idx);
                }}
                className={`h-1.5 w-1.5 transition-all ${idx === activeImageIdx ? 'bg-[#D4AF37] w-3' : 'bg-gray-500'}`}
              />
            ))}
          </div>
        )}

        {/* Floating action sheet on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            id={`hover-quick-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-none bg-[#D4AF37] text-black shadow-lg hover:bg-white transition-colors"
            title="Inspect Narrative"
          >
            <Eye className="h-5 w-5" />
          </button>
          {!isOutOfStock && (
            <button
              id={`hover-quick-add-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-none bg-black text-white border border-white/20 shadow-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
              title="Acquire Lot"
            >
              <ShoppingBag className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Information Section */}
      <div id={`info-${product.id}`} className="flex flex-1 flex-col p-4 text-left">
        <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase mb-1">
          {product.category}
        </span>
        
        <h3 
          onClick={onViewDetails}
          className="text-sm font-serif font-semibold text-white tracking-wide group-hover:text-[#D4AF37] cursor-pointer line-clamp-1 transition-colors"
        >
          {product.name}
        </h3>

        {/* Star Rating display */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-600'}`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-gray-400">({product.rating.toFixed(1)})</span>
        </div>

        {/* Pricing tag block */}
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold tracking-wide text-white font-mono">
              ${product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="text-xs text-gray-500 line-through font-mono">
                ${product.original_price.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-500 font-mono tracking-widest">
            {product.sku}
          </span>
        </div>

        {/* Mobile View CTA Button */}
        <div className="mt-4 md:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            disabled={isOutOfStock}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-none bg-[#111111] hover:bg-[#1C1C1D] border border-white/10 text-[10px] font-mono font-bold tracking-widest text-white uppercase transition-all"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#D4AF37]" />
            {isOutOfStock ? 'Sold Out' : 'Acquire'}
          </button>
        </div>
      </div>
    </div>
  );
}
