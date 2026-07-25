import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IncomingItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookingId, items, subtotal, tax, total, fullName, email, phone,
      shippingAddress, addressLine1, addressLine2, city, postalCode, country,
    } = body as {
      bookingId?: string;
      items: IncomingItem[];
      subtotal: number;
      tax: number;
      total: number;
      fullName?: string;
      email?: string;
      phone?: string;
      shippingAddress?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const orderId = crypto.randomUUID();
    let stored = false;

    if (isDbConfigured()) {
      const currentUser = await getCurrentUser(req).catch(() => null);

      await query(
        `INSERT INTO orders (
           id, booking_id, user_id, full_name, email, phone, shipping_address,
           shipping_address_line1, shipping_address_line2, shipping_city,
           shipping_postal_code, shipping_country, subtotal_pkr, tax_pkr, total_pkr
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          orderId,
          bookingId ?? null,
          currentUser?.id ?? null,
          fullName ?? null,
          email ?? null,
          phone ?? null,
          shippingAddress ?? null,
          addressLine1 ?? null,
          addressLine2 ?? null,
          city ?? null,
          postalCode ?? null,
          country ?? null,
          subtotal,
          tax,
          total,
        ]
      );

      for (const item of items) {
        await query(
          `INSERT INTO order_items (id, order_id, product_id, product_name, unit_price_pkr, quantity)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [crypto.randomUUID(), orderId, item.productId, item.name, item.price, item.quantity]
        );
      }
      stored = true;
    } else {
      console.warn("MOTHERDUCK_TOKEN/MOTHERDUCK_DATABASE not set — order NOT stored, logged locally only:", {
        orderId,
        items,
        total,
      });
    }

    return NextResponse.json({ orderId, stored }, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders failed:", err);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
