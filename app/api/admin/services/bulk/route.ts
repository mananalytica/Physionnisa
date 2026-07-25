import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { parseCsv } from "@/lib/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Expects a raw CSV body with a header row. Columns:
 * slug,name,category,short_desc,long_desc,duration_minutes,price_pkr,icon,image_url,benefits,is_featured,display_order
 *
 * Only slug, name, and price_pkr are required. `benefits` should be
 * semicolon-separated (commas inside a field must be quoted per standard CSV).
 */
export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }

  const csvText = await req.text();
  if (!csvText.trim()) return NextResponse.json({ error: "Empty file" }, { status: 400 });

  const rows = parseCsv(csvText);
  if (rows.length === 0) return NextResponse.json({ error: "No rows found in CSV" }, { status: 400 });

  const results: { row: number; slug: string; status: "ok" | "error"; message?: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const slug = (r.slug || "").trim();
    const name = (r.name || "").trim();
    const price = Number(r.price_pkr);

    if (!slug || !name || !Number.isFinite(price)) {
      results.push({
        row: i + 2,
        slug: slug || "(missing)",
        status: "error",
        message: "Missing required field (slug, name, price_pkr) or invalid price",
      });
      continue;
    }

    try {
      const existing = await query<{ id: string }>(`SELECT id FROM services WHERE slug = $1 LIMIT 1`, [slug]);
      const id = existing[0]?.id || `sv_${slug.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`;

      await query(
        `INSERT INTO services (
           id, slug, name, category, short_desc, long_desc, duration_minutes,
           price_pkr, icon, image_url, benefits, is_featured, display_order
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug, name = EXCLUDED.name, category = EXCLUDED.category,
           short_desc = EXCLUDED.short_desc, long_desc = EXCLUDED.long_desc,
           duration_minutes = EXCLUDED.duration_minutes, price_pkr = EXCLUDED.price_pkr,
           icon = EXCLUDED.icon, image_url = EXCLUDED.image_url, benefits = EXCLUDED.benefits,
           is_featured = EXCLUDED.is_featured, display_order = EXCLUDED.display_order`,
        [
          id,
          slug,
          name,
          r.category || null,
          r.short_desc || null,
          r.long_desc || null,
          r.duration_minutes ? Number(r.duration_minutes) : 60,
          price,
          r.icon || null,
          r.image_url || null,
          r.benefits || null,
          r.is_featured ? r.is_featured.toLowerCase() === "true" : false,
          r.display_order ? Number(r.display_order) : 0,
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
