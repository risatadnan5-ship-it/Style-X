import React from 'react';
import { Star, ShieldAlert, Heart } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  comment: string;
  stars: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Baroness de Rothschild",
    role: "Château Executive Patron",
    comment: "The custom Chrono-Master Legacy arrived in Bordeaux within 36 hours. The gold casing weight is exceptional under natural cellar lighting. Exemplary service.",
    stars: 5
  },
  {
    name: "Archibald Mountbatten",
    role: "Sotheby’s Director Delegate",
    comment: "I personally analyzed the saddle-stitchings on Style X’s Sovereign Keepall. It surpasses heritage trunk makers in tensile strength and leather texture consistency.",
    stars: 5
  },
  {
    name: "Madeline Van Der Bilt",
    role: "Private Aviation G6 Consignee",
    comment: "The Aether Noir fragrance notes are enchanting and complex, attracting compliments across executive flights. Highly recommend their bespoke concierge chat.",
    stars: 5
  }
];

export default function Testimonials() {
  return (
    <section id="stylex-testimonials" className="bg-[#070707] py-20 lg:py-24 border-t border-b border-[#D4AF37]/15 relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#4C1D95]/5 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left space-y-3 mb-14 max-w-3xl">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase font-bold">VIP CHRONICLE WRITES</span>
          <h2 className="text-3xl font-serif text-white tracking-tight font-extrabold uppercase truncate">
            Client Appreciation Letters
          </h2>
          <div className="h-[1px] w-28 bg-[#D4AF37]/50 mt-2"></div>
        </div>

        {/* List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              id={`testi-${idx}`}
              className="p-6 rounded bg-[#0E0E0E] border border-gray-900 flex flex-col justify-between text-left transition-all duration-300 hover:border-[#D4AF37]/25"
            >
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-serif text-gray-300 italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-900 mt-6 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-serif font-black text-white uppercase tracking-wider">{t.name}</h4>
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{t.role}</span>
                </div>
                <Heart className="h-4.5 w-4.5 text-[#D4AF37]/50 fill-current" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
