import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { parseCsv } from "@/lib/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Expects a raw CSV body (text/csv or text/plain) with a header row. Suggested columns:
 * slug,name,category,short_desc,long_desc,price_pkr,compare_at_pkr,image_url,badge,in_stock,
 * brand,gtin,mpn,condition_gs,availability_gs,google_product_category,product_type,currency
 *
 * Only `slug`, `name`, `category`, and `price_pkr` are required — everything else is optional
 * and falls back to sensible defaults (brand: Physionnisa, condition_gs: new, etc.)
 */
export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }

  const csvText = await req.text();
  if (!csvText.trim()) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }

  const rows = parseCsv(csvText);
  if (rows.length === 0) {
    return NextResponse.json({ error: "No rows found in CSV" }, { status: 400 });
  }

  const results: { row: number; slug: string; status: "ok" | "error"; message?: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const slug = (r.slug || "").trim();
    const name = (r.name || "").trim();
    const category = (r.category || "").trim();
    const price = Number(r.price_pkr);

    if (!slug || !name || !category || !Number.isFinite(price)) {
      results.push({
        row: i + 2, // +2 = header row + 1-indexing
        slug: slug || "(missing)",
        status: "error",
        message: "Missing required field (slug, name, category, price_pkr) or invalid price",
      });
      continue;
    }

    const id = r.id?.trim() || `pr_${slug.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`;

    try {
      // Resolve the real id for this slug if a product with that slug
      // already exists (e.g. seeded rows whose id doesn't follow the
      // slug-derived pattern) — otherwise ON CONFLICT(id) alone would miss
      // it and the insert would fail on the unique slug constraint instead
      // of updating in place.
      const existing = await query<{ id: string }>(`SELECT id FROM products WHERE slug = $1 LIMIT 1`, [slug]);
      const resolvedId = existing[0]?.id || id;

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
          resolvedId,
          slug,
          name,
          category,
          r.short_desc || null,
          r.long_desc || null,
          price,
          r.compare_at_pkr ? Number(r.compare_at_pkr) : null,
          r.image_url || null,
          r.badge || null,
          r.in_stock ? r.in_stock.toLowerCase() !== "false" : true,
          r.brand || "Physionnisa",
          r.gtin || null,
          r.mpn || null,
          r.condition_gs || "new",
          r.availability_gs || "in stock",
          r.google_product_category || null,
          r.product_type || null,
          r.identifier_exists ? r.identifier_exists.toLowerCase() !== "false" : true,
          r.currency || "PKR",
        ]
      );
      results.push({ row: i + 2, slug, status: "ok" });
    } catch (err) {
      results.push({
        row: i + 2,
        slug,
        status: "error",
        message: err instanceof Error ? err.message : "Insert failed",
      });
    }
  }

  const succeeded = results.filter((r) => r.status === "ok").length;
  return NextResponse.json({ total: rows.length, succeeded, failed: rows.length - succeeded, results });
}
