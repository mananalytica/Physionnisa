"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/dataLayer";
import { SERVICE_RATES } from "@/lib/data";
import { validateEmail, validatePhone, validateAddress, formatAddress } from "@/lib/addressValidator";
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
type Errors = Record<string, string>;

export default function BookingForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [serviceType, setServiceType] = useState(SERVICE_RATES[0].id);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [country, setCountry] = useState("Pakistan");
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
    setError(null);

    const form = new FormData(e.currentTarget);
    const fields = {
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      addressLine1: String(form.get("addressLine1") || ""),
      addressLine2: String(form.get("addressLine2") || ""),
      city: String(form.get("city") || ""),
      postalCode: String(form.get("postalCode") || ""),
      country,
    };

    const fieldErrors: Errors = {
      ...validateAddress(fields),
    };
    const emailErr = validateEmail(fields.email);
    if (emailErr) fieldErrors.email = emailErr;
    const phoneErr = validatePhone(fields.phone, country);
    if (phoneErr) fieldErrors.phone = phoneErr;
    if (!fields.fullName.trim()) fieldErrors.fullName = "Full name is required.";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    const service = SERVICE_RATES.find((s) => s.id === serviceType)!;
    const payload = {
      fullName: fields.fullName,
      email: fields.email,
      phone: fields.phone,
      addressLine1: fields.addressLine1,
      addressLine2: fields.addressLine2,
      city: fields.city,
      postalCode: fields.postalCode,
      country: fields.country,
      address: formatAddress(fields),
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
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <form onSubmit={handleSubmit} noValidate className="card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Contact Details</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName" name="fullName" className={`input ${errors.fullName ? "input-error" : ""}`}
              placeholder="Sana Malik" defaultValue={prefill.fullName} key={prefill.fullName || "fullName"}
            />
            {errors.fullName && <p className="field-error">{errors.fullName}</p>}
          </div>
          <div>
            <label className="label" htmlFor="email">Email Address</label>
            <input
              id="email" name="email" type="email" className={`input ${errors.email ? "input-error" : ""}`}
              placeholder="sana@example.com" defaultValue={prefill.email} key={prefill.email || "email"}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone Number</label>
            <input
              id="phone" name="phone" className={`input ${errors.phone ? "input-error" : ""}`}
              placeholder="+92 300 1234567" defaultValue={prefill.phone} key={prefill.phone || "phone"}
            />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>
          <div>
            <label className="label" htmlFor="preferredDate">Preferred Date</label>
            <input id="preferredDate" name="preferredDate" type="date" required className="input" />
          </div>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted">Home Address</p>
        <p className="mt-1 text-xs text-muted">
          Used for our records and, if needed, a home-visit option — not shared with anyone outside the clinic.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="addressLine1">House / Building &amp; Street</label>
            <input
              id="addressLine1" name="addressLine1" className={`input ${errors.addressLine1 ? "input-error" : ""}`}
              placeholder="House 12-C, Street 4"
            />
            {errors.addressLine1 && <p className="field-error">{errors.addressLine1}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="addressLine2">Area / Block / Landmark (optional)</label>
            <input id="addressLine2" name="addressLine2" className="input" placeholder="Block C, Gulberg III" />
          </div>
          <div>
            <label className="label" htmlFor="city">City</label>
            <input
              id="city" name="city" className={`input ${errors.city ? "input-error" : ""}`}
              placeholder="Lahore" defaultValue="Lahore"
            />
            {errors.city && <p className="field-error">{errors.city}</p>}
          </div>
          <div>
            <label className="label" htmlFor="postalCode">Postal Code</label>
            <input
              id="postalCode" name="postalCode" className={`input ${errors.postalCode ? "input-error" : ""}`}
              placeholder="54000"
            />
            {errors.postalCode && <p className="field-error">{errors.postalCode}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="country">Country</label>
            <select
              id="country" name="country" className="input"
              value={country} onChange={(e) => setCountry(e.target.value)}
            >
              <option value="Pakistan">Pakistan</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted">Appointment</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
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
          <div>
            <label className="label" htmlFor="specialistId">Preferred Specialist (optional)</label>
            <select id="specialistId" name="specialistId" className="input" defaultValue="">
              <option value="">No preference — any available</option>
              {specialists.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
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

      <div className="h-fit rounded-xl border border-line bg-sand p-5">
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
