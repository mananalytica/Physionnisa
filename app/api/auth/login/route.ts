import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE, type SessionRole } from "@/lib/userAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UserRow = { id: string; password_hash: string; role: SessionRole };

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Accounts require MotherDuck to be connected. See /api/health." },
      { status: 503 }
    );
  }

  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const rows = await query<UserRow>(
      `SELECT id, password_hash, role FROM users WHERE email = $1 LIMIT 1`,
      [String(email).toLowerCase().trim()]
    );
    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
    }

    const token = await createSessionToken(user.id, user.role);
    const res = NextResponse.json({ ok: true, role: user.role });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error("POST /api/auth/login failed:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
