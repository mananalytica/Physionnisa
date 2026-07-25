"use client";

import { useState } from "react";
import { track } from "@/lib/dataLayer";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget; // capture now — e.currentTarget becomes null after the first await
    setStatus("submitting");
    setErrorDetail(null);
    const form = new FormData(formEl);
    const payload = {
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      subject: String(form.get("subject") || ""),
      message: String(form.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Request failed");
      }
      if (!data.stored) {
        console.warn(
          "Message was accepted but NOT written to MotherDuck — check /api/health for config diagnostics."
        );
      }
      track("contact_form_submit", { subject: payload.subject });
      setStatus("done");
      formEl.reset();
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setErrorDetail(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-8 text-center">
        <p className="text-lg font-semibold text-ink">Message sent ✅</p>
        <p className="mt-2 text-sm text-muted">
          Our clinical coordinators will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 md:p-8">
      <h2 className="text-xl font-semibold text-ink">Send us a Message</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fullName">Full Name</label>
          <input id="fullName" name="fullName" required className="input" placeholder="Jane Doe" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" required className="input" placeholder="jane@example.com" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" className="input" placeholder="+92 300 1234567" />
        </div>
        <div>
          <label className="label" htmlFor="subject">Subject</label>
          <select id="subject" name="subject" className="input" defaultValue="Appointment Inquiry">
            <option>Appointment Inquiry</option>
            <option>Billing &amp; Insurance</option>
            <option>Product Question</option>
            <option>General Inquiry</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="message">Your Message</label>
          <textarea id="message" name="message" rows={5} className="input resize-none" placeholder="How can we help you today?" />
        </div>
      </div>
      {status === "error" && (
        <p className="mt-4 text-sm text-red-600">
          Something went wrong{errorDetail ? `: ${errorDetail}` : "."} Please try again.
        </p>
      )}
      <button type="submit" disabled={status === "submitting"} className="btn-primary mt-6 w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "➤ Send Message"}
      </button>
    </form>
  );
}
