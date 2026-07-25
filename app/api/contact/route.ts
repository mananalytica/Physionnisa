import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, subject, message } = await req.json();

    if (!fullName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    let stored = false;

    if (isDbConfigured()) {
      await query(
        `INSERT INTO contact_messages (id, full_name, email, phone, subject, message)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, fullName, email, phone ?? null, subject ?? null, message ?? null]
      );
      stored = true;
    } else {
      console.warn("MOTHERDUCK_TOKEN/MOTHERDUCK_DATABASE not set — message NOT stored, logged locally only:", { id, fullName, email });
    }

    return NextResponse.json({ id, stored }, { status: 201 });
  } catch (err) {
    console.error("POST /api/contact failed:", err);
    return NextResponse.json({ error: "Could not send message" }, { status: 500 });
  }
}
