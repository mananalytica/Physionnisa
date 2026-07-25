import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";

type OrderRow = {
  id: string;
  booking_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  shipping_address: string | null;
  subtotal_pkr: number;
  tax_pkr: number;
  total_pkr: number;
  status: string;
  created_at: string;
};

type OrderItemRow = {
  product_id: string;
  product_name: string;
  unit_price_pkr: number;
  quantity: number;
};

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ order: null, items: [], configured: false }, { status: 200 });
  }
  try {
    const orders = await query<OrderRow>(`SELECT * FROM orders WHERE id = $1 LIMIT 1`, [params.id]);
    const order = orders[0] ?? null;
    if (!order) return NextResponse.json({ order: null, items: [], configured: true });

    const items = await query<OrderItemRow>(
      `SELECT product_id, product_name, unit_price_pkr, quantity FROM order_items WHERE order_id = $1`,
      [params.id]
    );

    return NextResponse.json({ order, items, configured: true });
  } catch (err) {
    console.error("GET /api/orders/[id] failed:", err);
    return NextResponse.json({ order: null, items: [], error: "Lookup failed" }, { status: 500 });
  }
}
