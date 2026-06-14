import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, User, Sparkles, Bell, Shield, MessageSquare, LogOut, CheckCircle, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../dbMock';
import { supabase } from '../supabaseClient';
import { Notification } from '../types';

interface HeaderProps {
  onCartOpen: () => void;
  onWishlistOpen: () => void;
  onAdminToggle: () => void;
  isAdmin: boolean;
  cartCount: number;
  wishlistCount: number;
  onNavigateToSection: (section: string) => void;
}

export default function Header({
  onCartOpen,
  onWishlistOpen,
  onAdminToggle,
  isAdmin,
  cartCount,
  wishlistCount,
  onNavigateToSection,
}: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(db.getCurrentUser());
  const [showAdminPasswordPrompt, setShowAdminPasswordPrompt] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Load default status notifications
    const defaultNotifs: Notification[] = [
      {
        id: 'n-1',
        title: 'Bespoke Order Confirmed',
        message: 'Order #SX-8849 has been updated to Confirmed status.',
        read: false,
        type: 'order',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'n-2',
        title: 'Sovereign Keepall Restocked',
        message: 'Exclusive French travel keepall is now in stock.',
        read: false,
        type: 'stock',
        created_at: new Date(Date.now() - 7200000).toISOString(),
      }
    ];
    setNotifications(defaultNotifs);

    // Sync current user context nicely
    const interval = setInterval(() => {
      setCurrentUser(db.getCurrentUser());
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleSwitchRole = async (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setShowAdminPasswordPrompt(true);
      setAdminPasswordInput('');
      setPasswordError('');
      setUserMenuOpen(false);
      return;
    }
    
    // Log out of Supabase Auth on reverting back to client role
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[SUPABASE AUTH SIGNOUT ERROR]', err);
    }

    const nextUser = {
      id: 'client-user-1',
      email: 'guest@stylex.luxury',
      role: 'customer' as const,
    };
    db.setCurrentUser(nextUser);
    setCurrentUser(nextUser);
    if (isAdmin) {
      onAdminToggle();
    }
    setUserMenuOpen(false);
  };

  return (
    <header id="stylex-header" className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/85 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* Left: Brand Logo */}
        <div 
          id="header-brand-container"
          className="flex cursor-pointer items-center space-x-2.5" 
          onClick={() => onNavigateToSection('hero')}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-none bg-gradient-to-tr from-black to-[#D4AF37]/60">
            <span className="font-serif text-lg font-bold text-white tracking-widest">X</span>
            <div className="absolute -inset-0.5 rounded-none border border-[#D4AF37]/40 animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-black uppercase tracking-[0.3em] text-white">
              Style <span className="text-[#D4AF37]">X</span>
            </span>
            <span className="text-[9px] font-mono tracking-[0.5em] text-gray-400 uppercase">Haute Couture</span>
          </div>
        </div>

        {/* Center: Luxury Navigation */}
        <nav id="header-nav-menu" className="hidden md:flex items-center space-x-8 text-xs font-medium uppercase tracking-[0.2em] text-gray-300">
          <button 
            id="nav-btn-catalog"
            onClick={() => onNavigateToSection('collection')} 
            className="hover:text-[#D4AF37] transition-colors duration-200"
          >
            Collections
          </button>
          <button 
            id="nav-btn-brand-story"
            onClick={() => onNavigateToSection('story')} 
            className="hover:text-[#D4AF37] transition-colors duration-200"
          >
            Legacy
          </button>
          <button 
            id="nav-btn-faq"
            onClick={() => onNavigateToSection('faq')} 
            className="hover:text-[#D4AF37] transition-colors duration-200"
          >
            Concierge FAQ
          </button>
          <button 
            id="nav-btn-database"
            onClick={() => onNavigateToSection('supabase')} 
            className="flex items-center space-x-1.5 text-[#D4AF37] hover:text-white transition-colors duration-200"
          >
            <Sparkles className="h-3 w-3" />
            <span>Supabase Code</span>
          </button>
        </nav>

        {/* Right: Functional Control Deck */}
        <div id="header-controls-group" className="flex items-center space-x-5">
          
          {/* Quick Role Toggle Bar indicator */}
          <div className="hidden lg:flex items-center bg-[#111111] p-1 rounded-none border border-white/10 text-[10px]">
            <button
              id="switch-to-client-btn"
              onClick={() => { if (isAdmin) handleSwitchRole('customer'); }}
              className={`px-3 py-1 rounded-none transition-all duration-300 ${!isAdmin ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              VIP Client
            </button>
            <button
              id="switch-to-admin-btn"
              onClick={() => { if (!isAdmin) handleSwitchRole('admin'); }}
              className={`px-3 py-1 rounded-none transition-all duration-300 ${isAdmin ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              Director Admin
            </button>
          </div>

          {/* Active Notifications System */}
          <div className="relative">
            <button
              id="header-notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-gray-300 hover:text-[#D4AF37] transition-colors duration-200 focus:outline-none"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  id="notifications-popup-drawer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute right-0 mt-3 w-80 rounded-none border border-white/10 bg-[#0A0A0A] p-4 shadow-2xl ring-1 ring-black/5"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                    <span className="font-serif text-sm font-semibold text-white tracking-widest uppercase">Directives</span>
                    {unreadCount > 0 && (
                      <button 
                        id="notif-mark-read-btn"
                        onClick={markAllAsRead} 
                        className="text-[9px] text-[#D4AF37] uppercase tracking-wider hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-[11px] text-gray-500 text-center py-4">No active directives inside your logs.</p>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-2.5 rounded-none text-left transition-colors ${notif.read ? 'bg-transparent' : 'bg-white/[0.03] border-l-2 border-[#D4AF37]'}`}>
                          <h4 className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                            {!notif.read && <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />}
                            {notif.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{notif.message}</p>
                          <span className="text-[8px] text-gray-600 font-mono mt-1.5 block">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist Trigger */}
          <button
            id="header-wishlist-trigger"
            onClick={onWishlistOpen}
            className="p-2.5 text-gray-300 hover:text-red-400 transition-colors duration-200 relative focus:outline-none"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Luxury Cart Trigger */}
          <button
            id="header-cart-trigger"
            onClick={onCartOpen}
            className="p-2.5 text-gray-100 hover:text-[#D4AF37] transition-all duration-200 relative rounded-none bg-[#111111] border border-white/10 focus:outline-none"
          >
            <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black shadow-md border border-[#0A0A0A]">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Admin Center Menu */}
          <div className="relative">
            <button
              id="header-user-account-menu"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-1.5 p-1 rounded-none border border-white/10 hover:border-[#D4AF37]/50 transition-colors focus:outline-none"
            >
              <div className="h-8 w-8 rounded-none bg-gradient-to-tr from-neutral-900 to-black border border-white/10 flex items-center justify-center text-xs text-[#D4AF37] font-bold uppercase">
                {currentUser?.role === 'admin' ? 'AD' : 'G'}
              </div>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  id="user-account-dropdown"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 rounded-none border border-white/10 bg-[#0A0A0A] p-2.5 shadow-2xl"
                >
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Active Client</p>
                    <p className="text-xs font-semibold text-white truncate mt-0.5">{currentUser?.email}</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 mt-1 rounded-none ${currentUser?.role === 'admin' ? 'bg-white/10 text-white' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
                      <Shield className="h-2.5 w-2.5" />
                      {currentUser?.role === 'admin' ? 'Style Director' : 'VIP Member'}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <button
                      id="account-action-profile"
                      onClick={() => { setUserMenuOpen(false); alert('Profile configuration requires live Supabase authentication database. Please review the Supabase interactive blueprints below to initialize your cloud credentials.'); }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/[0.04] hover:text-white rounded-none transition-colors flex items-center justify-between"
                    >
                      <span>Secure Profile</span>
                      <User className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                    <div className="my-1 border-t border-white/10"></div>
                    <div className="px-2 pt-1 pb-1">
                      <p className="text-[8px] font-semibold text-gray-500 uppercase tracking-widest px-1 mb-1">Simulate Roles</p>
                      <button
                        id="simulate-customer-option"
                        onClick={() => handleSwitchRole('customer')}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded-none transition-colors flex items-center justify-between ${currentUser?.role === 'customer' ? 'bg-white/[0.05] text-[#D4AF37]' : 'text-gray-400 hover:text-white'}`}
                      >
                        <span>Customer Experience</span>
                        {!isAdmin && <CheckCircle className="h-3 w-3 text-[#D4AF37]" />}
                      </button>
                      <button
                        id="simulate-admin-option"
                        onClick={() => handleSwitchRole('admin')}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded-none transition-colors flex items-center justify-between ${currentUser?.role === 'admin' ? 'bg-white/[0.05] text-[#D4AF37]' : 'text-gray-400 hover:text-white'}`}
                      >
                        <span>Admin Dashboard</span>
                        {isAdmin && <CheckCircle className="h-3 w-3 text-[#D4AF37]" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Admin Password Prompt Overlay */}
      <AnimatePresence>
        {showAdminPasswordPrompt && (
          <motion.div
            id="admin-password-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 p-8 shadow-2xl text-left rounded-none"
            >
              <button
                id="close-password-modal-btn"
                onClick={() => {
                  setShowAdminPasswordPrompt(false);
                  setAdminPasswordInput('');
                  setPasswordError('');
                }}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white transition-colors border border-white/10 rounded-none cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center space-x-3 text-[#D4AF37] mb-6">
                <div className="h-10 w-10 flex items-center justify-center border border-[#D4AF37]/35 bg-white/5 rounded-none">
                  <Lock className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold uppercase tracking-widest text-white leading-tight">Director Authorization</h3>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Restricted Executive Entry</p>
                </div>
              </div>

              <form
                id="admin-password-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (adminPasswordInput === 'risatx') {
                    // Try to automate actual Supabase Auth Session
                    try {
                      const adminEmail = 'admin@stylex.luxury';
                      const adminPassword = 'BespokeAdminPassword123!';

                      const { data, error } = await supabase.auth.signInWithPassword({
                        email: adminEmail,
                        password: adminPassword,
                      });

                      if (error && error.message.includes('Invalid login credentials')) {
                        // User not exists yet, perform auto register
                        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
                          email: adminEmail,
                          password: adminPassword,
                          options: {
                            data: {
                              full_name: 'Style X Owner',
                              role: 'admin'
                            }
                          }
                        });
                        
                        if (signUpErr) {
                          console.info('[SUPABASE ADMIN REGISTRATION INFO]', signUpErr.message);
                          console.warn('Supabase sign-up rate limit, falling back to local session.');
                        } else {
                          console.log('[SUPABASE] Admin account registered successfully.');
                          // Force role column mapping in profile
                          await supabase.from('profiles').update({ role: 'admin' }).eq('id', signUpData.user?.id);
                        }
                      } else if (error) {
                        console.info('[SUPABASE ADMIN SIGNIN INFO]', error.message);
                        console.warn('Supabase sign-in rate limit, falling back to local session.');
                      } else {
                        console.log('[SUPABASE] Admin session created. Auth ID:', data.user?.id);
                      }
                    } catch (authExc) {
                      console.error('[SUPABASE AUTO-AUTH CONTAINER EXCEPTION]', authExc);
                    }

                    const nextUser = {
                      id: 'admin-id-1',
                      email: 'admin@stylex.luxury',
                      role: 'admin' as const,
                    };
                    db.setCurrentUser(nextUser);
                    setCurrentUser(nextUser);
                    if (!isAdmin) {
                      onAdminToggle();
                    }
                    setShowAdminPasswordPrompt(false);
                    setAdminPasswordInput('');
                    setPasswordError('');
                    setUserMenuOpen(false);
                  } else {
                    setPasswordError('Invalid credentials. Access denied by authentication vault.');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Security Passcode
                  </label>
                  <input
                    type="password"
                    id="admin-password-field"
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="Enter security passcode..."
                    autoFocus
                    className="w-full bg-[#111111] border border-white/10 p-3.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all rounded-none font-mono text-center tracking-[0.25em]"
                  />
                  {passwordError && (
                    <div className="text-[10px] font-mono text-red-400 mt-3 p-3 bg-red-950/20 border border-red-900/30 text-left leading-relaxed uppercase">
                      <span className="font-bold text-red-500 block mb-1">Authorization Exception:</span>
                      {passwordError}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminPasswordPrompt(false);
                      setAdminPasswordInput('');
                      setPasswordError('');
                    }}
                    className="flex-1 py-3 border border-white/10 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-all rounded-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-white transition-all rounded-none cursor-pointer"
                  >
                    Authorize
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
