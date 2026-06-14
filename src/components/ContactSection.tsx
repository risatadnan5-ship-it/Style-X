import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess('Your high-priority portfolio inquiry has been safely routed. Our executive director will dispatch a response within 12 business hours.');
      setName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <section id="stylex-contact" className="relative bg-[#070707] py-20 lg:py-24 overflow-hidden text-left border-t border-gray-950">
      
      {/* Glow background */}
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header titles */}
        <div className="max-w-3xl text-left space-y-3 mb-16">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase font-bold">EXCELLENCE CORRESPONDENCE</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight font-extrabold uppercase leading-tight">
            Initiate Contact with Style X Concierge
          </h2>
          <div className="h-[1px] w-40 bg-[#D4AF37]/45 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Coordinates details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <p className="text-sm font-light text-gray-400 leading-relaxed">
              Whether arranging a private inspection suite for rare chronographs or discussing limited-run couture fittings, our private delegates are available across global regions.
            </p>

            <div className="space-y-6">
              
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 shrink-0 border border-neutral-900 rounded bg-zinc-950 flex items-center justify-center text-[#D4AF37]">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-serif font-black text-white uppercase tracking-wider mb-1">Monaco Atrium HQ</h4>
                  <p className="text-gray-400 font-light leading-relaxed">14 Avenue d’Ostende, Monte Carlo, Monaco 98000</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 shrink-0 border border-neutral-900 rounded bg-zinc-950 flex items-center justify-center text-[#D4AF37]">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-serif font-black text-white uppercase tracking-wider mb-1">Direct Secure Line</h4>
                  <p className="text-gray-400 font-mono">+377 93 25 1200 / priority callback enabled</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 shrink-0 border border-neutral-900 rounded bg-zinc-950 flex items-center justify-center text-[#D4AF37]">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-serif font-black text-white uppercase tracking-wider mb-1">Secure Courier Correspondence</h4>
                  <p className="text-gray-400 font-mono">concierge@stylex.luxury</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 shrink-0 border border-neutral-900 rounded bg-zinc-950 flex items-center justify-center text-[#D4AF37]">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-serif font-black text-white uppercase tracking-wider mb-1">Private client Hours</h4>
                  <p className="text-gray-400 font-light">Available: 08:00 – 21:00 UTC+1 (Monaco Standard Time)</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Submission inquiry form (7 cols) */}
          <div className="lg:col-span-7 bg-[#0E0E0E] p-6 lg:p-8 rounded border border-gray-900 shadow-2xl text-left">
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-widest text-[#D4AF37] border-b border-zinc-900 pb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Electronic Inquiry Dossier
              </h3>

              {success && (
                <div className="p-3 bg-purple-950/40 border border-[#D4AF37]/35 text-[#D4AF37] text-xs rounded leading-normal">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Baroness Evelyn"
                    className="w-full bg-[#070707] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Secure Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. evelyn@luxury.com"
                    className="w-full bg-[#070707] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Bespoke Inquiry Narrative</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="State your required dimensions, lot specifications, or consultation request..."
                  className="w-full bg-[#070707] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-[#4C1D95] to-[#D4AF37] text-white text-xs font-mono font-bold uppercase tracking-widest rounded-sm hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4 text-[#D4AF37]" />
                <span>Submit Lot inquiry</span>
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
}
