import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, serviceType, servicePrice, preferredDate, reason } = body;

    if (!fullName || !email || !serviceType || !preferredDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingId = crypto.randomUUID();
    let stored = false;

    if (isDbConfigured()) {
      await query(
        `INSERT INTO bookings
           (id, full_name, email, service_type, service_price_pkr, preferred_date, reason)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [bookingId, fullName, email, serviceType, servicePrice ?? null, preferredDate, reason ?? null]
      );
      stored = true;
    } else {
      console.warn("MOTHERDUCK_TOKEN/MOTHERDUCK_DATABASE not set — booking NOT stored, logged locally only:", {
        bookingId,
        fullName,
        email,
        serviceType,
      });
    }

    return NextResponse.json({ bookingId, stored }, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings failed:", err);
    return NextResponse.json({ error: "Could not create booking" }, { status: 500 });
  }
}
