import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-sand">
      <div className="container-page grid gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-brand-500">Physionnisa</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Expert physiotherapy tailored for women&apos;s health and empowerment.
            Experience clinical excellence in a warm, premium environment.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/contact" className="hover:text-brand-600">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-brand-600">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-brand-600">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Hours &amp; Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Clinic Hours: Mon–Fri 8am–8pm</li>
            <li>Saturday: 9am–2pm (By Appointment)</li>
            <li>+1 (555) PHY-SION</li>
            <li>care@physionnisa.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Physionnisa Physiotherapy. All rights reserved.
      </div>
    </footer>
  );
}
