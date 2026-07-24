import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";

type IncomingItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, items, subtotal, tax, total, fullName, email } = body as {
      bookingId?: string;
      items: IncomingItem[];
      subtotal: number;
      tax: number;
      total: number;
      fullName?: string;
      email?: string;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const orderId = crypto.randomUUID();

    if (isDbConfigured()) {
      await query(
        `INSERT INTO orders (id, booking_id, full_name, email, subtotal_pkr, tax_pkr, total_pkr)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderId, bookingId ?? null, fullName ?? null, email ?? null, subtotal, tax, total]
      );

      for (const item of items) {
        await query(
          `INSERT INTO order_items (id, order_id, product_id, product_name, unit_price_pkr, quantity)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [crypto.randomUUID(), orderId, item.productId, item.name, item.price, item.quantity]
        );
      }
    } else {
      console.warn("MOTHERDUCK_TOKEN not set — order logged locally only:", { orderId, items, total });
    }

    return NextResponse.json({ orderId }, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders failed:", err);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
