import type { NextRequest } from "next/server";
import { query } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/userAuth";

export type CurrentUser = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: "patient" | "specialist";
  specialist_id: string | null;
};

/** Resolves the logged-in user (patient or specialist) from the session cookie, or null. */
export async function getCurrentUser(req: NextRequest): Promise<CurrentUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session) return null;

  const rows = await query<CurrentUser>(
    `SELECT id, email, full_name, phone, role, specialist_id FROM users WHERE id = $1 LIMIT 1`,
    [session.userId]
  );
  return rows[0] ?? null;
}
