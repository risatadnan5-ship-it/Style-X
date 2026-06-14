import { Product, Category, Order, OrderItem, Review, ChatMessage, Coupon } from './types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_COUPONS } from './data';
import { supabase } from './supabaseClient';

// Key names for localStorage
const KEYS = {
  PRODUCTS: 'stylex_db_products',
  CATEGORIES: 'stylex_db_categories',
  ORDERS: 'stylex_db_orders',
  ORDER_ITEMS: 'stylex_db_order_items',
  REVIEWS: 'stylex_db_reviews',
  CHAT_MESSAGES: 'stylex_db_chat_messages',
  COUPONS: 'stylex_db_coupons',
  CURRENT_USER: 'stylex_db_current_user',
  WISHLIST: 'stylex_db_wishlist',
  CART: 'stylex_db_cart',
};

// Retrieve or initialize data helper
function get<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Default reviews for presentation
const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-chrono-gold',
    product_name: 'Style X Chrono-Master Legacy 40',
    user_name: 'Lord Horatio Audley',
    rating: 5,
    comment: 'The weight of this 18k Oystersteel is absolute perfection. Truly a monumental timepiece. Style X delivery was discreet and prompt.',
    status: 'approved',
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  },
  {
    id: 'rev-2',
    product_id: 'prod-birkin-suede',
    product_name: 'Sovereign Travel Keepall 55',
    user_name: 'Isabella Mountbatten',
    rating: 5,
    comment: 'Flawless calfskin texture. Smells premium. It is the perfect weekend companion for continental travel. Magnifique!',
    status: 'approved',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'rev-3',
    product_id: 'prod-royal-obsidian',
    product_name: 'Vanguard Obsidian Octa',
    user_name: 'Alessandro Rossi',
    rating: 4,
    comment: 'Exquisite technical structure. The skeleton dial is beautiful. Only concern is the strap takes a few days to soften.',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  }
];

// Supabase Status Registers
let supabaseConnected: boolean | null = null;
let supabaseError: string | null = null;
let isSyncing = false;

// Pull from Supabase
export async function syncFromSupabase() {
  if (isSyncing) return;
  isSyncing = true;
  try {
    // Check connection & tables first
    const { data: testCat, error: testError } = await supabase.from('categories').select('id').limit(1);
    
    if (testError) {
      supabaseConnected = false;
      supabaseError = `Relational tables missing or permissions blocked. Please check your Supabase dashboard or execute the schema below. (Reason: ${testError.message})`;
      isSyncing = false;
      window.dispatchEvent(new Event('stylex_db_update'));
      return;
    }

    supabaseConnected = true;
    supabaseError = null;

    // 1. Fetch Categories
    const { data: categories, error: catErr } = await supabase.from('categories').select('*');
    if (catErr) {
      console.error('[SUPABASE] error fetching categories:', catErr);
    } else if (categories && categories.length > 0) {
      set(KEYS.CATEGORIES, categories);
    } else {
      // Auto seed categories
      const localCats = get<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
      await supabase.from('categories').upsert(localCats);
      set(KEYS.CATEGORIES, localCats);
    }

    // 2. Fetch Products
    const { data: products, error: prodErr } = await supabase.from('products').select('*');
    if (prodErr) {
      console.error('[SUPABASE] error fetching products:', prodErr);
    } else if (products && products.length > 0) {
      set(KEYS.PRODUCTS, products);
    } else {
      // Auto seed products
      const localProds = get<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
      await supabase.from('products').upsert(localProds);
      set(KEYS.PRODUCTS, localProds);
    }

    // 3. Fetch Coupons
    const { data: coupons } = await supabase.from('coupons').select('*');
    if (coupons && coupons.length > 0) {
      set(KEYS.COUPONS, coupons);
    } else {
      const localCoups = get<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS);
      await supabase.from('coupons').upsert(localCoups);
      set(KEYS.COUPONS, localCoups);
    }

    // 4. Fetch Reviews
    const { data: reviews } = await supabase.from('reviews').select('*');
    if (reviews && reviews.length > 0) {
      set(KEYS.REVIEWS, reviews);
    } else {
      const localRevs = get<Review[]>(KEYS.REVIEWS, DEFAULT_REVIEWS);
      await supabase.from('reviews').upsert(localRevs);
      set(KEYS.REVIEWS, localRevs);
    }

    // 5. Fetch Chat Messages
    const { data: chat } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true });
    if (chat && chat.length > 0) {
      set(KEYS.CHAT_MESSAGES, chat);
    }

    // 6. Fetch Orders
    const { data: orders } = await supabase.from('orders').select('*');
    if (orders && orders.length > 0) {
      set(KEYS.ORDERS, orders);
    }

    // 7. Fetch Order Items
    const { data: orderItems } = await supabase.from('order_items').select('*');
    if (orderItems && orderItems.length > 0) {
      set(KEYS.ORDER_ITEMS, orderItems);
    }

    window.dispatchEvent(new Event('stylex_db_update'));
  } catch (err: any) {
    supabaseConnected = false;
    supabaseError = err?.message || String(err);
    window.dispatchEvent(new Event('stylex_db_update'));
  } finally {
    isSyncing = false;
  }
}

