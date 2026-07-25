import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, email, phone, address, addressLine1, addressLine2, city, postalCode, country,
      serviceType, servicePrice, specialistId, preferredDate, reason, referralSource,
    } = body;

    if (!fullName || !email || !serviceType || !preferredDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingId = crypto.randomUUID();
    let stored = false;

    if (isDbConfigured()) {
      // Attach the logged-in user (if any) so the booking shows up in their
      // patient portal automatically, without requiring the email to match exactly.
      const currentUser = await getCurrentUser(req).catch(() => null);

      await query(
        `INSERT INTO bookings
           (id, user_id, specialist_id, full_name, email, phone, address,
            address_line1, address_line2, city, postal_code, country,
            service_type, service_price_pkr, preferred_date, reason, referral_source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          bookingId,
          currentUser?.id ?? null,
          specialistId || null,
          fullName,
          email,
          phone ?? null,
          address ?? null,
          addressLine1 ?? null,
          addressLine2 ?? null,
          city ?? null,
          postalCode ?? null,
          country ?? null,
          serviceType,
          servicePrice ?? null,
          preferredDate,
          reason ?? null,
          referralSource || null,
        ]
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
