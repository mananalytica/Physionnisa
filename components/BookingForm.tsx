"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/dataLayer";
import { SERVICE_RATES } from "@/lib/data";

export default function BookingForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState(SERVICE_RATES[0].id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(e.currentTarget);
    const service = SERVICE_RATES.find((s) => s.id === serviceType)!;
    const payload = {
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      serviceType: service.name,
      servicePrice: service.price_pkr,
      preferredDate: String(form.get("preferredDate") || ""),
      reason: String(form.get("reason") || ""),
    };

    track("book_appointment_request", {
      service_type: payload.serviceType,
      value: payload.servicePrice,
    });

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      const { bookingId } = await res.json();
      router.push(`/checkout/thank-you?booking=${bookingId}`);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("We couldn't submit your request. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 md:p-8">
      <h2 className="text-xl font-semibold text-ink">Secure Your Session</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fullName">
            Full Name
          </label>
          <input id="fullName" name="fullName" required className="input" placeholder="Sarah Jenkins" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input"
            placeholder="sarah@example.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="serviceType">
            Service Type
          </label>
          <select
            id="serviceType"
            name="serviceType"
            className="input"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            {SERVICE_RATES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (Rs {s.price_pkr.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="preferredDate">
            Preferred Date
          </label>
          <input id="preferredDate" name="preferredDate" type="date" required className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="reason">
            Reason for Visit / Symptoms
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={4}
            className="input resize-none"
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
  );
}
