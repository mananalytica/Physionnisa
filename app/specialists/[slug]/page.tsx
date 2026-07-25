import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpecialistBySlug } from "@/lib/queries";
import TestimonialCard from "@/components/TestimonialCard";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const specialist = await getSpecialistBySlug(params.slug);
  return { title: specialist ? `${specialist.name} — Physionnisa` : "Specialist — Physionnisa" };
}

const EXPERTISE_ICONS = ["♀", "🤰", "🏃‍♀️", "💪", "🧘‍♀️", "🦴"];

export default async function SpecialistPage({ params }: { params: { slug: string } }) {
  const specialist = await getSpecialistBySlug(params.slug);
  if (!specialist) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://physionnisa.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: specialist.name,
    jobTitle: specialist.title,
    description: specialist.bio || undefined,
    image: specialist.photo_url || undefined,
    url: `${siteUrl}/specialists/${specialist.slug}`,
    worksFor: { "@type": "MedicalOrganization", name: specialist.clinic || "Physionnisa" },
    hasCredential: specialist.credentials
      ? specialist.credentials.split(",").map((c) => ({
          "@type": "EducationalOccupationalCredential",
          credentialCategory: c.trim(),
        }))
      : undefined,
    alumniOf: specialist.education
      ? specialist.education.split(";").map((e) => ({ "@type": "EducationalOrganization", name: e.trim() }))
      : undefined,
    memberOf: specialist.memberships
      ? specialist.memberships.split(",").map((m) => ({ "@type": "Organization", name: m.trim() }))
      : undefined,
    knowsAbout: specialist.specializations
      ? specialist.specializations.split(",").map((s) => s.trim())
      : undefined,
    sameAs: specialist.external_profile_url ? [specialist.external_profile_url] : undefined,
  };

  return (
    <div>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="container-page grid gap-10 py-14 md:grid-cols-2 md:items-center">
        <div>
          <span className="eyebrow">Board Certified Specialist</span>
          <h1 className="mt-5 text-4xl font-bold text-ink">{specialist.name}</h1>
          <p className="mt-3 text-[15px] text-muted">{specialist.title}</p>
          <div className="mt-8 flex gap-3">
            <Link href="/booking" className="btn-primary">
              📅 Book Appointment
            </Link>
            <Link href="/booking" className="btn-secondary">
              View Schedule
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          {specialist.photo_url && (
            <Image src={specialist.photo_url} alt={specialist.name} fill priority className="object-cover" />
          )}
        </div>
      </section>

      <section className="bg-sand py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-2xl font-bold text-ink">Clinical Approach &amp; Philosophy</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{specialist.bio}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              {specialist.name.split(" ")[1] ?? specialist.name} believes that rehabilitation is a
              collaborative journey — combining manual therapy, targeted therapeutic exercise, and
              advanced biofeedback technology to create personalized recovery blueprints that respect
              each patient&apos;s unique lifestyle and goals.
            </p>
          </div>
          <div className="card p-6">
            <p className="font-semibold text-ink">Quick Facts</p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {specialist.years_experience && <li>📋 {specialist.years_experience}+ Years Experience</li>}
              {specialist.languages && <li>🌐 {specialist.languages}</li>}
              {specialist.credentials && <li>🎓 {specialist.credentials}</li>}
              {specialist.clinic && <li>📍 {specialist.clinic}</li>}
            </ul>
          </div>
        </div>
      </section>

      {(specialist.education || specialist.memberships || specialist.license_authority) && (
        <section className="container-page py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {specialist.education && (
              <div className="card p-6">
                <p className="font-semibold text-ink">Education &amp; Credentials</p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {specialist.education.split(";").map((e) => (
                    <li key={e} className="border-l-2 border-brand-200 pl-3">
                      {e.trim()}
                    </li>
                  ))}
                </ul>
                {specialist.license_authority && (
                  <p className="mt-4 text-xs text-muted">
                    Licensed under {specialist.license_authority}
                    {specialist.license_number ? ` · License #${specialist.license_number}` : ""}
                  </p>
                )}
              </div>
            )}
            {specialist.memberships && (
              <div className="card p-6">
                <p className="font-semibold text-ink">Professional Memberships</p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {specialist.memberships.split(",").map((m) => (
                    <li key={m} className="flex items-center gap-2">
                      <span className="text-brand-500">✓</span>
                      {m.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {specialist.specializations && (
        <section className="container-page py-16 text-center">
          <h2 className="text-2xl font-bold text-ink">Specialized Expertise</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
            Focused clinical tracks designed to address the unique physiological
            needs of women across every life stage.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {specialist.specializations.split(",").map((title, i) => (
              <div key={title} className="card p-6 text-left">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-lg text-brand-600">
                  {EXPERTISE_ICONS[i % EXPERTISE_ICONS.length]}
                </div>
                <p className="mt-4 font-semibold text-ink">{title.trim()}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-sand py-16 text-center">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-ink">Patient Experiences</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <TestimonialCard
              quote="Dr. Elena completely changed my perspective on recovery after my second pregnancy. Her technical knowledge is immense, but it's her empathy that truly makes the difference."
              name="Sarah J."
              role="Post-natal Patient"
            />
            <TestimonialCard
              quote="The clinical precision of the treatment plan for my pelvic pain was life-changing. I felt heard and respected at every step of the way."
              name="Maya R."
              role="Chronic Pain Patient"
            />
            <TestimonialCard
              quote="Expert care for athletes that understands specific physiology. Elena's return-to-sport program was rigorous but exactly what I needed."
              name="Jessica T."
              role="Professional Triathlete"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-10 text-white md:p-14">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold md:text-3xl">
              Start Your Recovery Journey with {specialist.name}
            </h2>
            <p className="mt-3 text-sm text-white/85">
              {specialist.name} is currently accepting new patients at our
              Central London and Digital clinics.
            </p>
            <div className="mt-6 flex gap-8 text-sm">
              <div>
                <p className="text-white/70">Next Available</p>
                <p className="font-semibold">Tomorrow, 10:00 AM</p>
              </div>
              <div>
                <p className="text-white/70">Consultation</p>
                <p className="font-semibold">60 Minutes</p>
              </div>
            </div>
            <Link href="/booking" className="mt-6 inline-flex btn bg-white text-brand-600 hover:bg-brand-50">
              Book Your Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
