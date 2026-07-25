import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLUMNS = `
  id, slug, name, category, short_desc, long_desc, duration_minutes,
  price_pkr, icon, image_url, benefits, is_featured, display_order, created_at
`;

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }
  try {
    const services = await query(
      `SELECT ${COLUMNS} FROM services ORDER BY display_order ASC, created_at ASC`
    );
    return NextResponse.json({ services });
  } catch (err) {
    console.error("GET /api/admin/services failed:", err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }
  try {
    const s = await req.json();
    if (!s.slug || !s.name || s.price_pkr == null) {
      return NextResponse.json({ error: "slug, name, and price_pkr are required" }, { status: 400 });
    }

    const computedId = s.id || `sv_${s.slug.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`;
    const existing = await query<{ id: string }>(`SELECT id FROM services WHERE slug = $1 LIMIT 1`, [s.slug]);
    const id = existing[0]?.id || computedId;

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
        s.slug,
        s.name,
        s.category ?? null,
        s.short_desc ?? null,
        s.long_desc ?? null,
        s.duration_minutes ? Number(s.duration_minutes) : 60,
        Number(s.price_pkr),
        s.icon ?? null,
        s.image_url ?? null,
        s.benefits ?? null,
        Boolean(s.is_featured),
        s.display_order ? Number(s.display_order) : 0,
      ]
    );

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/services failed:", err);
    return NextResponse.json({ error: "Could not save service" }, { status: 500 });
  }
}