// Push local data as seeding
export async function seedSupabase() {
  const failures: { table: string; message: string }[] = [];
  const successes: string[] = [];
  supabaseError = null;

  const safeSeed = async (tableName: string, data: any[]) => {
    if (!data || data.length === 0) return;
    try {
      const { error } = await supabase.from(tableName).upsert(data);
      if (error) {
        failures.push({ table: tableName, message: error.message });
      } else {
        successes.push(tableName);
      }
    } catch (err: any) {
      failures.push({ table: tableName, message: err?.message || String(err) });
    }
  };

  // Seed Categories
  const localCats = get<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  await safeSeed('categories', localCats);

  // Seed Products
  const localProds = get<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  await safeSeed('products', localProds);

  // Seed Coupons
  const localCoups = get<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS);
  await safeSeed('coupons', localCoups);

  // Seed Reviews
  const localRevs = get<Review[]>(KEYS.REVIEWS, DEFAULT_REVIEWS);
  await safeSeed('reviews', localRevs);

  // Seed welcome chats
  const welcomeMsg = [
    {
      id: 'welcome-msg-1',
      sender_id: 'admin-id',
      sender_name: 'Style X Private Concierge',
      message: 'Greetings from Style X. I am your private digital attache. How may I assist you with our bespoke catalog today?',
      created_at: new Date().toISOString(),
      is_admin: true
    }
  ];
  await safeSeed('chat_messages', welcomeMsg);

  if (failures.length > 0) {
    const failureSummary = failures.map(f => `${f.table}: ${f.message}`).join(' | ');
    supabaseError = `Seed complete with errors. Succeeded tables: [${successes.join(', ')}]. Failed tables: [${failureSummary}]. Did you create all tables using the PostgreSQL Schema script inside your Supabase SQL Editor?`;
    supabaseConnected = successes.length > 0;
    window.dispatchEvent(new Event('stylex_db_update'));
    return false;
  }

  supabaseConnected = true;
  await syncFromSupabase();
  return true;
}

// Explicit push of all local storage data to Supabase
export async function pushLocalToSupabase() {
  const failures: { table: string; message: string }[] = [];
  const successes: string[] = [];
  supabaseError = null;

  const safeUpsert = async (tableName: string, data: any[]) => {
    if (!data || data.length === 0) return;
    try {
      const { error } = await supabase.from(tableName).upsert(data);
      if (error) {
        failures.push({ table: tableName, message: error.message });
      } else {
        successes.push(tableName);
      }
    } catch (err: any) {
      failures.push({ table: tableName, message: err?.message || String(err) });
    }
  };

  // 1. Push Categories
  const localCats = get<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  await safeUpsert('categories', localCats);

  // 2. Push Products
  const localProds = get<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  await safeUpsert('products', localProds);

  // 3. Push Coupons
  const localCoups = get<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS);
  await safeUpsert('coupons', localCoups);

  // 4. Push Reviews
  const localRevs = get<Review[]>(KEYS.REVIEWS, DEFAULT_REVIEWS);
  await safeUpsert('reviews', localRevs);

  // 5. Push Chat Messages
  const localChats = get<any[]>(KEYS.CHAT_MESSAGES, []);
  await safeUpsert('chat_messages', localChats);

  // 6. Push Orders
  const localOrders = get<Order[]>(KEYS.ORDERS, []);
  await safeUpsert('orders', localOrders);

  // 7. Push Order Items
  const localItems = get<OrderItem[]>(KEYS.ORDER_ITEMS, []);
  await safeUpsert('order_items', localItems);

  if (failures.length > 0) {
    const failureSummary = failures.map(f => `${f.table}: ${f.message}`).join(' | ');
    supabaseError = `Sync complete with errors. Succeeded: [${successes.join(', ')}]. Failed tables: [${failureSummary}]. Check if you have created all tables via the SQL Pane or logged in as Admin if RLS is enabled.`;
    supabaseConnected = successes.length > 0;
    window.dispatchEvent(new Event('stylex_db_update'));
    return false;
  }

  supabaseConnected = true;
  supabaseError = null;
  window.dispatchEvent(new Event('stylex_db_update'));
  return true;
}

