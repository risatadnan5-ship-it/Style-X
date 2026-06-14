import React, { useState } from 'react';
import { Mail, Sparkles, AlertCircle } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const [emailValue, setEmailValue] = useState('');
  const [newsSuccess, setNewsSuccess] = useState('');

  const handleNewsConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue) return;

    setNewsSuccess('Your credentials have been logged. You are now designated within Style X’s private release registry.');
    setEmailValue('');
  };

  return (
    <footer id="stylex-footer" className="relative bg-[#050505] border-t border-[#D4AF37]/15 pt-16 pb-8 text-left">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
        
        {/* Top: Branding and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-zinc-900 pb-12">
          
          <div className="lg:col-span-4 space-y-3">
            <span className="font-serif text-2xl font-black uppercase tracking-[0.25em] text-white">
              Style <span className="text-[#D4AF37]">X</span>
            </span>
            <p className="text-xs text-gray-500 font-light max-w-sm leading-relaxed">
              Timeless Swiss watches, hand-sewn Parisian leather goods, and high-fashion garments curated for luxury enthusiasts globally.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <h4 className="text-xs font-serif font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              Enroll in Style X Private release registry
            </h4>
            
            {newsSuccess && (
              <p className="p-2.5 bg-purple-950/45 border border-[#D4AF37]/30 text-[#D4AF37] text-xs rounded mb-3">{newsSuccess}</p>
            )}

            <form onSubmit={handleNewsConfirm} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Submit your email for rare lot notifications..."
                className="flex-1 bg-zinc-950 border border-gray-800 text-xs px-4 py-3 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#E6C657] text-black px-6 py-3 text-xs font-mono font-bold uppercase rounded"
              >
                Enroll Private Suite
              </button>
            </form>
          </div>

        </div>

        {/* Center: Directory links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-light text-gray-400">
          
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-white uppercase tracking-wider">Collections Directory</h5>
            <ul className="space-y-2">
              <li><a href="#stylex-collection" className="hover:text-[#D4AF37]">⏱ Swiss Horology</a></li>
              <li><a href="#stylex-collection" className="hover:text-[#D4AF37]">👜 Haute Leather Bags</a></li>
              <li><a href="#stylex-collection" className="hover:text-[#D4AF37]">🧥 Atelier Apparel Wear</a></li>
              <li><a href="#stylex-collection" className="hover:text-[#D4AF37]">✨ Signature Fragrances</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-serif font-bold text-white uppercase tracking-wider">Concierge Suite</h5>
            <ul className="space-y-2">
              <li><a href="#stylex-faq" className="hover:text-[#D4AF37]">Frequently Asked Issues</a></li>
              <li><a href="#stylex-contact" className="hover:text-[#D4AF37]">Contact secure lines</a></li>
              <li><a href="#stylex-brand-story" className="hover:text-[#D4AF37]">Monaco Architecture</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-serif font-bold text-white uppercase tracking-wider">Legal parameters</h5>
            <ul className="space-y-2">
              <li><span className="text-gray-600 block">Terms of Service</span></li>
              <li><span className="text-gray-600 block">Sovereign Privacy Policy</span></li>
              <li><span className="text-gray-600 block">Insurance Escrow parameters</span></li>
              <li><span className="text-gray-600 block">COD Authenticity guarantee</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-serif font-bold text-white uppercase tracking-wider">Digital sitemap</h5>
            <ul className="space-y-2">
              <li><span className="text-gray-600 block font-mono">Disallow: /admin</span></li>
              <li><span className="text-gray-600 block font-mono">Allow: /index.html</span></li>
              <li><span className="text-gray-600 block font-mono">Sitemap: /sitemap.xml</span></li>
              <li><span className="text-gray-600 block font-mono">Robots: /robots.txt</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright declaration */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-zinc-900 pt-8 mt-8 text-[11px] text-gray-500 font-mono">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p>© {new Date().getFullYear()} STYLE X MONACO COUTURE S.A. ALL SOVEREIGN RIGHTS ENCRYPTED.</p>
            {onAdminClick && (
              <button
                type="button"
                onClick={onAdminClick}
                className="text-[#D4AF37] hover:text-white uppercase transition-all tracking-[0.15em] border border-[#D4AF37]/30 hover:border-[#D4AF37] px-2 py-0.5 rounded text-[9px] cursor-pointer inline-flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                Executive Admin Console
              </button>
            )}
          </div>
          <div className="flex gap-2 items-center text-[#D4AF37]">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Secure Cash on Delivery Inspections Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
