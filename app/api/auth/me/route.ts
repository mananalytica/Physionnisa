import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getCurrentUser } from "@/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET /api/auth/me failed:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
