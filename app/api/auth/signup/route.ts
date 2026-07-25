import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE } from "@/lib/userAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Accounts require MotherDuck to be connected. See /api/health." },
      { status: 503 }
    );
  }

  const { email, password, fullName, phone, role } = await req.json().catch(() => ({}));

  if (!email || !password || !fullName) {
    return NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  const normalizedRole = role === "specialist" ? "specialist" : "patient";

  try {
    const existing = await query<{ id: string }>(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [
      String(email).toLowerCase().trim(),
    ]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO users (id, email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, String(email).toLowerCase().trim(), hashPassword(password), fullName, phone ?? null, normalizedRole]
    );

    const token = await createSessionToken(id, normalizedRole);
    const res = NextResponse.json({ ok: true, role: normalizedRole }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error("POST /api/auth/signup failed:", err);
    return NextResponse.json({ error: "Could not create account" }, { status: 500 });
  }
}
