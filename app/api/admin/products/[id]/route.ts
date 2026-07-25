import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";

const UPDATABLE_FIELDS = [
  "slug", "name", "category", "short_desc", "long_desc", "price_pkr", "compare_at_pkr",
  "image_url", "badge", "in_stock", "brand", "gtin", "mpn", "condition_gs", "availability_gs",
  "google_product_category", "product_type", "identifier_exists", "currency",
] as const;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }
  try {
    const body = await req.json();
    const updates = UPDATABLE_FIELDS.filter((f) => f in body);
    if (updates.length === 0) {
      return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
    }

    const setClause = updates.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const values = updates.map((f) => body[f]);

    await query(
      `UPDATE products SET ${setClause} WHERE id = $${updates.length + 1}`,
      [...values, params.id]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/admin/products/[id] failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }
  try {
    await query(`DELETE FROM products WHERE id = $1`, [params.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/products/[id] failed:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
