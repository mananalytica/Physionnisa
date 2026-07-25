import { NextResponse } from "next/server";
import { getProducts } from "@/lib/queries";

export const runtime = "nodejs";
export const revalidate = 3600; // regenerate at most once an hour

/**
 * Google Merchant Center product feed.
 * Register this URL (https://yourdomain.com/api/feed/google-shopping) as a
 * "Scheduled fetch" feed in Merchant Center → Products → Feeds.
 * Spec: https://support.google.com/merchants/answer/7052112
 */

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const products = await getProducts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://physionnisa.com";

  const items = products
    .map((p) => {
      const link = `${siteUrl}/shop/${p.slug}`;
      const availability = p.availability_gs || "in stock";
      const condition = p.condition_gs || "new";
      const currency = p.currency || "PKR";
      const hasIdentifier = Boolean(p.gtin || p.mpn) && p.identifier_exists !== false;

      return `  <item>
    <g:id>${escapeXml(p.id)}</g:id>
    <title>${escapeXml(p.name)}</title>
    <description>${escapeXml(p.long_desc || p.short_desc || p.name)}</description>
    <link>${escapeXml(link)}</link>
    ${p.image_url ? `<g:image_link>${escapeXml(p.image_url)}</g:image_link>` : ""}
    <g:availability>${escapeXml(availability)}</g:availability>
    <g:price>${p.price_pkr.toFixed(2)} ${escapeXml(currency)}</g:price>
    ${
      p.compare_at_pkr && p.compare_at_pkr > p.price_pkr
        ? `<g:sale_price>${p.price_pkr.toFixed(2)} ${escapeXml(currency)}</g:sale_price>`
        : ""
    }
    <g:brand>${escapeXml(p.brand || "Physionnisa")}</g:brand>
    ${p.gtin ? `<g:gtin>${escapeXml(p.gtin)}</g:gtin>` : ""}
    ${p.mpn ? `<g:mpn>${escapeXml(p.mpn)}</g:mpn>` : ""}
    ${!hasIdentifier ? `<g:identifier_exists>false</g:identifier_exists>` : ""}
    <g:condition>${escapeXml(condition)}</g:condition>
    ${
      p.google_product_category
        ? `<g:google_product_category>${escapeXml(p.google_product_category)}</g:google_product_category>`
        : ""
    }
    ${p.product_type ? `<g:product_type>${escapeXml(p.product_type)}</g:product_type>` : ""}
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
  <title>Physionnisa Shop</title>
  <link>${escapeXml(siteUrl)}/shop</link>
  <description>Clinical-grade physiotherapy equipment for women, from Physionnisa.</description>
${items}
</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
