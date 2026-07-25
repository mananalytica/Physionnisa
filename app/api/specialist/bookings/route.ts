import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isDbConfigured()) return NextResponse.json({ bookings: [] });

  const user = await getCurrentUser(req);
  if (!user || user.role !== "specialist") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!user.specialist_id) {
    return NextResponse.json({
      bookings: [],
      message: "Your account isn't linked to a specialist profile yet — ask the clinic admin to link it.",
    });
  }

  try {
    const bookings = await query(
      `SELECT * FROM bookings WHERE specialist_id = $1 ORDER BY preferred_date DESC, created_at DESC`,
      [user.specialist_id]
    );
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("GET /api/specialist/bookings failed:", err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