// Initial background pull load trigger
setTimeout(() => {
  syncFromSupabase();
}, 500);

export const db = {
  // DB status checkers
  getSupabaseStatus: () => ({
    connected: supabaseConnected,
    error: supabaseError
  }),
  syncFromSupabase,
  seedSupabase,
  pushLocalToSupabase,

  getProducts: (): Product[] => get<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS),
  setProducts: (products: Product[]) => {
    const current = get<Product[]>(KEYS.PRODUCTS, []);
    set(KEYS.PRODUCTS, products);

    // Identify deleted rows
    const currentIds = current.map(p => p.id);
    const nextIds = products.map(p => p.id);
    const deletedIds = currentIds.filter(id => !nextIds.includes(id));

    if (deletedIds.length > 0) {
      supabase.from('products').delete().in('id', deletedIds).then(({ error }) => {
        if (error) console.error('[SUPABASE] error deleting products:', error);
      });
    }

    if (products.length > 0) {
      supabase.from('products').upsert(products).then(({ error }) => {
        if (error) console.error('[SUPABASE] error saving products:', error);
      });
    }
  },

  getCategories: (): Category[] => get<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES),
  setCategories: (categories: Category[]) => {
    const current = get<Category[]>(KEYS.CATEGORIES, []);
    set(KEYS.CATEGORIES, categories);

    const deletedIds = current.map(c => c.id).filter(id => !categories.map(c => c.id).includes(id));
    if (deletedIds.length > 0) {
      supabase.from('categories').delete().in('id', deletedIds).then(({ error }) => {
        if (error) console.error('[SUPABASE] error deleting categories:', error);
      });
    }

    if (categories.length > 0) {
      supabase.from('categories').upsert(categories).then(({ error }) => {
        if (error) console.error('[SUPABASE] error saving categories:', error);
      });
    }
  },

  getOrders: (): Order[] => get<Order[]>(KEYS.ORDERS, []),
  setOrders: (orders: Order[]) => {
    const current = get<Order[]>(KEYS.ORDERS, []);
    set(KEYS.ORDERS, orders);

    const deletedIds = current.map(o => o.id).filter(id => !orders.map(o => o.id).includes(id));
    if (deletedIds.length > 0) {
      supabase.from('orders').delete().in('id', deletedIds).then(({ error }) => {
        if (error) console.error('[SUPABASE] error deleting orders:', error);
      });
    }

    if (orders.length > 0) {
      supabase.from('orders').upsert(orders).then(({ error }) => {
        if (error) console.error('[SUPABASE] error saving orders:', error);
      });
    }
  },

  getOrderItems: (): OrderItem[] => get<OrderItem[]>(KEYS.ORDER_ITEMS, []),
  setOrderItems: (items: OrderItem[]) => {
    const current = get<OrderItem[]>(KEYS.ORDER_ITEMS, []);
    set(KEYS.ORDER_ITEMS, items);

    const deletedIds = current.map(i => i.id).filter(id => !items.map(i => i.id).includes(id));
    if (deletedIds.length > 0) {
      supabase.from('order_items').delete().in('id', deletedIds).then(({ error }) => {
        if (error) console.error('[SUPABASE] error deleting order items:', error);
      });
    }

    if (items.length > 0) {
      supabase.from('order_items').upsert(items).then(({ error }) => {
        if (error) console.error('[SUPABASE] error saving order items:', error);
      });
    }
  },

  getReviews: (): Review[] => get<Review[]>(KEYS.REVIEWS, DEFAULT_REVIEWS),
  setReviews: (reviews: Review[]) => {
    const current = get<Review[]>(KEYS.REVIEWS, []);
    set(KEYS.REVIEWS, reviews);

    const deletedIds = current.map(r => r.id).filter(id => !reviews.map(r => r.id).includes(id));
    if (deletedIds.length > 0) {
      supabase.from('reviews').delete().in('id', deletedIds).then(({ error }) => {
        if (error) console.error('[SUPABASE] error deleting reviews:', error);
      });
    }

    if (reviews.length > 0) {
      supabase.from('reviews').upsert(reviews).then(({ error }) => {
        if (error) console.error('[SUPABASE] error saving reviews:', error);
      });
    }
  },

  getChatMessages: (): ChatMessage[] => get<ChatMessage[]>(KEYS.CHAT_MESSAGES, [
    {
      id: 'welcome-msg-1',
      sender_id: 'admin-id',
      sender_name: 'Style X Private Concierge',
      message: 'Greetings from Style X. I am your private digital attache. How may I assist you with our bespoke catalog today?',
      created_at: new Date(Date.now() - 600 * 1000).toISOString(),
      is_admin: true
    }
  ]),
  setChatMessages: (messages: ChatMessage[]) => {
    const current = get<ChatMessage[]>(KEYS.CHAT_MESSAGES, []);
    set(KEYS.CHAT_MESSAGES, messages);

    const deletedIds = current.map(m => m.id).filter(id => !messages.map(m => m.id).includes(id));
    if (deletedIds.length > 0) {
      supabase.from('chat_messages').delete().in('id', deletedIds).then(({ error }) => {
        if (error) console.error('[SUPABASE] error deleting chat_messages:', error);
      });
    }

    if (messages.length > 0) {
      supabase.from('chat_messages').upsert(messages).then(({ error }) => {
        if (error) console.error('[SUPABASE] error saving chat_messages:', error);
      });
    }
  },

  getCoupons: (): Coupon[] => get<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS),
  setCoupons: (coupons: Coupon[]) => {
    const current = get<Coupon[]>(KEYS.COUPONS, []);
    set(KEYS.COUPONS, coupons);

    const deletedIds = current.map(c => c.id).filter(id => !coupons.map(c => c.id).includes(id));
    if (deletedIds.length > 0) {
      supabase.from('coupons').delete().in('id', deletedIds).then(({ error }) => {
        if (error) console.error('[SUPABASE] error deleting coupons:', error);
      });
    }

    if (coupons.length > 0) {
      supabase.from('coupons').upsert(coupons).then(({ error }) => {
        if (error) console.error('[SUPABASE] error saving coupons:', error);
      });
    }
  },

  getCurrentUser: () => get<{ id: string; email: string; role: 'admin' | 'customer' } | null>(KEYS.CURRENT_USER, {
    id: 'client-user-1',
    email: 'guest@stylex.luxury',
    role: 'customer'
  }),
  setCurrentUser: (user: { id: string; email: string; role: 'admin' | 'customer' } | null) => set(KEYS.CURRENT_USER, user),

  getWishlist: (): string[] => get<string[]>(KEYS.WISHLIST, []),
  setWishlist: (wishlist: string[]) => set(KEYS.WISHLIST, wishlist),

  getCart: (): { product_id: string; quantity: number }[] => get<{ product_id: string; quantity: number }[]>(KEYS.CART, []),
  setCart: (cart: { product_id: string; quantity: number }[]) => set(KEYS.CART, cart)
};

