import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { getBlogPosts } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog — Physionnisa" };
export const revalidate = 120;

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-bold text-ink">Physio Insights</h1>
        <p className="mt-3 text-[15px] text-muted">
          Exploring modern advancements, empowering women through pelvic
          health education, and guiding safe movement during pregnancy.
        </p>
      </div>

      {featured && (
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
          <Link href={`/blog/${featured.slug}`} className="card overflow-hidden">
            <div className="relative aspect-[16/8]">
              {featured.cover_image && (
                <Image src={featured.cover_image} alt={featured.title} fill className="object-cover" />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="rounded-full bg-brand-500 px-2.5 py-1 font-semibold text-white">
                  {featured.category}
                </span>
                {featured.published_at && <span>{featured.published_at}</span>}
              </div>
              <h2 className="mt-3 text-2xl font-bold text-ink">{featured.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{featured.excerpt}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-600">
                Read Full Article →
              </span>
            </div>
          </Link>

          <div className="space-y-6">
            <div className="rounded-2xl bg-brand-500 p-6 text-white">
              <p className="font-semibold">Join Our Newsletter</p>
              <p className="mt-2 text-sm text-white/80">
                Expert tips delivered straight to your inbox monthly.
              </p>
              <NewsletterForm />
            </div>
            <div className="rounded-2xl bg-sand p-6">
              <p className="font-semibold text-ink">📅 Upcoming Workshops</p>
              <p className="mt-2 text-sm text-muted">
                Check out our community sessions for prenatal care and
                postpartum recovery.
              </p>
              <Link href="/booking" className="mt-3 inline-block text-sm font-semibold text-brand-600">
                View Calendar →
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mt-16">
        <h2 className="text-xl font-bold text-ink">Recent Articles</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card overflow-hidden">
              <div className="relative aspect-[16/10]">
                {post.cover_image && (
                  <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {post.category}
                </p>
                <h3 className="mt-1 font-semibold text-ink">{post.title}</h3>
                <p className="mt-2 text-sm text-muted line-clamp-2">{post.excerpt}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-brand-600">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
