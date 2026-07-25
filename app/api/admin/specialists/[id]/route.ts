import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";

const UPDATABLE_FIELDS = [
  "slug", "name", "title", "photo_url", "photo_alt", "bio", "years_experience", "languages",
  "credentials", "license_number", "license_authority", "education", "specializations",
  "memberships", "external_profile_url", "clinic",
] as const;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }
  try {
    const body = await req.json();
    const updates = UPDATABLE_FIELDS.filter((f) => f in body);
    if (updates.length === 0 && !body.linked_email) {
      return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
    }

    if (updates.length > 0) {
      const setClause = updates.map((f, i) => `${f} = $${i + 1}`).join(", ");
      const values = updates.map((f) => body[f]);
      await query(`UPDATE specialists SET ${setClause} WHERE id = $${updates.length + 1}`, [
        ...values,
        params.id,
      ]);
    }

    if (body.linked_email) {
      const users = await query<{ id: string }>(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [
        String(body.linked_email).toLowerCase().trim(),
      ]);
      const linkedUserId = users[0]?.id;
      if (linkedUserId) {
        await query(`UPDATE specialists SET user_id = $1 WHERE id = $2`, [linkedUserId, params.id]);
        await query(`UPDATE users SET role = 'specialist', specialist_id = $1 WHERE id = $2`, [
          params.id,
          linkedUserId,
        ]);
      } else {
        return NextResponse.json(
          { ok: true, warning: "No account found with that email yet — they can sign up, then you can re-link." },
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/admin/specialists/[id] failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }
  try {
    await query(`DELETE FROM specialists WHERE id = $1`, [params.id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/specialists/[id] failed:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
