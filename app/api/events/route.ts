import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Optional sink for dataLayer events. Called via lib/dataLayer.ts's
 * `trackAndPersist()` when you want a durable, queryable copy of your
 * analytics events in MotherDuck alongside (or instead of) a third-party
 * analytics tool.
 */
export async function POST(req: NextRequest) {
  try {
    const { event, payload, page_path } = await req.json();
    if (!event) return NextResponse.json({ error: "event is required" }, { status: 400 });

    if (isDbConfigured()) {
      await query(
        `INSERT INTO analytics_events (id, event, payload, page_path, session_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          crypto.randomUUID(),
          event,
          JSON.stringify(payload ?? {}),
          page_path ?? null,
          req.cookies.get("physionnisa_session")?.value ?? null,
        ]
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    // Analytics failures should never surface to the user.
    console.error("POST /api/events failed:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
