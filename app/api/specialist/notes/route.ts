import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BookingRow = { id: string; user_id: string | null; specialist_id: string | null };

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured" }, { status: 503 });
  }
  const user = await getCurrentUser(req);
  if (!user || user.role !== "specialist" || !user.specialist_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId, note, plan } = await req.json().catch(() => ({}));
  if (!bookingId || (!note && !plan)) {
    return NextResponse.json({ error: "bookingId and at least one of note/plan are required" }, { status: 400 });
  }

  try {
    const bookings = await query<BookingRow>(
      `SELECT id, user_id, specialist_id FROM bookings WHERE id = $1 LIMIT 1`,
      [bookingId]
    );
    const booking = bookings[0];
    if (!booking || booking.specialist_id !== user.specialist_id) {
      return NextResponse.json({ error: "Booking not found or not assigned to you" }, { status: 404 });
    }

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO treatment_notes (id, booking_id, patient_user_id, specialist_user_id, note, plan)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, bookingId, booking.user_id ?? null, user.id, note ?? null, plan ?? null]
    );
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/specialist/notes failed:", err);
    return NextResponse.json({ error: "Could not save note" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!isDbConfigured()) return NextResponse.json({ notes: [] });
  const user = await getCurrentUser(req);
  if (!user || user.role !== "specialist" || !user.specialist_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookingId = req.nextUrl.searchParams.get("bookingId");
  if (!bookingId) return NextResponse.json({ error: "bookingId query param required" }, { status: 400 });

  try {
    const notes = await query(
      `SELECT * FROM treatment_notes WHERE booking_id = $1 ORDER BY created_at DESC`,
      [bookingId]
    );
    return NextResponse.json({ notes });
  } catch (err) {
    console.error("GET /api/specialist/notes failed:", err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
