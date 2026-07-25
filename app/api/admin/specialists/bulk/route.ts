import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";
import { parseCsv } from "@/lib/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Expects a raw CSV body with a header row. Columns:
 * slug,name,title,photo_url,photo_alt,bio,years_experience,languages,credentials,
 * license_number,license_authority,education,specializations,memberships,
 * external_profile_url,clinic,linked_email
 *
 * `education` entries should be semicolon-separated; `languages`,
 * `specializations`, and `memberships` should be comma-separated.
 * Only slug, name, and title are required. `linked_email` (optional) links
 * the profile to an existing patient/specialist account by email, the same
 * as the "Linked Account Email" field in the single-add form.
 */
export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }

  const csvText = await req.text();
  if (!csvText.trim()) return NextResponse.json({ error: "Empty file" }, { status: 400 });

  const rows = parseCsv(csvText);
  if (rows.length === 0) return NextResponse.json({ error: "No rows found in CSV" }, { status: 400 });

  const results: { row: number; slug: string; status: "ok" | "error"; message?: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const slug = (r.slug || "").trim();
    const name = (r.name || "").trim();
    const title = (r.title || "").trim();

    if (!slug || !name || !title) {
      results.push({
        row: i + 2,
        slug: slug || "(missing)",
        status: "error",
        message: "Missing required field (slug, name, title)",
      });
      continue;
    }

    try {
      const existing = await query<{ id: string }>(`SELECT id FROM specialists WHERE slug = $1 LIMIT 1`, [slug]);
      const id = existing[0]?.id || `sp_${slug.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`;

      let linkedUserId: string | null = null;
      if (r.linked_email) {
        const users = await query<{ id: string }>(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [
          r.linked_email.toLowerCase().trim(),
        ]);
        linkedUserId = users[0]?.id ?? null;
      }

      await query(
        `INSERT INTO specialists (
           id, slug, name, title, photo_url, photo_alt, bio, years_experience, languages,
           credentials, license_number, license_authority, education, specializations,
           memberships, external_profile_url, clinic, user_id
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
         ON CONFLICT (id) DO UPDATE SET
           slug = EXCLUDED.slug, name = EXCLUDED.name, title = EXCLUDED.title,
           photo_url = EXCLUDED.photo_url, photo_alt = EXCLUDED.photo_alt, bio = EXCLUDED.bio,
           years_experience = EXCLUDED.years_experience, languages = EXCLUDED.languages,
           credentials = EXCLUDED.credentials, license_number = EXCLUDED.license_number,
           license_authority = EXCLUDED.license_authority, education = EXCLUDED.education,
           specializations = EXCLUDED.specializations, memberships = EXCLUDED.memberships,
           external_profile_url = EXCLUDED.external_profile_url, clinic = EXCLUDED.clinic,
           user_id = COALESCE(EXCLUDED.user_id, specialists.user_id)`,
        [
          id,
          slug,
          name,
          title,
          r.photo_url || null,
          r.photo_alt || null,
          r.bio || null,
          r.years_experience ? Number(r.years_experience) : null,
          r.languages || null,
          r.credentials || null,
          r.license_number || null,
          r.license_authority || null,
          r.education || null,
          r.specializations || null,
          r.memberships || null,
          r.external_profile_url || null,
          r.clinic || "Physionnisa Central Clinic",
          linkedUserId,
        ]
      );

      if (linkedUserId) {
        await query(`UPDATE users SET role = 'specialist', specialist_id = $1 WHERE id = $2`, [id, linkedUserId]);
      }

      results.push({ row: i + 2, slug, status: "ok" });
    } catch (err) {
      results.push({
        row: i + 2,
        slug,
        status: "error",
        message: err instanceof Error ? err.message : "Insert failed",
      });
    }
  }

  const succeeded = results.filter((r) => r.status === "ok").length;
  return NextResponse.json({ total: rows.length, succeeded, failed: rows.length - succeeded, results });
}
