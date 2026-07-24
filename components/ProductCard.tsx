"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/dataLayer";
import type { Product } from "@/lib/types";

function formatPKR(value: number) {
  return `Rs ${value.toLocaleString("en-PK")}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:shadow-soft">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-sand"
        onClick={() =>
          track("select_item", { item_id: product.id, item_name: product.name })
        }
      >
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand-600 shadow-sm">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          {product.category}
        </p>
        <Link href={`/shop/${product.slug}`} className="mt-1 text-[15px] font-semibold text-ink hover:text-brand-600">
          {product.name}
        </Link>
        {product.short_desc && (
          <p className="mt-1 text-sm text-muted line-clamp-2">{product.short_desc}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-bold text-ink">
            {formatPKR(product.price_pkr)}
          </span>
          <button
            className="btn-primary !px-4 !py-2 text-xs"
            onClick={() => addItem(product, 1)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
