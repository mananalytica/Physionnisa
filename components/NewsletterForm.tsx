"use client";

import { useState } from "react";
import { track } from "@/lib/dataLayer";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      track("newsletter_signup", { email_domain: email.split("@")[1] });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="mt-3 text-sm font-medium text-white">You&apos;re subscribed 🎉</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="w-full rounded-full border-0 bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-white/90"
      >
        {status === "submitting" ? "…" : "Join"}
      </button>
    </form>
  );
}
