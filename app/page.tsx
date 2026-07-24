import Image from "next/image";
import Link from "next/link";
import TestimonialCard from "@/components/TestimonialCard";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="container-page grid gap-10 pb-20 pt-14 md:grid-cols-2 md:items-center md:pt-20">
        <div>
          <span className="eyebrow">Clinical Excellence for Women</span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            Empowering Women Through{" "}
            <span className="text-brand-500">Expert Physiotherapy</span>
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
            Specialized care tailored for every stage of your life. From pelvic
            health to sports recovery, we provide clinical authority with
            empathetic expertise.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/booking" className="btn-primary">
              Start Your Recovery
            </Link>
            <Link href="/booking" className="btn-secondary">
              Our Specializations
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-cream bg-brand-200" />
              ))}
            </div>
            500+ Recovered patients this year
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1591343395082-e120087004b4?w=1000&q=80"
              alt="Physiotherapist guiding a patient through treatment"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              📅
            </div>
            <div className="text-xs">
              <p className="font-semibold text-ink">Next Available</p>
              <p className="text-muted">Today, 2:30 PM · 3 spots left</p>
            </div>
          </div>
        </div>
      </section>

      {/* A women-only specialty */}
      <section className="bg-sand py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold text-ink">A Women-Only Specialty</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            We understand the unique physiological and anatomical needs of the
            female body. Our clinic is designed to be a safe, clinical, and
            premium space for your health journey.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "♀",
                title: "Exclusive Focus",
                copy: "Our entire practice is dedicated to women's health, ensuring specialized equipment and specialized knowledge for every patient.",
              },
              {
                icon: "📋",
                title: "Evidence-Based",
                copy: "Every treatment plan is backed by the latest clinical research in female physiotherapy and musculoskeletal health.",
              },
              {
                icon: "🤝",
                title: "Empathetic Care",
                copy: "We pair medical expertise with a wellness-oriented atmosphere to ensure you feel empowered and comfortable.",
              },
            ].map((f) => (
              <div key={f.title} className="card p-8 text-left">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-lg text-brand-600">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized therapy services */}
      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-ink">Specialized Therapy Services</h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              Comprehensive care designed for women&apos;s unique life transitions
              and physical demands.
            </p>
          </div>
          <Link href="/booking" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View All Services →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="relative aspect-[5/4]">
              <Image
                src="https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=900&q=80"
                alt="Pelvic health consultation"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/95 p-4">
              <p className="text-[11px] font-semibold uppercase text-brand-600">Most Requested</p>
              <p className="mt-1 text-base font-semibold text-ink">Pelvic Health &amp; Wellness</p>
              <p className="mt-1 text-sm text-muted">
                Specialized treatment for dysfunction, pain, and strengthening
                the pelvic floor at any age.
              </p>
              <Link href="/booking" className="mt-3 inline-block text-sm font-semibold text-brand-600">
                Learn More →
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="card p-6">
              <p className="mb-2 text-lg">🏃‍♀️</p>
              <p className="font-semibold text-ink">Sports Injury Recovery</p>
              <p className="mt-1 text-sm text-muted">
                Advanced biomechanical assessment and rehab for female athletes
                and active women.
              </p>
            </div>
            <div className="card p-6">
              <p className="mb-2 text-lg">🤰</p>
              <p className="font-semibold text-ink">Pre &amp; Post-Natal Care</p>
              <p className="mt-1 text-sm text-muted">
                Guidance through pregnancy and recovery to help your body
                transition safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold text-ink">What Our Patients Say</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Real stories of recovery and empowerment from the women who trust
            us with their health.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <TestimonialCard
              quote="Recovered faster than I ever thought possible. The pelvic health specialists here are world-class and so compassionate."
              name="Sarah Jenkins"
              role="Post-Natal Recovery Patient"
            />
            <TestimonialCard
              quote="Finally, a clinic that actually listens to women. My running injury was diagnosed accurately after years of generic advice elsewhere."
              name="Elena Rodriguez"
              role="Marathon Runner"
              highlighted
            />
            <TestimonialCard
              quote="The atmosphere is so professional yet warm. I felt completely safe and understood during my entire treatment plan."
              name="Linda Thompson"
              role="Chronic Pain Management"
            />
          </div>
        </div>
      </section>
    </>
  );
}
