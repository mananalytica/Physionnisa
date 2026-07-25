import Image from "next/image";
import Link from "next/link";
import { getServices } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Services — Physionnisa" };
export const revalidate = 300;

function formatPKR(v: number) {
  return `Rs ${Number(v).toLocaleString("en-PK")}`;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow">Clinical Services</span>
        <h1 className="mt-5 text-4xl font-bold text-ink">Specialized Therapy Services</h1>
        <p className="mt-4 text-[15px] text-muted">
          Every service is delivered by board-certified physiotherapists in a
          women-only clinical setting in Lahore. Choose a service below to
          learn more, or book directly.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="card overflow-hidden">
            <div className="relative aspect-[4/3]">
              {s.image_url && <Image src={s.image_url} alt={s.name} fill className="object-cover" />}
              {s.icon && (
                <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-card">
                  {s.icon}
                </div>
              )}
            </div>
            <div className="p-5">
              {s.category && (
                <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">{s.category}</p>
              )}
              <p className="mt-1 font-semibold text-ink">{s.name}</p>
              {s.short_desc && <p className="mt-1 text-sm text-muted line-clamp-2">{s.short_desc}</p>}
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted">{s.duration_minutes} min</span>
                <span className="font-semibold text-ink">{formatPKR(s.price_pkr)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {services.length === 0 && (
        <p className="mt-12 text-center text-muted">No services published yet — add one from the admin panel.</p>
      )}
    </div>
  );
}
