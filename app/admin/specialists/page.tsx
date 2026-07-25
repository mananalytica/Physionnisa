"use client";

import { useEffect, useRef, useState } from "react";
import type { Specialist } from "@/lib/types";

const EMPTY_FORM = {
  slug: "", name: "", title: "", photo_url: "", photo_alt: "", bio: "",
  years_experience: "", languages: "", credentials: "", license_number: "",
  license_authority: "", education: "", specializations: "", memberships: "",
  external_profile_url: "", clinic: "Physionnisa Central Clinic", linked_email: "",
};

type BulkResult = {
  total: number;
  succeeded: number;
  failed: number;
  results: { row: number; slug: string; status: "ok" | "error"; message?: string }[];
};

export default function AdminSpecialistsPage() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadSpecialists() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/specialists");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load specialists");
      setSpecialists(data.specialists);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load specialists");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSpecialists();
  }, []);

  function startEdit(s: Specialist) {
    setEditingId(s.id);
    setForm({
      slug: s.slug, name: s.name, title: s.title, photo_url: s.photo_url || "",
      photo_alt: s.photo_alt || "", bio: s.bio || "",
      years_experience: s.years_experience ? String(s.years_experience) : "",
      languages: s.languages || "", credentials: s.credentials || "",
      license_number: s.license_number || "", license_authority: s.license_authority || "",
      education: s.education || "", specializations: s.specializations || "",
      memberships: s.memberships || "", external_profile_url: s.external_profile_url || "",
      clinic: s.clinic || "Physionnisa Central Clinic", linked_email: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, id: editingId || undefined };
      const res = editingId
        ? await fetch(`/api/admin/specialists/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/specialists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      resetForm();
      loadSpecialists();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this specialist profile? This can't be undone.")) return;
    await fetch(`/api/admin/specialists/${id}`, { method: "DELETE" });
    loadSpecialists();
  }

  async function handleBulkUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setBulkUploading(true);
    setBulkResult(null);
    try {
      const text = await file.text();
      const res = await fetch("/api/admin/specialists/bulk", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: text,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk upload failed");
      setBulkResult(data);
      loadSpecialists();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk upload failed");
    } finally {
      setBulkUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Specialists</h1>

      <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
        Following Google&apos;s guidance for health-related (YMYL) content: fill in
        real credentials, licensing authority, and education — these power
        the structured data (schema.org Person + medical credentials) on the
        public profile page and support search trust signals (E-E-A-T).
        Avoid vague or unverifiable claims.
      </div>

      {error && <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="mt-6 card p-6">
        <p className="font-semibold text-ink">Bulk Upload via CSV</p>
        <p className="mt-1 text-sm text-muted">
          Required columns: <code className="text-xs">slug, name, title</code>. Optional:{" "}
          <code className="text-xs">photo_url, photo_alt, bio, years_experience, languages,
          credentials, license_number, license_authority, education (semicolon-separated),
          specializations (comma-separated), memberships (comma-separated),
          external_profile_url, clinic, linked_email</code>.
          Matching an existing <code className="text-xs">slug</code> updates that profile.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="text-sm" />
          <button onClick={handleBulkUpload} disabled={bulkUploading} className="btn-primary !py-2">
            {bulkUploading ? "Uploading…" : "Upload CSV"}
          </button>
        </div>
        {bulkResult && (
          <div className="mt-4 rounded-xl bg-sand p-4 text-sm">
            <p className="font-medium text-ink">
              {bulkResult.succeeded} of {bulkResult.total} rows saved
              {bulkResult.failed > 0 ? `, ${bulkResult.failed} failed` : ""}.
            </p>
            {bulkResult.failed > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-red-700">
                {bulkResult.results.filter((r) => r.status === "error").map((r) => (
                  <li key={r.row}>Row {r.row} ({r.slug}): {r.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 card p-6">
        <p className="font-semibold text-ink">{editingId ? "Edit Specialist" : "Add a Specialist"}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
          <Field label="Photo URL" value={form.photo_url} onChange={(v) => setForm({ ...form, photo_url: v })} className="lg:col-span-2" />
          <Field label="Photo Alt Text" value={form.photo_alt} onChange={(v) => setForm({ ...form, photo_alt: v })} />
          <Field label="Years of Experience" type="number" value={form.years_experience} onChange={(v) => setForm({ ...form, years_experience: v })} />
          <Field label="Languages (comma-separated)" value={form.languages} onChange={(v) => setForm({ ...form, languages: v })} />
          <Field label="Clinic" value={form.clinic} onChange={(v) => setForm({ ...form, clinic: v })} />
        </div>

        <div className="mt-4">
          <label className="label">Bio</label>
          <textarea className="input" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted">
          Credentials &amp; Trust Signals
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Credentials (e.g. DPT, MSc)" value={form.credentials} onChange={(v) => setForm({ ...form, credentials: v })} />
          <Field label="License Number" value={form.license_number} onChange={(v) => setForm({ ...form, license_number: v })} />
          <Field label="Licensing Authority" value={form.license_authority} onChange={(v) => setForm({ ...form, license_authority: v })} />
          <Field label="Specializations (comma-separated)" value={form.specializations} onChange={(v) => setForm({ ...form, specializations: v })} className="lg:col-span-2" />
          <Field label="External Verification URL" value={form.external_profile_url} onChange={(v) => setForm({ ...form, external_profile_url: v })} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted">
          Portal Access
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field
            label="Linked Account Email (optional)"
            value={form.linked_email}
            onChange={(v) => setForm({ ...form, linked_email: v })}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          If this specialist has signed up for an account (as a &quot;Specialist&quot; at /signup),
          enter their email here to link it — their assigned appointments will then show up in
          their portal at /account. Leave blank to skip for now.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Education (separate entries with ;)</label>
            <textarea className="input" rows={2} value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="Doctor of Physical Therapy, Stanford University, 2005–2008; ..." />
          </div>
          <div>
            <label className="label">Professional Memberships (comma-separated)</label>
            <textarea className="input" rows={2} value={form.memberships} onChange={(e) => setForm({ ...form, memberships: e.target.value })} />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : editingId ? "Update Specialist" : "Add Specialist"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 card p-6">
        <p className="mb-4 font-semibold text-ink">All Specialists ({specialists.length})</p>
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : (
          <ul className="divide-y divide-line">
            {specialists.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">
                    {s.name}
                    {s.user_id && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                        Portal Linked
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted">{s.title} · /{s.slug}</p>
                </div>
                <div>
                  <button onClick={() => startEdit(s)} className="mr-3 text-brand-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!loading && specialists.length === 0 && (
          <p className="text-sm text-muted">No specialist profiles yet — add one above.</p>
        )}
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required = false, className = "",
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <label className="label">{label}{required && " *"}</label>
      <input type={type} required={required} className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
