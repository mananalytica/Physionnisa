import { NextResponse } from "next/server";
import { getDbConfigStatus, isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TABLES = [
  "specialists",
  "products",
  "blog_posts",
  "bookings",
  "orders",
  "order_items",
  "contact_messages",
  "newsletter_subscribers",
] as const;

/**
 * Visit /api/health in your browser after deploying to confirm MotherDuck is
 * actually wired up correctly. If `configured` is false, or `connection` is
 * "error", your bookings/contact/orders are being silently skipped — check
 * the `configStatus` and `connectionError` fields below.
 */
export async function GET() {
  const configStatus = getDbConfigStatus();

  if (!isDbConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        configStatus,
        message:
          "MOTHERDUCK_TOKEN and/or MOTHERDUCK_DATABASE are not set in this environment. " +
          "Forms are currently running in local/demo mode — submissions are NOT being " +
          "written to MotherDuck. Set both in Vercel → Project → Settings → Environment " +
          "Variables (for the Production environment) and redeploy.",
      },
      { status: 200 }
    );
  }

  try {
    await query("SELECT 1");

    const counts: Record<string, number | string> = {};
    for (const table of TABLES) {
      try {
        const rows = await query<{ count: string }>(`SELECT COUNT(*)::int AS count FROM ${table}`);
        counts[table] = Number(rows[0]?.count ?? 0);
      } catch (err) {
        counts[table] = `error: ${err instanceof Error ? err.message : "unknown"}`;
      }
    }

    return NextResponse.json({
      configured: true,
      connection: "ok",
      configStatus,
      rowCounts: counts,
    });
  } catch (err) {
    return NextResponse.json(
      {
        configured: true,
        connection: "error",
        configStatus,
        connectionError: err instanceof Error ? err.message : "Unknown connection error",
        hint:
          "Token and database name are set, but the connection itself failed. Double-check " +
          "MOTHERDUCK_PG_HOST matches your org's region (us-east-1 vs eu-central-1), and that " +
          "MOTHERDUCK_DATABASE exactly matches the database name schema.sql was run against.",
      },
      { status: 200 }
    );
  }
}
