"use client";

import { useEffect, useRef, useState } from "react";
import type { Service } from "@/lib/types";

const EMPTY_FORM = {
  slug: "", name: "", category: "", short_desc: "", long_desc: "",
  duration_minutes: "60", price_pkr: "", icon: "", image_url: "",
  benefits: "", is_featured: false, display_order: "0",
};

type BulkResult = {
  total: number;
  succeeded: number;
  failed: number;
  results: { row: number; slug: string; status: "ok" | "error"; message?: string }[];
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadServices() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load services");
      setServices(data.services);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function startEdit(s: Service) {
    setEditingId(s.id);
    setForm({
      slug: s.slug, name: s.name, category: s.category || "",
      short_desc: s.short_desc || "", long_desc: s.long_desc || "",
      duration_minutes: String(s.duration_minutes || 60), price_pkr: String(s.price_pkr),
      icon: s.icon || "", image_url: s.image_url || "", benefits: s.benefits || "",
      is_featured: Boolean(s.is_featured), display_order: String(s.display_order ?? 0),
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
        ? await fetch(`/api/admin/services/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/services", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      resetForm();
      loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service? Existing bookings referencing it are unaffected.")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    loadServices();
  }

  async function handleBulkUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setBulkUploading(true);
    setBulkResult(null);
    try {
      const text = await file.text();
      const res = await fetch("/api/admin/services/bulk", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: text,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk upload failed");
      setBulkResult(data);
      loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk upload failed");
    } finally {
      setBulkUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Services</h1>
        <a href="/services" target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-600 hover:underline">
          View public services page ↗
        </a>
      </div>
      <p className="mt-2 text-sm text-muted">
        Services appear on <code className="text-xs">/services</code> with their own detail
        page, and populate the Service Type dropdown on the booking form automatically.
      </p>

      {error && <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {/* Bulk CSV upload */}
      <div className="mt-6 card p-6">
        <p className="font-semibold text-ink">Bulk Upload via CSV</p>
        <p className="mt-1 text-sm text-muted">
          Required columns: <code className="text-xs">slug, name, price_pkr</code>. Optional:{" "}
          <code className="text-xs">category, short_desc, long_desc, duration_minutes, icon,
          image_url, benefits (semicolon-separated), is_featured, display_order</code>.
          Matching an existing <code className="text-xs">slug</code> updates that service.
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

      {/* Add / edit form */}
      <form onSubmit={handleSubmit} className="mt-6 card p-6">
        <p className="font-semibold text-ink">{editingId ? "Edit Service" : "Add a Service"}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Field label="Price (PKR)" type="number" value={form.price_pkr} onChange={(v) => setForm({ ...form, price_pkr: v })} required />
          <Field label="Duration (minutes)" type="number" value={form.duration_minutes} onChange={(v) => setForm({ ...form, duration_minutes: v })} />
          <Field label="Icon (emoji)" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
          <Field label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} className="lg:col-span-2" />
          <Field label="Display Order" type="number" value={form.display_order} onChange={(v) => setForm({ ...form, display_order: v })} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Short Description</label>
            <textarea className="input" rows={2} value={form.short_desc} onChange={(e) => setForm({ ...form, short_desc: e.target.value })} />
          </div>
          <div>
            <label className="label">Long Description</label>
            <textarea className="input" rows={2} value={form.long_desc} onChange={(e) => setForm({ ...form, long_desc: e.target.value })} />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Benefits (semicolon-separated)</label>
          <textarea
            className="input" rows={2} value={form.benefits}
            onChange={(e) => setForm({ ...form, benefits: e.target.value })}
            placeholder="Biofeedback-guided training; Manual therapy; Discreet clinical setting"
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-brand-500" />
          Featured (highlighted on the homepage and services index)
        </label>
        <div className="mt-5 flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : editingId ? "Update Service" : "Add Service"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Service list */}
      <div className="mt-6 card overflow-x-auto p-6">
        <p className="mb-4 font-semibold text-ink">All Services ({services.length})</p>
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase text-muted">
                <th className="pb-2">Name</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Duration</th>
                <th className="pb-2">Price</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-line">
                  <td className="py-3">
                    <p className="font-medium text-ink">{s.icon} {s.name}</p>
                    <p className="text-xs text-muted">/{s.slug}</p>
                  </td>
                  <td className="py-3 text-muted">{s.category || "—"}</td>
                  <td className="py-3 text-muted">{s.duration_minutes} min</td>
                  <td className="py-3 text-muted">Rs {Number(s.price_pkr).toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => startEdit(s)} className="mr-3 text-brand-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && services.length === 0 && (
          <p className="text-sm text-muted">No services yet — add one above or upload a CSV.</p>
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
