import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isDbConfigured()) return NextResponse.json({ notes: [] });

  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const notes = await query(
      `SELECT n.*, s.name AS specialist_name
       FROM treatment_notes n
       LEFT JOIN specialists s ON s.user_id = n.specialist_user_id
       WHERE n.patient_user_id = $1
       ORDER BY n.created_at DESC`,
      [user.id]
    );
    return NextResponse.json({ notes });
  } catch (err) {
    console.error("GET /api/patient/notes failed:", err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
