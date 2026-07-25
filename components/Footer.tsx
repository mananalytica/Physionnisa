import Link from "next/link";
import { SITE } from "@/lib/siteConfig";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-sand">
      <div className="container-page grid gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-brand-500">Physionnisa</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {SITE.tagline} Experience clinical excellence in a warm, premium environment in {SITE.city}.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/specialists" className="hover:text-brand-600">
                Our Specialists
              </Link>
            </li>
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
            <li>{SITE.clinic.hoursWeekday}</li>
            <li>{SITE.clinic.hoursWeekend}</li>
            <li>{SITE.clinic.addressLine1}, {SITE.clinic.area}, {SITE.city}</li>
            <li>
              <a href={SITE.clinic.phoneHref} className="hover:text-brand-600">
                {SITE.clinic.phoneDisplay}
              </a>
            </li>
            <li>{SITE.clinic.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
