"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";

const EMPTY_FORM = {
  slug: "", name: "", category: "Recovery Essentials", short_desc: "", long_desc: "",
  price_pkr: "", compare_at_pkr: "", image_url: "", badge: "", in_stock: true,
  brand: "Physionnisa", gtin: "", mpn: "", condition_gs: "new", availability_gs: "in stock",
  google_product_category: "", product_type: "", currency: "PKR",
};

type BulkResult = {
  total: number;
  succeeded: number;
  failed: number;
  results: { row: number; slug: string; status: "ok" | "error"; message?: string }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load products");
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      slug: p.slug, name: p.name, category: p.category,
      short_desc: p.short_desc || "", long_desc: p.long_desc || "",
      price_pkr: String(p.price_pkr), compare_at_pkr: p.compare_at_pkr ? String(p.compare_at_pkr) : "",
      image_url: p.image_url || "", badge: p.badge || "", in_stock: p.in_stock !== false,
      brand: p.brand || "Physionnisa", gtin: p.gtin || "", mpn: p.mpn || "",
      condition_gs: p.condition_gs || "new", availability_gs: p.availability_gs || "in stock",
      google_product_category: p.google_product_category || "", product_type: p.product_type || "",
      currency: p.currency || "PKR",
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
        ? await fetch(`/api/admin/products/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This can't be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  async function handleBulkUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setBulkUploading(true);
    setBulkResult(null);
    try {
      const text = await file.text();
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: text,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk upload failed");
      setBulkResult(data);
      loadProducts();
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
        <h1 className="text-2xl font-bold text-ink">Products</h1>
        <a
          href="/api/feed/google-shopping"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          View Google Shopping feed ↗
        </a>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Bulk CSV upload */}
      <div className="mt-6 card p-6">
        <p className="font-semibold text-ink">Bulk Upload via CSV</p>
        <p className="mt-1 text-sm text-muted">
          Required columns: <code className="text-xs">slug, name, category, price_pkr</code>.
          Optional: <code className="text-xs">short_desc, long_desc, compare_at_pkr, image_url, badge,
          in_stock, brand, gtin, mpn, condition_gs, availability_gs, google_product_category,
          product_type, currency</code>. Matching an existing <code className="text-xs">slug</code>{" "}
          updates that product.
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
                {bulkResult.results
                  .filter((r) => r.status === "error")
                  .map((r) => (
                    <li key={r.row}>
                      Row {r.row} ({r.slug}): {r.message}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Add / edit form */}
      <form onSubmit={handleSubmit} className="mt-6 card p-6">
        <p className="font-semibold text-ink">{editingId ? "Edit Product" : "Add a Product"}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} required />
          <Field label="Price (PKR)" type="number" value={form.price_pkr} onChange={(v) => setForm({ ...form, price_pkr: v })} required />
          <Field label="Compare-at Price (PKR)" type="number" value={form.compare_at_pkr} onChange={(v) => setForm({ ...form, compare_at_pkr: v })} />
          <Field label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <Field label="Badge" value={form.badge} onChange={(v) => setForm({ ...form, badge: v })} />
          <Field label="Brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
          <Field label="GTIN" value={form.gtin} onChange={(v) => setForm({ ...form, gtin: v })} />
          <Field label="MPN" value={form.mpn} onChange={(v) => setForm({ ...form, mpn: v })} />
          <SelectField label="Condition" value={form.condition_gs} onChange={(v) => setForm({ ...form, condition_gs: v })} options={["new", "refurbished", "used"]} />
          <SelectField label="Availability" value={form.availability_gs} onChange={(v) => setForm({ ...form, availability_gs: v })} options={["in stock", "out of stock", "preorder", "backorder"]} />
          <Field label="Google Product Category" value={form.google_product_category} onChange={(v) => setForm({ ...form, google_product_category: v })} className="lg:col-span-2" />
          <Field label="Product Type" value={form.product_type} onChange={(v) => setForm({ ...form, product_type: v })} />
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
        <label className="mt-4 flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="accent-brand-500" />
          In stock
        </label>
        <div className="mt-5 flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product list */}
      <div className="mt-6 card overflow-x-auto p-6">
        <p className="mb-4 font-semibold text-ink">All Products ({products.length})</p>
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase text-muted">
                <th className="pb-2">Name</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line">
                  <td className="py-3">
                    <p className="font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-muted">/{p.slug}</p>
                  </td>
                  <td className="py-3 text-muted">{p.category}</td>
                  <td className="py-3 text-muted">Rs {Number(p.price_pkr).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={p.in_stock === false ? "text-red-600" : "text-green-600"}>
                      {p.in_stock === false ? "Out of stock" : "In stock"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => startEdit(p)} className="mr-3 text-brand-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && products.length === 0 && (
          <p className="text-sm text-muted">No products yet — add one above or upload a CSV.</p>
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

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
