import { Pool, type QueryResultRow } from "pg";
import { attachDatabasePool } from "@vercel/functions";

/**
 * MotherDuck connection.
 *
 * MotherDuck exposes a Postgres wire-protocol endpoint, so we connect with
 * the standard `pg` driver instead of a DuckDB client — this is the
 * recommended path for serverless environments like Vercel functions.
 * Docs: https://motherduck.com/docs/integrations/databases/postgres/
 *
 * Required env vars (see .env.example):
 *   MOTHERDUCK_TOKEN     — service account token (used as the password)
 *   MOTHERDUCK_DATABASE  — database name, e.g. "physionnisa" (or "md:" for default)
 *   MOTHERDUCK_PG_HOST   — pg.us-east-1-aws.motherduck.com (or eu-central-1)
 *   MOTHERDUCK_PG_PORT   — 5432
 *
 * If the Vercel "MotherDuck" marketplace integration is installed, it
 * populates MOTHERDUCK_TOKEN automatically.
 */

declare global {
  // eslint-disable-next-line no-var
  var __physionnisaPgPool: Pool | undefined;
}

function buildConnectionString() {
  const token = process.env.MOTHERDUCK_TOKEN;
  const host = process.env.MOTHERDUCK_PG_HOST || "pg.us-east-1-aws.motherduck.com";
  const port = process.env.MOTHERDUCK_PG_PORT || "5432";
  const database = process.env.MOTHERDUCK_DATABASE || "md:";

  if (!token) {
    throw new Error(
      "MOTHERDUCK_TOKEN is not set. Add it to your environment (see .env.example) " +
        "or install the MotherDuck integration from the Vercel Marketplace."
    );
  }

  return `postgresql://postgres:${encodeURIComponent(
    token
  )}@${host}:${port}/${database}?sslmode=require`;
}

function getPool(): Pool {
  if (!global.__physionnisaPgPool) {
    const pool = new Pool({
      connectionString: buildConnectionString(),
      max: 5,
      idleTimeoutMillis: 30_000,
      ssl: { rejectUnauthorized: false },
    });
    // Ensures idle connections are cleaned up before a Vercel serverless
    // instance suspends, instead of leaking connections across cold starts.
    try {
      attachDatabasePool(pool);
    } catch {
      // no-op outside the Vercel runtime (e.g. local dev)
    }
    global.__physionnisaPgPool = pool;
  }
  return global.__physionnisaPgPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query<T>(text, params);
  return result.rows;
}

/** True when MotherDuck env vars are present — lets pages fall back to seed data in local/demo mode. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.MOTHERDUCK_TOKEN);
}
