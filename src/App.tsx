import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles, LayoutDashboard, ShoppingBag, Heart, Shield } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AdminDashboard from './components/AdminDashboard';
import CustomerChat from './components/CustomerChat';
import BrandStory from './components/BrandStory';
import ContactSection from './components/ContactSection';
import FaqSection from './components/FaqSection';
import Testimonials from './components/Testimonials';
import SupabaseGuide from './components/SupabaseGuide';
import Footer from './components/Footer';
import { db } from './dbMock';
import { Product, Category } from './types';

export default function App() {
  // Global View Navigation State
  const [isAdminView, setIsAdminView] = useState(false);
  
  // Catalog filter/search states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Basket & Wishlist metrics
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Drawer overlays controllers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeProductForModal, setActiveProductForModal] = useState<Product | null>(null);

  // Load initial indicators
  useEffect(() => {
    loadCatalog();
    syncCartAndWishlist();

    const handleDbUpdate = () => {
      loadCatalog();
      syncCartAndWishlist();
    };

    window.addEventListener('stylex_db_update', handleDbUpdate);
    return () => {
      window.removeEventListener('stylex_db_update', handleDbUpdate);
    };
  }, [isAdminView]);

  const loadCatalog = () => {
    setProducts(db.getProducts());
    setCategories(db.getCategories());
  };

  const syncCartAndWishlist = () => {
    // Sum cart quantities
    const cart = db.getCart();
    const qtySum = cart.reduce((acc, current) => acc + current.quantity, 0);
    setCartCount(qtySum);

    // Sum Wishlist length
    const saved = db.getWishlist();
    setWishlistCount(saved.length);
    setWishlistIds(saved);
  };

  // Add Product to Cart
  const handleAddToCart = (productId: string, quantity: number = 1) => {
    const cart = db.getCart();
    const itemIdx = cart.findIndex(item => item.product_id === productId);

    if (itemIdx > -1) {
      cart[itemIdx].quantity += quantity;
    } else {
      cart.push({ product_id: productId, quantity });
    }

    db.setCart(cart);
    syncCartAndWishlist();
    setIsCartOpen(true);
  };

  // Toggle wishlist state
  const handleToggleWishlist = (productId: string) => {
    const list = db.getWishlist();
    const isSaved = list.includes(productId);
    let updated: string[];

    if (isSaved) {
      updated = list.filter(id => id !== productId);
    } else {
      updated = [...list, productId];
    }

    db.setWishlist(updated);
    syncCartAndWishlist();
  };

  // Smooth scroll helper
  const navigateToSection = (sectionId: string) => {
    setIsAdminView(false); // return to customer flow
    setTimeout(() => {
      const element = document.getElementById(`stylex-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Filter Catalog
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort Catalog
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    // Featured first (or default creation sorting)
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* 1. Master Header Deck */}
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        onWishlistOpen={() => setIsWishlistOpen(true)}
        onAdminToggle={() => setIsAdminView(!isAdminView)}
        isAdmin={isAdminView}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onNavigateToSection={navigateToSection}
      />

      <main className="flex-grow">
        {isAdminView ? (
          /* 2A. EXECUTIVE SUITE ACTIVE VIEW */
          <div className="bg-[#0A0A0A] border-t border-b border-[#D4AF37]/15">
            <AdminDashboard />
          </div>
        ) : (
          /* 2B. VIP CLIENT VIEW (FULL SITE SECTIONS) */
          <>
            {/* Cinematic Hero */}
            <Hero onExploreClick={() => navigateToSection('collection')} />

            {/* Curated Collections Grid Segment */}
            <section id="stylex-collection" className="py-20 lg:py-28 px-6 lg:px-8 mx-auto max-w-7xl relative text-left">
              
              {/* Radial decor lighting and titles */}
              <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#4C1D95]/5 blur-[120px] pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900 pb-8">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase font-bold">
                    THE MONACO PARADIGM
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight font-extrabold uppercase mt-1 leading-normal">
                    Curated Masterpieces
                  </h2>
                  <p className="text-xs text-gray-500 font-light mt-1 max-w-md">
                    Filter by high-end categoric slots, query specific lot SKUs, or secure your VIP allocations instantly.
                  </p>
                </div>

                {/* Direct indicators */}
                <div className="flex items-center space-x-1.5 bg-[#12111A] border border-[#D4AF37]/35 rounded px-3 py-1 text-xs text-[#D4AF37] font-mono uppercase tracking-widest font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Only Authentics</span>
                </div>
              </div>

              {/* SEARCH & FILTERS CONTROLS DECK */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-10">
                
                {/* Visual Category tab selectors (7 columns) */}
                <div className="lg:col-span-8 flex flex-wrap gap-2.5 text-[10px] font-mono uppercase tracking-wider">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-4.5 py-2.5 rounded border transition-all cursor-pointer ${selectedCategory === 'All' ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-semibold' : 'bg-transparent border-gray-800 text-gray-400 hover:text-white'}`}
                  >
                    All Masterpieces
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-4.5 py-2.5 rounded border transition-all cursor-pointer ${selectedCategory === cat.name ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-semibold' : 'bg-transparent border-gray-800 text-gray-400 hover:text-white'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Search query input & sorting selectors (4 columns) */}
                <div className="lg:col-span-4 flex gap-3 text-xs">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Query Chrono, Keepall, Leather..."
                      className="w-full bg-[#111111] border border-gray-800 rounded px-10 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as any)}
                      className="bg-[#111111] border border-gray-800 rounded px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] uppercase tracking-wider text-[10px] font-mono"
                    >
                      <option value="featured">Featured First</option>
                      <option value="price-asc">Price: Low - High</option>
                      <option value="price-desc">Price: High - Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* PRODUCTS DISPLAY GRID */}
              {sortedProducts.length === 0 ? (
                <div className="text-center py-20 border border-zinc-900 rounded bg-[#0A0A0A]">
                  <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">No matching precious lots located inside registry.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={() => setActiveProductForModal(product)}
                      onAddToCart={() => handleAddToCart(product.id)}
                      onToggleWishlist={() => handleToggleWishlist(product.id)}
                      isWishlisted={wishlistIds.includes(product.id)}
                    />
                  ))}
                </div>
              )}

            </section>

            {/* Heritage Story segment */}
            <BrandStory />

            {/* Testimonials */}
            <Testimonials />

            {/* Dynamic Supabase Interactive Specifications Guide */}
            <SupabaseGuide />

            {/* Advisory FAQ accordions */}
            <FaqSection />

            {/* Inquiry and map Contact */}
            <ContactSection />
          </>
        )}
      </main>

      {/* 3. Global Footer Deck */}
      <Footer />

      {/* 4. Drawers, Modals & Concierge Chat Widgets overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCartUpdate={syncCartAndWishlist}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onCartAdd={(prodId) => handleAddToCart(prodId)}
        onToggleWishlist={handleToggleWishlist}
      />

      <ProductDetailsModal
        product={activeProductForModal}
        onClose={() => setActiveProductForModal(null)}
        onAddToCart={(qty) => {
          if (activeProductForModal) {
            handleAddToCart(activeProductForModal.id, qty);
            setActiveProductForModal(null);
          }
        }}
        onToggleWishlist={() => activeProductForModal && handleToggleWishlist(activeProductForModal.id)}
        isWishlisted={activeProductForModal ? wishlistIds.includes(activeProductForModal.id) : false}
      />

      {/* Floating customer support live attache (always present regardless of views) */}
      <CustomerChat />

    </div>
  );
}
