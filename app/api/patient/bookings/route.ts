import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isDbConfigured()) return NextResponse.json({ bookings: [] });

  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Matches on user_id (bookings made while logged in) OR email (guest
    // bookings made before the person created an account) so nothing is lost.
    const bookings = await query(
      `SELECT b.*, s.name AS specialist_name, s.slug AS specialist_slug
       FROM bookings b
       LEFT JOIN specialists s ON s.id = b.specialist_id
       WHERE b.user_id = $1 OR b.email = $2
       ORDER BY b.preferred_date DESC, b.created_at DESC`,
      [user.id, user.email]
    );
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("GET /api/patient/bookings failed:", err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
