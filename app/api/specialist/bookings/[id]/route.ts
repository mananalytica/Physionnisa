import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";

export const runtime = "nodejs";

const VALID_STATUSES = ["requested", "confirmed", "completed", "cancelled"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured" }, { status: 503 });
  }
  const user = await getCurrentUser(req);
  if (!user || user.role !== "specialist" || !user.specialist_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json().catch(() => ({}));
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    // Only allow updating bookings actually assigned to this specialist.
    await query(
      `UPDATE bookings SET status = $1 WHERE id = $2 AND specialist_id = $3`,
      [status, params.id, user.specialist_id]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/specialist/bookings/[id] failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
