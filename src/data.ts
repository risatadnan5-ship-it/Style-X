import { Product, Category, Coupon } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Horology Elegance',
    slug: 'horology-elegance',
    description: 'Masterpieces of timeless craftsmanship and Swiss precision.',
    image_url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-2',
    name: 'Haute Leather',
    slug: 'haute-leather',
    description: 'Exquisite hand-stitched travel items and luxury luggage.',
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-3',
    name: 'Atelier Apparel',
    slug: 'atelier-apparel',
    description: 'Bespoke tailoring, runway silhouettes, and fine organic silks.',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cat-4',
    name: 'Signature Icons',
    slug: 'signature-icons',
    description: 'Limited edition luxury accessories and legacy fragrances.',
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-chrono-gold',
    sku: 'SX-WA-001',
    name: 'Style X Chrono-Master Legacy 40',
    description: 'Forged in solid 18-karat Oystersteel gold with an oyster-brushed link band, the Chrono-Master feature is Style X’s crowning horology achievement. Designed for track enthusiasts and connoisseurs of modern luxury, it houses a Calibre 4130 self-winding mechanism, providing unparalleled accuracy under pressure.',
    category: 'Horology Elegance',
    price: 34500,
    original_price: 38200,
    rating: 4.9,
    image_urls: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    stock: 4,
    specs: {
      'Movement': 'Automatic Calibre 4130',
      'Material': '18k Everose Gold & Oystersteel',
      'Water Resistance': '100m (330 feet)',
      'Power Reserve': 'Approximately 72 hours',
      'Dial': 'Satin Finished Gloss Black'
    },
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-royal-obsidian',
    sku: 'SX-WA-002',
    name: 'Vanguard Obsidian Octa',
    description: 'Constructed using premium satin-brushed matte ceramic and sandblasted titanium bezel pins. Incorporates a skeletonized dial displaying the majestic inner heartbeat of the 28,800 vph movement. Perfect for the modern executive looking to redefine wrist posture.',
    category: 'Horology Elegance',
    price: 49000,
    original_price: 52000,
    rating: 4.8,
    image_urls: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    stock: 2,
    specs: {
      'Case Diameter': '42 mm',
      'Crystal': 'Anti-Reflective Sapphire Dial',
      'Frequency': '4 Hz / 28,800 vibrations/hour',
      'Clasp': 'Double Fold Titanium Deployant buckle',
      'Luminescence': 'Super-LumiNova® hands'
    },
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-birkin-suede',
    sku: 'SX-BG-101',
    name: 'Sovereign Travel Keepall 55',
    description: 'Our heritage travel keepall has been redesigned with pristine, full-grain textured calfskin, water-repellent brass zippers, and a removable padded monogram strap. Masterfully stitched by hands that carry generations of French design legacy.',
    category: 'Haute Leather',
    price: 7800,
    rating: 5.0,
    image_urls: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    stock: 8,
    specs: {
      'Weight': '1.2 kg',
      'Hardware': 'Oxidized Gold-Tone Brass Metallic Clasp',
      'Lining': 'Premium Microfiber Velvet Suede',
      'Origin': 'Handcrafted in Paris, France'
    },
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-luxe-fragrance',
    sku: 'SX-AC-301',
    name: 'Aether Noir Parfum Extrait',
    description: 'An enchanting luxury perfume featuring smoky cedar notes, blooming ambergris, premium Madagascar vanilla orchids, and patchouli essential oils. Housed in a hand-blown obsidian crystal vial adorned with a Style X gold cap.',
    category: 'Signature Icons',
    price: 490,
    original_price: 550,
    rating: 4.7,
    image_urls: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800'
    ],
    featured: false,
    stock: 25,
    specs: {
      'Volume': '100 ml (3.4 FL. OZ.)',
      'Concentration': 'Extrait de Parfum (32%)',
      'Longevity': 'Up to 24 hours on premium textiles',
      'Sillage': 'Strong and captivating'
    },
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-biker-leather',
    sku: 'SX-CL-201',
    name: 'Midnight Suede Atelier Jacket',
    description: 'Tailored out of premium lambskin suede, this iconic biker outerwear comes with custom asymmetric polished chrome hardware, quilted shoulders, and breathable silk lining. It is lightweight yet structurally authoritative.',
    category: 'Atelier Apparel',
    price: 9200,
    rating: 4.9,
    image_urls: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    stock: 3,
    specs: {
      'Fit': 'Tailored European Athletic Fit',
      'Shell': 'Premium Grade A Lambskin Suede',
      'Inner-Lining': '100% Lyocell Twill Silk',
      'Zipper': 'Double-way YKK Custom Finished Zip'
    },
    created_at: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'prod-sunglasses',
    sku: 'SX-AC-302',
    name: 'Helios Aviator 24k Spec',
    description: 'Hand-sculpted lightweight titanium frames plated in pure 24-karat gold. Complete with polarized Category 3 UV protectant sapphire lenses that reduce glare seamlessly while delivering exceptional field-of-view clarity.',
    category: 'Signature Icons',
    price: 1200,
    original_price: 1450,
    rating: 4.8,
    image_urls: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'
    ],
    featured: false,
    stock: 12,
    specs: {
      'Weight': 'Only 18 grams',
      'Plating': '24-Karat Gold Plated Electrocoating',
      'Lenses': 'Multi-layer sapphire anti-reflective film',
      'Protection': '100% UVA/UVB blockage'
    },
    created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cup-1',
    code: 'STYLEUX10',
    discount_type: 'percent',
    value: 10,
    active: true
  },
  {
    id: 'cup-2',
    code: 'LEGACYGOLD500',
    discount_type: 'fixed',
    value: 500,
    active: true
  },
  {
    id: 'cup-3',
    code: 'VIPSTYLE20',
    discount_type: 'percent',
    value: 20,
    active: true
  }
];
