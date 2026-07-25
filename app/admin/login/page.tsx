"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8">
        <p className="text-xl font-bold text-brand-500">Physionnisa Admin</p>
        <p className="mt-1 text-sm text-muted">Sign in to manage products and specialists.</p>
        <div className="mt-6">
          <label className="label" htmlFor="password">Admin Password</label>
          <input
            id="password"
            type="password"
            required
            autoFocus
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
