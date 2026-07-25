import { NextRequest, NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";

const COLUMNS = `
  id, slug, name, title, photo_url, photo_alt, bio, years_experience,
  languages, credentials, license_number, license_authority, education,
  specializations, memberships, external_profile_url, clinic, created_at
`;

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }
  try {
    const specialists = await query(`SELECT ${COLUMNS} FROM specialists ORDER BY created_at DESC`);
    return NextResponse.json({ specialists });
  } catch (err) {
    console.error("GET /api/admin/specialists failed:", err);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "MotherDuck is not configured. See /api/health." }, { status: 503 });
  }
  try {
    const s = await req.json();
    if (!s.slug || !s.name || !s.title) {
      return NextResponse.json({ error: "slug, name, and title are required" }, { status: 400 });
    }

    const computedId = s.id || `sp_${s.slug.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`;
    const existing = await query<{ id: string }>(`SELECT id FROM specialists WHERE slug = $1 LIMIT 1`, [s.slug]);
    const id = existing[0]?.id || computedId;

    await query(
      `INSERT INTO specialists (
         id, slug, name, title, photo_url, photo_alt, bio, years_experience, languages,
         credentials, license_number, license_authority, education, specializations,
         memberships, external_profile_url, clinic
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       ON CONFLICT (id) DO UPDATE SET
         slug = EXCLUDED.slug, name = EXCLUDED.name, title = EXCLUDED.title,
         photo_url = EXCLUDED.photo_url, photo_alt = EXCLUDED.photo_alt, bio = EXCLUDED.bio,
         years_experience = EXCLUDED.years_experience, languages = EXCLUDED.languages,
         credentials = EXCLUDED.credentials, license_number = EXCLUDED.license_number,
         license_authority = EXCLUDED.license_authority, education = EXCLUDED.education,
         specializations = EXCLUDED.specializations, memberships = EXCLUDED.memberships,
         external_profile_url = EXCLUDED.external_profile_url, clinic = EXCLUDED.clinic`,
      [
        id,
        s.slug,
        s.name,
        s.title,
        s.photo_url ?? null,
        s.photo_alt ?? null,
        s.bio ?? null,
        s.years_experience ? Number(s.years_experience) : null,
        s.languages ?? null,
        s.credentials ?? null,
        s.license_number ?? null,
        s.license_authority ?? null,
        s.education ?? null,
        s.specializations ?? null,
        s.memberships ?? null,
        s.external_profile_url ?? null,
        s.clinic ?? "Physionnisa Central Clinic",
      ]
    );

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/specialists failed:", err);
    return NextResponse.json({ error: "Could not save specialist" }, { status: 500 });
  }
}