// Simplified and perfectly matched PostgreSQL schema for Supabase
export const SUPABASE_SQL_SCHEMA = `-- Style X Luxury eCommerce Database Schema (Idempotent Migration Block)
-- Run this compilation query inside your Supabase SQL Editor (https://supabase.com).
-- It is designed to be fully rerun-safe (idempotent), meaning you can run it as many times as you want
-- without encountering "already exists" errors, while preserving your existing table records.

-- A. OPTIONAL Clean Redefinition (Uncomment the lines below ONLY if you want to wipe existing data and start over)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
-- DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
-- DROP TABLE IF EXISTS public.order_items CASCADE;
-- DROP TABLE IF EXISTS public.orders CASCADE;
-- DROP TABLE IF EXISTS public.reviews CASCADE;
-- DROP TABLE IF EXISTS public.products CASCADE;
-- DROP TABLE IF EXISTS public.categories CASCADE;
-- DROP TABLE IF EXISTS public.coupons CASCADE;
-- DROP TABLE IF EXISTS public.chat_messages CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;
-- DROP TABLE IF EXISTS public.wishlist CASCADE;
-- DROP TABLE IF EXISTS public.cart CASCADE;

-- 1. Profiles Table (Holds Custom user metadata and roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY, -- Supports text IDs or Auth UUIDs cast to text
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    original_price NUMERIC(12,2),
    rating NUMERIC(3,2) DEFAULT 5.0,
    category TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    stock INTEGER NOT NULL DEFAULT 1,
    specs JSONB DEFAULT '{}'::jsonb,
    image_urls TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    total NUMERIC(12,2) NOT NULL,
    coupon_code TEXT,
    discount_amount NUMERIC(12,2) DEFAULT 0.00,
    final_total NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT,
    product_name TEXT NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL,
    price NUMERIC(12,2) NOT NULL
);

-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL,
    value NUMERIC(12,2) NOT NULL,
    active BOOLEAN DEFAULT true
);

-- 8. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    file_url TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Wishlist Table
CREATE TABLE IF NOT EXISTS public.wishlist (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 10. Cart Table
CREATE TABLE IF NOT EXISTS public.cart (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 11. Secure helper function to check admin role using profiles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()::text AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql;

-- 12. Enable Row Level Security (RLS) on all Tables (Safe to run multiple times)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- 13. Security Policies (RLS) with drop-first pattern for absolute safety

-- PROFILES Policies
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid()::text = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins full control profiles" ON public.profiles;
CREATE POLICY "Admins full control profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- CATEGORIES Policies
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write categories" ON public.categories;
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (public.is_admin());

-- PRODUCTS Policies
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write products" ON public.products;
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (public.is_admin());

-- ORDERS Policies
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write orders" ON public.orders;
CREATE POLICY "Admin write orders" ON public.orders FOR ALL USING (public.is_admin());

-- ORDER ITEMS Policies
DROP POLICY IF EXISTS "Public read order_items" ON public.order_items;
CREATE POLICY "Public read order_items" ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert order_items" ON public.order_items;
CREATE POLICY "Public insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);

-- REVIEWS Policies
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert reviews" ON public.reviews;
CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write reviews" ON public.reviews;
CREATE POLICY "Admin write reviews" ON public.reviews FOR ALL USING (public.is_admin());

-- COUPONS Policies
DROP POLICY IF EXISTS "Public read coupons" ON public.coupons;
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write coupons" ON public.coupons;
CREATE POLICY "Admin write coupons" ON public.coupons FOR ALL USING (public.is_admin());

-- CHAT MESSAGES Policies
DROP POLICY IF EXISTS "Read chats" ON public.chat_messages;
CREATE POLICY "Read chats" ON public.chat_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert chats" ON public.chat_messages;
CREATE POLICY "Public insert chats" ON public.chat_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin write chats" ON public.chat_messages;
CREATE POLICY "Admin write chats" ON public.chat_messages FOR ALL USING (public.is_admin());

-- WISHLIST Policies
DROP POLICY IF EXISTS "Users control own wishlist" ON public.wishlist;
CREATE POLICY "Users control own wishlist" ON public.wishlist FOR ALL USING (auth.uid()::text = user_id OR public.is_admin());

-- CART Policies
DROP POLICY IF EXISTS "Users control own cart" ON public.cart;
CREATE POLICY "Users control own cart" ON public.cart FOR ALL USING (auth.uid()::text = user_id OR public.is_admin());

-- 14. Trigger to automatically provision a profile record when a new User signs up on Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id::text,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    CASE WHEN new.email = 'admin@stylex.luxury' THEN 'admin' ELSE 'customer' END
  )
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Symmetrical clean trigger attachment
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;
