import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isDbConfigured()) return NextResponse.json({ orders: [] });

  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const orders = await query(
      `SELECT * FROM orders WHERE user_id = $1 OR email = $2 ORDER BY created_at DESC`,
      [user.id, user.email]
    );
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("GET /api/patient/orders failed:", err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
