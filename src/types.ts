export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  rating: number;
  image_urls: string[];
  category: string;
  featured: boolean;
  stock: number;
  sku: string;
  specs: Record<string, string>;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  coupon_code?: string;
  discount_amount: number;
  final_total: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  product_id: string;
  product_name: string;
  user_name: string;
  rating: number;
  comment: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  file_url?: string;
  created_at: string;
  is_admin: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: 'order' | 'stock' | 'chat' | 'system';
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  value: number;
  active: boolean;
}

export interface ShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}
