import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/queries";
import type { Metadata } from "next";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  return { title: post ? `${post.title} — Physionnisa` : "Article — Physionnisa" };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="container-page max-w-3xl py-14">
      <Link href="/blog" className="text-sm font-medium text-brand-600">
        ← Back to Physio Insights
      </Link>

      <div className="mt-4 flex items-center gap-3 text-xs text-muted">
        <span className="rounded-full bg-brand-500 px-2.5 py-1 font-semibold text-white">
          {post.category}
        </span>
        {post.published_at && <span>{post.published_at}</span>}
        {post.author && <span>· {post.author}</span>}
      </div>

      <h1 className="mt-4 text-3xl font-bold text-ink md:text-4xl">{post.title}</h1>

      {post.cover_image && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={post.cover_image} alt={post.title} fill priority className="object-cover" />
        </div>
      )}

      <div className="prose prose-neutral mt-8 max-w-none text-[15px] leading-relaxed text-ink/80">
        <p>{post.excerpt}</p>
        <p className="mt-4">{post.body}</p>
      </div>

      <div className="mt-12 rounded-2xl bg-sand p-8 text-center">
        <p className="font-semibold text-ink">Ready to take the next step?</p>
        <p className="mt-1 text-sm text-muted">
          Book a consultation with our clinical team.
        </p>
        <Link href="/booking" className="btn-primary mt-4">
          Book Now
        </Link>
      </div>
    </article>
  );
}
