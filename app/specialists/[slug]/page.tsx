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

const EXPERTISE = [
  { icon: "♀", title: "Pelvic Health", copy: "Treatment for incontinence, pelvic organ prolapse, and chronic pelvic pain through muscle re-education and functional integration." },
  { icon: "🤰", title: "Post-Natal Recovery", copy: "Comprehensive assessments and progressive rehabilitation programs for Diastasis Recti and post-delivery core restoration." },
  { icon: "🏃‍♀️", title: "Sports Injury Rehab", copy: "Specialized protocols for female athletes, focusing on hip mechanics, ACL prevention, and return-to-sport safely after injury." },
];

export default async function SpecialistPage({ params }: { params: { slug: string } }) {
  const specialist = await getSpecialistBySlug(params.slug);
  if (!specialist) notFound();

  return (
    <div>
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
              <li>📋 {specialist.years_experience}+ Years Experience</li>
              <li>🌐 {specialist.languages}</li>
              <li>👥 4,000+ Success Stories</li>
              <li>📍 {specialist.clinic}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <h2 className="text-2xl font-bold text-ink">Specialized Expertise</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          Focused clinical tracks designed to address the unique physiological
          needs of women across every life stage.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {EXPERTISE.map((e) => (
            <div key={e.title} className="card p-6 text-left">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-lg text-brand-600">
                {e.icon}
              </div>
              <p className="mt-4 font-semibold text-ink">{e.title}</p>
              <p className="mt-2 text-sm text-muted">{e.copy}</p>
            </div>
          ))}
        </div>
      </section>

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
