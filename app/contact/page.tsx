import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact — Physionnisa" };

const FAQS = [
  {
    icon: "P",
    q: "Where can I park?",
    a: 'Validated patient parking is available in the Medical District Garage adjacent to our building. Follow the signs for "Suite 400 Patient Parking."',
  },
  {
    icon: "💳",
    q: "Do you accept insurance?",
    a: "Yes, we accept most major private insurance providers. We also offer simplified direct billing options for out-of-network claims.",
  },
  {
    icon: "📋",
    q: "What should I bring first visit?",
    a: "Please bring your ID, insurance card, and wear comfortable, loose-fitting clothing that allows easy access to the area being treated.",
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
          empowerment. Reach out to our clinical team for appointments or
          general inquiries.
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
              <p className="text-sm text-muted">120 Wellness Way, Suite 400<br />Central Medical District</p>
            </div>
          </div>
          <div className="card flex items-start gap-3 p-5">
            <span className="text-brand-500">🕐</span>
            <div>
              <p className="font-semibold text-ink">Clinic Hours</p>
              <p className="text-sm text-muted">Mon–Fri: 8am – 8pm<br />Sat–Sun: Closed</p>
            </div>
          </div>
          <div className="card flex items-start gap-3 p-5">
            <span className="text-brand-500">☎</span>
            <div>
              <p className="font-semibold text-ink">Direct Contact</p>
              <p className="text-sm text-muted">(555) 012-3456<br />care@physionnisa.com</p>
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
