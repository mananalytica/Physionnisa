import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let stored = false;
    if (isDbConfigured()) {
      await query(
        `INSERT INTO newsletter_subscribers (id, email)
         VALUES ($1, $2)
         ON CONFLICT (email) DO NOTHING`,
        [crypto.randomUUID(), email]
      );
      stored = true;
    } else {
      console.warn("MOTHERDUCK_TOKEN/MOTHERDUCK_DATABASE not set — subscriber NOT stored, logged locally only:", email);
    }

    return NextResponse.json({ ok: true, stored }, { status: 201 });
  } catch (err) {
    console.error("POST /api/newsletter failed:", err);
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }
}
