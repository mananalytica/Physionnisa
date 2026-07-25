"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/dataLayer";
import { SERVICE_RATES } from "@/lib/data";
import type { Specialist } from "@/lib/types";

const REFERRAL_SOURCES = [
  "Instagram / Facebook",
  "Google Search",
  "Friend or Family Referral",
  "Doctor Referral",
  "Walked In",
  "Other",
];

const GENERAL_TIPS = [
  "Arrive 10 minutes early to complete your intake form.",
  "Wear comfortable, loose-fitting clothing that allows movement.",
  "Bring your CNIC and any relevant scan reports (MRI/X-ray).",
];

const SERVICE_TIPS: Record<string, string[]> = {
  initial: [
    "This is a 60-minute deep-dive — come with a list of your main symptoms and when they started.",
    "If this relates to pregnancy or delivery, bring your delivery date/type if applicable.",
  ],
  follow_up: [
    "Bring your home exercise log or note any changes since your last session.",
    "Wear the same or similar footwear you've been training in, if relevant.",
  ],
  extended: [
    "Extended sessions are for complex cases — bring any prior imaging, referral letters, or specialist reports.",
    "Plan for 90 minutes; you may want to arrange transport/childcare accordingly.",
  ],
};

type MeResponse = { user: { full_name: string; email: string; phone: string | null } | null };

export default function BookingForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState(SERVICE_RATES[0].id);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [prefill, setPrefill] = useState<{ fullName: string; email: string; phone: string }>({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetch("/api/specialists")
      .then((r) => r.json())
      .then((d) => setSpecialists(d.specialists || []))
      .catch(() => {});

    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: MeResponse | null) => {
        if (d?.user) {
          setPrefill({
            fullName: d.user.full_name,
            email: d.user.email,
            phone: d.user.phone || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(e.currentTarget);
    const service = SERVICE_RATES.find((s) => s.id === serviceType)!;
    const payload = {
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      address: String(form.get("address") || ""),
      serviceType: service.name,
      servicePrice: service.price_pkr,
      specialistId: String(form.get("specialistId") || "") || undefined,
      preferredDate: String(form.get("preferredDate") || ""),
      reason: String(form.get("reason") || ""),
      referralSource: String(form.get("referralSource") || ""),
    };

    track("book_appointment_request", {
      service_type: payload.serviceType,
      value: payload.servicePrice,
      specialist_id: payload.specialistId,
    });

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      const { bookingId, stored } = await res.json();
      if (!stored) {
        console.warn(
          "Booking was accepted but NOT written to MotherDuck — check /api/health for config diagnostics."
        );
      }
      router.push(`/checkout/thank-you?booking=${bookingId}`);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("We couldn't submit your request. Please try again.");
    }
  }

  const tips = [...(SERVICE_TIPS[serviceType] || []), ...GENERAL_TIPS];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
      <form onSubmit={handleSubmit} className="card p-6 md:p-8">
        <h2 className="text-xl font-semibold text-ink">Secure Your Session</h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName" name="fullName" required className="input"
              placeholder="Sana Malik" defaultValue={prefill.fullName} key={prefill.fullName || "fullName"}
            />
          </div>
          <div>
            <label className="label" htmlFor="email">Email Address</label>
            <input
              id="email" name="email" type="email" required className="input"
              placeholder="sana@example.com" defaultValue={prefill.email} key={prefill.email || "email"}
            />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone Number</label>
            <input
              id="phone" name="phone" required className="input"
              placeholder="+92 300 1234567" defaultValue={prefill.phone} key={prefill.phone || "phone"}
            />
          </div>
          <div>
            <label className="label" htmlFor="serviceType">Service Type</label>
            <select
              id="serviceType" name="serviceType" className="input"
              value={serviceType} onChange={(e) => setServiceType(e.target.value)}
            >
              {SERVICE_RATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Rs {s.price_pkr.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="address">Address</label>
            <input
              id="address" name="address" required className="input"
              placeholder="House/flat #, street, block, area, Lahore"
            />
          </div>
          <div>
            <label className="label" htmlFor="specialistId">Preferred Specialist (optional)</label>
            <select id="specialistId" name="specialistId" className="input" defaultValue="">
              <option value="">No preference — any available</option>
              {specialists.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="preferredDate">Preferred Date</label>
            <input id="preferredDate" name="preferredDate" type="date" required className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="referralSource">How did you hear about us?</label>
            <select id="referralSource" name="referralSource" className="input" defaultValue="">
              <option value="" disabled>Select an option</option>
              {REFERRAL_SOURCES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="reason">Reason for Visit / Symptoms</label>
            <textarea
              id="reason" name="reason" rows={4} className="input resize-none"
              placeholder="Briefly describe what you'd like to address..."
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={status === "submitting"} className="btn-primary mt-6 w-full">
          {status === "submitting" ? "Submitting…" : "Request Booking"}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          By clicking request, you agree to our 24-hour cancellation policy.
        </p>
      </form>

      <div className="h-fit rounded-2xl bg-sand p-5">
        <p className="text-sm font-semibold text-ink">Recommended for Your Visit</p>
        <ul className="mt-3 space-y-3 text-sm text-muted">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span className="text-brand-500">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
