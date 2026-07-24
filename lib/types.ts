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
};

export type Specialist = {
  id: string;
  slug: string;
  name: string;
  title: string;
  photo_url: string | null;
  bio: string | null;
  years_experience: number | null;
  languages: string | null;
  clinic: string | null;
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
