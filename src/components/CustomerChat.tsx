import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../dbMock';
import { ChatMessage } from '../types';

export default function CustomerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial load
    setMessages(db.getChatMessages());

    // Periodically pull fresh chat state from dbMock to reflect Admin dashboard replies in real-time
    const interval = setInterval(() => {
      const dbMsgs = db.getChatMessages();
      if (dbMsgs.length !== messages.length) {
        setMessages(dbMsgs);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [messages.length]);

  // Scroll downwards when message stack changes
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Append Customer message
    const customerMsg: ChatMessage = {
      id: `customer-msg-${Date.now()}`,
      sender_id: 'client-user-1',
      sender_name: 'VIP Client',
      message: inputText.trim(),
      created_at: new Date().toISOString(),
      is_admin: false,
    };

    const updated = [...db.getChatMessages(), customerMsg];
    db.setChatMessages(updated);
    setMessages(updated);
    setInputText('');

    // Trigger elegant automated direct support reply after 2.5 seconds to showcase luxury responsiveness
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const autoReplyText = getConciergeAutoReply(customerMsg.message);
      const autoMsg: ChatMessage = {
        id: `attache-msg-${Date.now()}`,
        sender_id: 'admin-id',
        sender_name: 'Style X Private Concierge',
        message: autoReplyText,
        created_at: new Date().toISOString(),
        is_admin: true,
      };

      const final = [...db.getChatMessages(), autoMsg];
      db.setChatMessages(final);
      setMessages(final);
    }, 2500);
  };

  // Fun helper replies mapping
  const getConciergeAutoReply = (text: string): string => {
    const query = text.toLowerCase();
    if (query.includes('price') || query.includes('cost') || query.includes('expensive')) {
      return "All Style X masterpiece valuations reflect rare Swiss materials and organic hand assembly. Cash on Delivery is verified during arrival to ensure absolute perfection before physical payment.";
    }
    if (query.includes('watch') || query.includes('chrono') || query.includes('rolex') || query.includes('royal')) {
      return "Our Swiss Horology catalog is exceptionally selective. Only a few movements are released monthly. If you have submitted a COD order for a timepiece, our director will call your phone soon.";
    }
    if (query.includes('ship') || query.includes('deliver') || query.includes('courier')) {
      return "Style X operates with private armored delivery partners to transport precious luxury metals securely. Shipping is complimentary and fully insured internationally.";
    }
    return "I have forwarded this specific request directly to the Director’s Desk. We are standing by to initiate your custom order confirmation callback.";
  };

  return (
    <div id="customer-floating-chat" className="fixed bottom-6 right-6 z-40 text-left">
      
      {/* Floating Toggle Bubble */}
      <button
        id="chat-toggle-bubble"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-none bg-black border border-[#D4AF37]/50 text-[#D4AF37] shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer relative group"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-[#D4AF37] opacity-75"></span>
          <span className="relative inline-flex rounded-none h-3 w-3 bg-[#D4AF37]"></span>
        </span>
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#0A0A0A] border border-[#D4AF37]/35 text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] px-3 py-1.5 rounded-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Private Concierge
        </div>
      </button>

      {/* Message Slate Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-window-box"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 h-96 bg-[#0A0A0A]/95 border border-white/10 rounded-none shadow-2xl flex flex-col overflow-hidden backdrop-blur"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-black to-neutral-900 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="h-2 w-2 rounded-none bg-emerald-500 absolute bottom-0.5 right-0 border border-[#0A0A0A]"></div>
                  <div className="h-7 w-7 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-[#D4AF37] font-bold">X</div>
                </div>
                <div>
                  <h4 className="text-xs font-serif font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    Style X Concierge
                    <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                  </h4>
                  <p className="text-[8px] font-mono text-[#D4AF37] tracking-widest uppercase">Digital Attache</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message Stack */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-black/40">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.is_admin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] p-3 rounded-none text-xs leading-normal ${m.is_admin ? 'bg-[#111111] text-gray-200 border border-white/10' : 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40'}`}>
                    <p className="font-sans">{m.message}</p>
                    <span className="text-[7.5px] font-mono text-gray-400 block mt-1.5 uppercase text-right">
                      {m.is_admin ? 'Concierge' : 'VIP Member'}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Typing simulation view */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#111111] rounded-none p-3 border border-white/10">
                    <span className="text-[8px] font-mono text-[#D4AF37] flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
                      Bespoke attache is crafting response...
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input send bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-black border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Submit your prompt parameters..."
                className="flex-1 bg-zinc-950 border border-white/10 text-xs px-3 py-2 rounded-none text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="p-2 bg-[#D4AF37] hover:bg-white text-black rounded-none transition-colors cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
