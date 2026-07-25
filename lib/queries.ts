import { isDbConfigured, query } from "./db";
import {
  FALLBACK_BLOG_POSTS,
  FALLBACK_PRODUCTS,
  FALLBACK_SPECIALISTS,
} from "./data";
import type { BlogPost, Product, Specialist } from "./types";

/**
 * Every getter here tries MotherDuck first (when MOTHERDUCK_TOKEN and
 * MOTHERDUCK_DATABASE are set) and quietly falls back to the seed content in
 * lib/data.ts otherwise. This means the site renders correctly the moment
 * you clone it, and switches to live data as soon as you connect MotherDuck
 * — no code changes required.
 */

const PRODUCT_COLUMNS = `
  id, slug, name, category, short_desc, long_desc,
  price_pkr, compare_at_pkr, image_url, rating, review_count,
  badge, in_stock, brand, gtin, mpn, condition_gs, availability_gs,
  google_product_category, product_type, identifier_exists, currency
`;

const SPECIALIST_COLUMNS = `
  id, slug, name, title, photo_url, photo_alt, bio, years_experience,
  languages, credentials, license_number, license_authority, education,
  specializations, memberships, external_profile_url, clinic
`;

export async function getProducts(): Promise<Product[]> {
  if (!isDbConfigured()) return FALLBACK_PRODUCTS;
  try {
    return await query<Product>(
      `SELECT ${PRODUCT_COLUMNS} FROM products
       WHERE in_stock IS NOT FALSE
       ORDER BY created_at DESC`
    );
  } catch (err) {
    console.error("getProducts() falling back to seed data:", err);
    return FALLBACK_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isDbConfigured()) {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const rows = await query<Product>(
      `SELECT ${PRODUCT_COLUMNS} FROM products WHERE slug = $1 LIMIT 1`,
      [slug]
    );
    return rows[0] ?? null;
  } catch (err) {
    console.error("getProductBySlug() falling back to seed data:", err);
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getSpecialists(): Promise<Specialist[]> {
  if (!isDbConfigured()) return FALLBACK_SPECIALISTS;
  try {
    return await query<Specialist>(
      `SELECT ${SPECIALIST_COLUMNS} FROM specialists ORDER BY created_at DESC`
    );
  } catch (err) {
    console.error("getSpecialists() falling back to seed data:", err);
    return FALLBACK_SPECIALISTS;
  }
}

export async function getSpecialistBySlug(
  slug: string
): Promise<Specialist | null> {
  if (!isDbConfigured()) {
    return FALLBACK_SPECIALISTS.find((s) => s.slug === slug) ?? null;
  }
  try {
    const rows = await query<Specialist>(
      `SELECT ${SPECIALIST_COLUMNS} FROM specialists WHERE slug = $1 LIMIT 1`,
      [slug]
    );
    return rows[0] ?? null;
  } catch (err) {
    console.error("getSpecialistBySlug() falling back to seed data:", err);
    return FALLBACK_SPECIALISTS.find((s) => s.slug === slug) ?? null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isDbConfigured()) return FALLBACK_BLOG_POSTS;
  try {
    return await query<BlogPost>(
      `SELECT id, slug, title, category, excerpt, body, cover_image,
              author, published_at
       FROM blog_posts ORDER BY published_at DESC`
    );
  } catch (err) {
    console.error("getBlogPosts() falling back to seed data:", err);
    return FALLBACK_BLOG_POSTS;
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  if (!isDbConfigured()) {
    return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const rows = await query<BlogPost>(
      `SELECT id, slug, title, category, excerpt, body, cover_image,
              author, published_at
       FROM blog_posts WHERE slug = $1 LIMIT 1`,
      [slug]
    );
    return rows[0] ?? null;
  } catch (err) {
    console.error("getBlogPostBySlug() falling back to seed data:", err);
    return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }
}
