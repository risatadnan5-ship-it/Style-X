import React from 'react';
import { Award, Compass, Gift, Milestone } from 'lucide-react';

export default function BrandStory() {
  return (
    <section id="stylex-brand-story" className="relative bg-[#070707] py-20 lg:py-28 overflow-hidden text-left border-t border-white/10">
      
      {/* Visual background elements */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-none bg-[#D4AF37]/3 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Dynamic header and titles */}
        <div className="max-w-3xl text-left space-y-3 mb-16 lg:mb-24">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase font-bold">The Heritage Narrative</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight font-extrabold leading-normal">
            BORN IN MONACO • TAILORED FOR CONTINENTAL EXECUTIVE POWER
          </h2>
          <div className="h-1 w-20 bg-[#D4AF37] mt-3"></div>
        </div>

        {/* Story matrix layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Paragraph copy text column (7 cols) */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6 text-gray-300 font-light text-sm leading-relaxed">
            <p>
              Style X was established in Monaco under a singular visionary directive: to design accessories and garments that look, feel, and function as absolute, peerless masterpieces. Rejecting the frantic, mass-production kinetics of the modern era, our design house constructs small, numbered lot releases.
            </p>
            <p>
              Every chronograph houses hand-tuned Swiss calibres, calibrated to absolute milliseconds and encased in gold forged by proprietary metallurgies. Every sovereign keepall is assembled using full grain hides sourced from regenerative meadows, hand stitched using reinforced linen fibers to survive generations.
            </p>
            <p>
              "Style X is not apparel or machinery. It is a materialization of sovereign security, legacy posture, and absolute visual composure. There is zero compromise."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 shrink-0 border border-white/10 rounded-none bg-zinc-950 flex items-center justify-center text-[#D4AF37]">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-black text-white uppercase tracking-wider mb-1">Swiss movement grade</h4>
                  <p className="text-[11px] text-gray-400">Chronograph watches certified with Swiss COSC power precision standards.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 shrink-0 border border-white/10 rounded-none bg-zinc-950 flex items-center justify-center text-[#D4AF37]">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-black text-white uppercase tracking-wider mb-1">Parisian leather craft</h4>
                  <p className="text-[11px] text-gray-400">Exclusive full-grain calfskins assembled with double locking saddle stitching.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Large image showcase / quote container columns (5 cols) */}
          <div className="lg:col-span-12 xl:col-span-5 relative aspect-[4/5] rounded-none border border-white/10 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800" 
              alt="Style X leather work" 
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover" 
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 text-left bg-black/80 backdrop-blur-md p-5 rounded-none border border-white/10">
              <p className="text-xs text-gray-300 italic">"The weight of our watches, the smooth slide of our brass zippers, the silhouette of our silk linings. High-end craft has an audio and physical texture."</p>
              <span className="block text-[8px] font-mono text-[#D4AF37] uppercase tracking-widest mt-2">Style X Design Director</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
