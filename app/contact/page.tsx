import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact — Physionnisa" };

const FAQS = [
  {
    icon: "P",
    q: "Where can I park?",
    a: `Complimentary patient parking is available in front of our ${SITE.clinic.area} clinic. On busy market days, valet parking is offered at the main gate.`,
  },
  {
    icon: "💳",
    q: "Do you accept insurance?",
    a: "Yes, we accept most major Pakistani health insurance and TPA panels, including corporate health cards. We also offer direct billing for out-of-network claims.",
  },
  {
    icon: "📋",
    q: "What should I bring first visit?",
    a: "Please bring your CNIC, insurance/health card (if applicable), and wear comfortable, loose-fitting clothing that allows easy access to the area being treated.",
  },
  {
    icon: "🕐",
    q: "How long are sessions?",
    a: "Initial evaluations typically take 60 minutes. Standard follow-up treatment sessions are scheduled for 45 minutes of dedicated clinician time.",
  },
];

export default function ContactPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-bold text-ink">Get in Touch</h1>
        <p className="mt-3 text-[15px] text-muted">
          We&apos;re here to support your journey to physical wellness and
          empowerment. Reach out to our clinical team in {SITE.city} for
          appointments or general inquiries.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ContactForm />

        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-ink">Find Us</h2>
          <div className="card flex items-start gap-3 p-5">
            <span className="text-brand-500">📍</span>
            <div>
              <p className="font-semibold text-ink">Main Clinic</p>
              <p className="text-sm text-muted">
                {SITE.clinic.addressLine1}<br />{SITE.clinic.addressLine2}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.clinic.mapsQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs font-semibold text-brand-600"
              >
                Get directions ↗
              </a>
            </div>
          </div>
          <div className="card flex items-start gap-3 p-5">
            <span className="text-brand-500">🕐</span>
            <div>
              <p className="font-semibold text-ink">Clinic Hours</p>
              <p className="text-sm text-muted">
                {SITE.clinic.hoursWeekday}<br />{SITE.clinic.hoursWeekend}
              </p>
            </div>
          </div>
          <div className="card flex items-start gap-3 p-5">
            <span className="text-brand-500">☎</span>
            <div>
              <p className="font-semibold text-ink">Direct Contact</p>
              <p className="text-sm text-muted">
                {SITE.clinic.phoneDisplay}<br />{SITE.clinic.email}
              </p>
              <a
                href={SITE.clinic.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs font-semibold text-brand-600"
              >
                WhatsApp us ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-center text-3xl font-bold text-ink">Common Questions</h2>
        <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          {FAQS.map((f) => (
            <div key={f.q} className="card p-6">
              <p className="flex items-center gap-2 font-semibold text-brand-600">
                <span>{f.icon}</span> {f.q}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
