export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_desc: string | null;
  long_desc: string | null;
  price_pkr: number;
  compare_at_pkr: number | null;
  image_url: string | null;
  rating: number;
  review_count: number;
  badge: string | null;
  in_stock?: boolean;

  // Google Shopping / Merchant Center feed attributes
  brand?: string | null;
  gtin?: string | null;
  mpn?: string | null;
  condition_gs?: "new" | "refurbished" | "used" | null;
  availability_gs?: "in stock" | "out of stock" | "preorder" | "backorder" | null;
  google_product_category?: string | null;
  product_type?: string | null;
  identifier_exists?: boolean | null;
  currency?: string | null;
};

export type Specialist = {
  id: string;
  slug: string;
  name: string;
  title: string;
  photo_url: string | null;
  photo_alt?: string | null;
  bio: string | null;
  years_experience: number | null;
  languages: string | null;
  clinic: string | null;

  // E-E-A-T / trust signals
  credentials?: string | null;
  license_number?: string | null;
  license_authority?: string | null;
  education?: string | null;
  specializations?: string | null;
  memberships?: string | null;
  external_profile_url?: string | null;
  user_id?: string | null;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  body: string | null;
  cover_image: string | null;
  author: string | null;
  published_at: string | null;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};
