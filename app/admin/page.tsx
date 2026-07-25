"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HealthResponse = {
  configured: boolean;
  connection?: "ok" | "error";
  connectionError?: string;
  message?: string;
  rowCounts?: Record<string, number | string>;
  configStatus: {
    hasToken: boolean;
    hasDatabase: boolean;
    database: string | null;
    host: string;
    port: string;
  };
};

export default function AdminDashboard() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Dashboard</h1>

      <div className="mt-6 card p-6">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-ink">MotherDuck Connection</p>
          {loading ? (
            <span className="text-sm text-muted">Checking…</span>
          ) : health?.connection === "ok" ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Connected
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              Not Connected
            </span>
          )}
        </div>

        {!loading && health && (
          <div className="mt-4 text-sm text-muted">
            {health.message && <p>{health.message}</p>}
            {health.connectionError && <p className="text-red-600">{health.connectionError}</p>}
            <dl className="mt-3 grid grid-cols-2 gap-y-1 sm:grid-cols-4">
              <dt className="text-xs uppercase text-muted/70">Token set</dt>
              <dd>{health.configStatus.hasToken ? "Yes" : "No"}</dd>
              <dt className="text-xs uppercase text-muted/70">Database</dt>
              <dd>{health.configStatus.database || "—"}</dd>
            </dl>
            {health.rowCounts && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted/70">
                  Row counts
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Object.entries(health.rowCounts).map(([table, count]) => (
                    <div key={table} className="rounded-lg bg-sand px-3 py-2">
                      <p className="text-xs text-muted">{table}</p>
                      <p className="font-semibold text-ink">{String(count)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/products" className="card p-6 hover:shadow-soft">
          <p className="font-semibold text-ink">Manage Products →</p>
          <p className="mt-1 text-sm text-muted">
            Add products one at a time, edit existing ones, or bulk-upload via CSV.
          </p>
        </Link>
        <Link href="/admin/specialists" className="card p-6 hover:shadow-soft">
          <p className="font-semibold text-ink">Manage Specialists →</p>
          <p className="mt-1 text-sm text-muted">
            Add clinician profiles with credentials, education, and specializations.
          </p>
        </Link>
      </div>
    </div>
  );
}
