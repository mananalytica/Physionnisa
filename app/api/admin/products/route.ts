import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLUMNS = `
  id, slug, name, category, short_desc, long_desc,
  price_pkr, compare_at_pkr, image_url, rating, review_count,
  badge, in_stock, brand, gtin, mpn, condition_gs, availability_gs,
  google_product_category, product_type, identifier_exists, currency, created_at
`;

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }
  try {
    const products = await query(`SELECT ${COLUMNS} FROM products ORDER BY created_at DESC`);
    return NextResponse.json({ products });
  } catch (err) {
    console.error("GET /api/admin/products failed:", err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }
  try {
    const p = await req.json();
    if (!p.slug || !p.name || !p.category || p.price_pkr == null) {
      return NextResponse.json(
        { error: "slug, name, category, and price_pkr are required" },
        { status: 400 }
      );
    }

    const computedId = p.id || `pr_${p.slug.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`;
    const existing = await query<{ id: string }>(`SELECT id FROM products WHERE slug = $1 LIMIT 1`, [p.slug]);
    const id = existing[0]?.id || computedId;

    await query(
      `INSERT INTO products (
         id, slug, name, category, short_desc, long_desc, price_pkr, compare_at_pkr,
         image_url, badge, in_stock, brand, gtin, mpn, condition_gs, availability_gs,
         google_product_category, product_type, identifier_exists, currency
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       ON CONFLICT (id) DO UPDATE SET
         slug = EXCLUDED.slug, name = EXCLUDED.name, category = EXCLUDED.category,
         short_desc = EXCLUDED.short_desc, long_desc = EXCLUDED.long_desc,
         price_pkr = EXCLUDED.price_pkr, compare_at_pkr = EXCLUDED.compare_at_pkr,
         image_url = EXCLUDED.image_url, badge = EXCLUDED.badge, in_stock = EXCLUDED.in_stock,
         brand = EXCLUDED.brand, gtin = EXCLUDED.gtin, mpn = EXCLUDED.mpn,
         condition_gs = EXCLUDED.condition_gs, availability_gs = EXCLUDED.availability_gs,
         google_product_category = EXCLUDED.google_product_category,
         product_type = EXCLUDED.product_type, identifier_exists = EXCLUDED.identifier_exists,
         currency = EXCLUDED.currency`,
      [
        id,
        p.slug,
        p.name,
        p.category,
        p.short_desc ?? null,
        p.long_desc ?? null,
        Number(p.price_pkr),
        p.compare_at_pkr ? Number(p.compare_at_pkr) : null,
        p.image_url ?? null,
        p.badge ?? null,
        p.in_stock !== false,
        p.brand ?? "Physionnisa",
        p.gtin ?? null,
        p.mpn ?? null,
        p.condition_gs ?? "new",
        p.availability_gs ?? "in stock",
        p.google_product_category ?? null,
        p.product_type ?? null,
        p.identifier_exists !== false,
        p.currency ?? "PKR",
      ]
    );

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products failed:", err);
    return NextResponse.json({ error: "Could not save product" }, { status: 500 });
  }
}
