import React from 'react';
import { motion } from 'motion/react';
import { Shield, Award, Sparkles, Navigation } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <div id="stylex-hero" className="relative min-h-[90vh] flex items-center justify-center bg-[#070707] overflow-hidden py-16">
      
      {/* Background radial soft light purple & gold glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/4 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#D4AF37]/8 blur-[140px] pointer-events-none"></div>

      {/* Decorative vertical gold grid line */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 z-10 w-full text-center lg:text-left">
        
        {/* Text Content Block */}
        <div id="hero-taglines-block" className="flex-1 space-y-8 max-w-2xl lg:max-w-none">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-[#12111A] border border-[#D4AF37]/35 rounded-full px-4 py-1.5"
          >
            <Sparkles className="h-4 w-4 text-[#D4AF37] animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
              ESTABLISHED MCMLXVI • MONACO
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-7xl font-light text-white tracking-tight leading-[1.1]"
          >
            Reimagine <br />
            <span className="font-extrabold uppercase bg-gradient-to-r from-white via-[#E6C657] to-[#D4AF37] bg-clip-text text-transparent">
              Haute Elegance
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-gray-400 font-light leading-relaxed max-w-xl mx-auto lg:mx-0"
          >
            Style X represents the ultimate curation of premium chronographs, hand-sewn Parisian leather goods, and high-fashion runway ready statement wear. Handcrafted for the selective sovereign.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              id="hero-explore-button"
              onClick={onExploreClick}
              className="group relative w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] shadow-2xl rounded-none transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"
            >
              Explore Collection
            </button>
            <button
              id="hero-story-button"
              onClick={() => {
                const element = document.getElementById('stylex-brand-story');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 border border-white/20 text-xs text-white hover:bg-white hover:text-black font-bold uppercase tracking-[0.2em] bg-transparent rounded-none transition-all duration-300 cursor-pointer"
            >
              Read Legacy
            </button>
          </motion.div>

          {/* Core Brand Merits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 pt-8 border-t border-[#D4AF37]/15 max-w-xl mx-auto lg:mx-0"
          >
            <div className="text-left">
              <span className="block font-serif text-lg font-bold text-white tracking-widest">100%</span>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">Authentic</span>
            </div>
            <div className="text-left">
              <span className="block font-serif text-lg font-bold text-[#D4AF37] tracking-widest">COD</span>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">Paid On Hand</span>
            </div>
            <div className="text-left">
              <span className="block font-serif text-lg font-bold text-white tracking-widest">MONACO</span>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">Design HQ</span>
            </div>
          </motion.div>

        </div>

        {/* Cinematic Visual Showcase Image Frame */}
        <motion.div 
          id="hero-cinematic-showcase" 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 w-full max-w-md lg:max-w-none relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-none overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(212,175,55,0.06)] bg-[#121212]"
        >
          {/* Overlay to create deep editorial shadows */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/30 z-10 pointer-events-none"></div>
          
          <img 
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=900" 
            alt="Style X Chronomaster" 
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-10000 ease-out hover:scale-105"
          />

          {/* Small Floating Details Box */}
          <div id="floating-gold-card" className="absolute bottom-6 left-6 right-6 z-20 backdrop-blur-md bg-[#0A0A0A]/75 p-5 rounded-none border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <div className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center border border-[#D4AF37]/50">
                <Shield className="h-4 w-4 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-[11px] font-mono text-[#D4AF37] tracking-widest uppercase">Secured Escrow</h4>
                <p className="text-[10px] text-gray-300">Cash on Delivery verified inspections.</p>
              </div>
            </div>
            <span className="text-xs font-mono text-white/50">#SX400</span>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
