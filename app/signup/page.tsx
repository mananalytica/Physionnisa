"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { track } from "@/lib/dataLayer";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | "specialist">("patient");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      track("cta_click", { label: "signup_success", role });
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-8">
        <p className="text-xl font-bold text-brand-500">Create your account</p>
        <p className="mt-1 text-sm text-muted">
          Track your appointments, orders, and treatment plans in one place.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`rounded-xl border p-3 text-sm font-medium ${
              role === "patient" ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line text-ink/70"
            }`}
          >
            I&apos;m a Patient
          </button>
          <button
            type="button"
            onClick={() => setRole("specialist")}
            className={`rounded-xl border p-3 text-sm font-medium ${
              role === "specialist" ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line text-ink/70"
            }`}
          >
            I&apos;m a Specialist
          </button>
        </div>
        {role === "specialist" && (
          <p className="mt-2 text-xs text-muted">
            After signing up, ask the clinic admin to link your account to your specialist
            profile from the admin panel so your assigned appointments appear here.
          </p>
        )}

        <div className="mt-5">
          <label className="label" htmlFor="fullName">Full Name</label>
          <input id="fullName" required className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="email">Email Address</label>
          <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="phone">Phone Number</label>
          <input id="phone" className="input" placeholder="+92 300 1234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={8} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Creating account…" : "Create Account"}
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
