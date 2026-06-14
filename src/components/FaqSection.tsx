import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does the Cash on Delivery (COD) inspection process function?",
    answer: "To ensure absolute sovereign trust, Style X operates strictly via COD. Upon direct delivery by our armored logistics partners, you will be invited to personally inspect the chronograph weight, serial stamps, leather stitchings, and certificates inside our velvet presentation box. Once fully satisfied, physical courier payment is finalized."
  },
  {
    question: "Do Style X watch lots carry active warranties?",
    answer: "Absolutely. Every Swiss timepiece lot carries a 2-Year International Style X Horology Certificate of Guarantee. This certificate is stamped with our Monaco laser watermark and matching SKU tags, authorizing complimentary repair across all Swiss-delegated centers."
  },
  {
    question: "What is the delivery timeline for international couture items?",
    answer: "All orders are packed inside our Monaco facility within 24 hours of successful telephone confirmation callbacks. Handcrafted leather luggage and silk garments are shipped via priority air dispatch, arriving internationally within 3 to 5 business days."
  },
  {
    question: "Can I connect this interface to my custom Supabase database?",
    answer: "Yes, fully! Inside our 'Supabase Blueprint' tab, you can view the direct PostgreSQL layout and policies code. You can integrate this with your Supabase credentials variables, allowing authentic customer registrations, file uploads to storage buckets, and live order states instantly."
  },
  {
    question: "How can I apply premium coupon overriding passcodes?",
    answer: "Simply enter active codes like STYLEUX10 (10% catalog discount) or VIPSTYLE20 (20% VIP customer override) into the promotional credentials box inside your private cart checkout drawer. Subtotal invoices update instantly before submitting shipper addresses."
  }
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <section id="stylex-faq" className="bg-[#0A0A0A] py-20 lg:py-24 border-t border-b border-[#D4AF37]/15">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase font-bold">VIP ADVISORY LOGIC</span>
          <h2 className="text-3xl font-serif text-white tracking-tight font-extrabold uppercase">
            Concierge FAQ & Directives
          </h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        {/* Accordions */}
        <div id="faq-accordions-group" className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpened = activeIndex === idx;
            return (
              <div 
                key={idx}
                id={`faq-item-${idx}`}
                className="rounded border border-gray-900 bg-[#0E0E0E] transition-all hover:border-[#D4AF37]/35"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-serif font-bold text-gray-200 focus:outline-none"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-4.5 w-4.5 text-[#D4AF37] shrink-0" />
                    {item.question}
                  </span>
                  {isOpened ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>

                {isOpened && (
                  <div className="p-5 border-t border-neutral-900 text-xs font-light text-gray-400 leading-relaxed text-left animate-slideDown">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
