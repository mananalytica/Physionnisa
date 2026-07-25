import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductBuyBox from "@/components/ProductBuyBox";
import { getProductBySlug } from "@/lib/queries";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return { title: product ? `${product.name} — Physionnisa` : "Product — Physionnisa" };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://physionnisa.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.long_desc || product.short_desc || product.name,
    image: product.image_url ? [product.image_url] : undefined,
    sku: product.id,
    mpn: product.mpn || undefined,
    gtin: product.gtin || undefined,
    brand: { "@type": "Brand", name: product.brand || "Physionnisa" },
    aggregateRating: product.review_count
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.review_count,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/shop/${product.slug}`,
      priceCurrency: product.currency || "PKR",
      price: product.price_pkr,
      itemCondition: `https://schema.org/${
        (product.condition_gs || "new") === "new" ? "NewCondition" : "UsedCondition"
      }`,
      availability: `https://schema.org/${
        (product.availability_gs || "in stock") === "in stock" ? "InStock" : "OutOfStock"
      }`,
    },
  };

  return (
    <div className="container-page py-10">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-8 text-sm text-muted">
        <Link href="/shop" className="hover:text-brand-600">
          Shop
        </Link>{" "}
        &gt; <span className="text-ink">{product.category}</span> &gt;{" "}
        <span className="text-brand-600">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          )}
        </div>

        <ProductBuyBox product={product} />
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-ink">Clinical Excellence in Every Detail</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          Every product in our shop is vetted by our physiotherapy team before
          it reaches your home — built for real rehab outcomes, not just
          wellness trends.
        </p>
      </div>
    </div>
  );
}
