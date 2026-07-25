import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/queries";
import type { Metadata } from "next";

export const revalidate = 300;

function formatPKR(v: number) {
  return `Rs ${Number(v).toLocaleString("en-PK")}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  return { title: service ? `${service.name} — Physionnisa` : "Service — Physionnisa" };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://physionnisa.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    name: service.name,
    description: service.long_desc || service.short_desc || service.name,
    url: `${siteUrl}/services/${service.slug}`,
  };

  const benefits = service.benefits ? service.benefits.split(";").map((b) => b.trim()).filter(Boolean) : [];

  return (
    <div className="container-page py-10">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-8 text-sm text-muted">
        <Link href="/services" className="hover:text-brand-600">Services</Link>
        {" "}&gt; <span className="text-brand-600">{service.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
          {service.image_url && (
            <Image src={service.image_url} alt={service.name} fill priority className="object-cover" />
          )}
        </div>

        <div>
          {service.category && <span className="eyebrow">{service.category}</span>}
          <h1 className="mt-4 text-3xl font-bold text-ink">
            {service.icon && <span className="mr-2">{service.icon}</span>}
            {service.name}
          </h1>
          {service.short_desc && <p className="mt-3 text-[15px] text-muted">{service.short_desc}</p>}

          <div className="mt-6 flex items-center gap-8 rounded-xl border border-line bg-sand p-5">
            <div>
              <p className="text-xs text-muted">Duration</p>
              <p className="font-semibold text-ink">{service.duration_minutes} minutes</p>
            </div>
            <div>
              <p className="text-xs text-muted">Price</p>
              <p className="font-semibold text-ink">{formatPKR(service.price_pkr)}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/booking?service=${service.slug}`} className="btn-primary">
              Book This Service
            </Link>
            <Link href="/services" className="btn-secondary">
              View All Services
            </Link>
          </div>
        </div>
      </div>

      {service.long_desc && (
        <div className="mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-ink">About This Service</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{service.long_desc}</p>
        </div>
      )}

      {benefits.length > 0 && (
        <div className="mt-10 max-w-3xl">
          <h2 className="text-xl font-bold text-ink">What&apos;s Included</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-ink">
                <span className="mt-0.5 text-brand-500">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-16">
        <div className="relative overflow-hidden rounded-xl bg-brand-500 p-10 text-white md:p-14">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold md:text-3xl">Ready to book {service.name}?</h2>
            <p className="mt-3 text-sm text-white/85">
              Our clinical coordinators will confirm your slot within one business day.
            </p>
            <Link href={`/booking?service=${service.slug}`} className="mt-6 inline-flex btn bg-white text-brand-600 hover:bg-brand-50">
              Book Now — {formatPKR(service.price_pkr)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
