import Image from "next/image";
import Link from "next/link";
import { getSpecialists } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Specialists — Physionnisa" };
export const revalidate = 300;

export default async function SpecialistsPage() {
  const specialists = await getSpecialists();

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow">Board Certified Specialists</span>
        <h1 className="mt-5 text-4xl font-bold text-ink">Meet Our Clinical Team</h1>
        <p className="mt-4 text-[15px] text-muted">
          Every physiotherapist at Physionnisa is board-certified and
          specializes exclusively in women&apos;s health — pelvic health,
          post-natal recovery, and sports injury rehabilitation.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {specialists.map((s) => (
          <Link key={s.slug} href={`/specialists/${s.slug}`} className="card overflow-hidden">
            <div className="relative aspect-[4/5]">
              {s.photo_url && (
                <Image src={s.photo_url} alt={s.photo_alt || s.name} fill className="object-cover" />
              )}
            </div>
            <div className="p-5">
              <p className="font-semibold text-ink">{s.name}</p>
              <p className="mt-1 text-sm text-muted">{s.title}</p>
              {s.specializations && (
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-brand-600">
                  {s.specializations.split(",")[0].trim()}
                </p>
              )}
              <span className="mt-3 inline-block text-sm font-semibold text-brand-600">
                View Profile →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {specialists.length === 0 && (
        <p className="mt-12 text-center text-muted">
          No specialist profiles yet — add one from the admin panel.
        </p>
      )}
    </div>
  );
}
