import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BookingRow = {
  id: string;
  full_name: string;
  email: string;
  service_type: string;
  service_price_pkr: number | null;
  preferred_date: string;
  reason: string | null;
  status: string;
  created_at: string;
};

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ booking: null, configured: false }, { status: 200 });
  }
  try {
    const rows = await query<BookingRow>(`SELECT * FROM bookings WHERE id = $1 LIMIT 1`, [params.id]);
    return NextResponse.json({ booking: rows[0] ?? null, configured: true });
  } catch (err) {
    console.error("GET /api/bookings/[id] failed:", err);
    return NextResponse.json({ booking: null, error: "Lookup failed" }, { status: 500 });
  }
}
