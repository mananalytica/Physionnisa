import Image from "next/image";
import BookingForm from "@/components/BookingForm";
import { SERVICE_RATES } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Booking — Physionnisa" };

const PATH = [
  { icon: "🔍", step: "01. Discovery", title: "Initial Consultation", copy: "An introductory call or brief session to understand your goals and background." },
  { icon: "📋", step: "02. Assessment", title: "Movement Analysis", copy: "A deep dive into the physical mechanics to pinpoint the root cause of discomfort." },
  { icon: "🗺️", step: "03. Strategy", title: "Your Custom Plan", copy: "We co-create a roadmap tailored to your specific lifestyle and recovery pace." },
  { icon: "💪", step: "04. Recovery", title: "Guided Therapy", copy: "Hands-on sessions and supervised exercises to build strength and mobility." },
  { icon: "💚", step: "05. Wellness", title: "Long-term Health", copy: "Maintenance strategies to prevent injury and keep you performing at your best." },
];

function formatPKR(v: number) {
  return `Rs ${v.toLocaleString("en-PK")}`;
}

export default function BookingPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">Care Tailored to You</span>
        <h1 className="mt-5 text-4xl font-bold text-ink">
          Expert Physiotherapy, Designed for Women
        </h1>
        <p className="mt-4 text-[15px] text-muted">
          Transparent pricing and a structured path to recovery. Start your
          journey to wellness today with our specialized clinical approach.
        </p>
      </div>

      <h2 className="mt-16 text-2xl font-bold text-ink">Your Path to Recovery</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {PATH.map((p) => (
          <div key={p.step} className="card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-lg text-white">
              {p.icon}
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-600">
              {p.step}
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{p.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{p.copy}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-sand p-8">
        <h3 className="text-lg font-semibold text-ink">What to Expect: Your First Visit</h3>
        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-ink">🕐 Duration</p>
            <p className="mt-1 text-sm text-muted">
              Your initial clinical assessment lasts approximately 60 minutes to
              ensure a comprehensive evaluation.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">👕 Attire</p>
            <p className="mt-1 text-sm text-muted">
              Please wear comfortable, loose-fitting athletic clothing or
              leggings that allow for a full range of movement.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">📄 Documentation</p>
            <p className="mt-1 text-sm text-muted">
              Bring any relevant scan reports (MRI/X-ray) and your insurance
              card for on-site processing.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-2xl font-bold text-ink">Service Rates</h2>
          <p className="mt-2 text-sm text-muted">
            We believe in transparent clinical pricing without hidden fees.
          </p>
          <div className="mt-6 space-y-3">
            {SERVICE_RATES.map((s, i) => (
              <div
                key={s.id}
                className={`card flex items-center justify-between p-5 ${
                  i === 0 ? "border-l-4 border-brand-500" : ""
                }`}
              >
                <div>
                  <p className="font-semibold text-ink">{s.name}</p>
                  <p className="text-sm text-muted">
                    {s.duration} · {s.detail}
                  </p>
                </div>
                <p className="font-semibold text-brand-600">{formatPKR(s.price_pkr)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-sand p-4 text-sm text-muted">
            <span>ⓘ</span>
            <span>
              Health insurance claims can be processed on-site. Please bring
              your insurance card to your session.
            </span>
          </div>
          <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=900&q=80"
              alt="Physionnisa treatment room"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <BookingForm />
      </div>
    </div>
  );
}
