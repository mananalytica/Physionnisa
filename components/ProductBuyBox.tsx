"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/dataLayer";
import type { Product } from "@/lib/types";

function formatPKR(v: number) {
  return `Rs ${v.toLocaleString("en-PK")}`;
}

export default function ProductBuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();

  useEffect(() => {
    track("view_item", {
      item_id: product.id,
      item_name: product.name,
      price: product.price_pkr,
      category: product.category,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const savingsPct =
    product.compare_at_pkr && product.compare_at_pkr > product.price_pkr
      ? Math.round(
          ((product.compare_at_pkr - product.price_pkr) / product.compare_at_pkr) * 100
        )
      : null;

  return (
    <div>
      {product.badge && <span className="eyebrow">{product.badge}</span>}
      <h1 className="mt-4 text-3xl font-bold text-ink">{product.name}</h1>
      <div className="mt-2 flex items-center gap-1 text-sm text-brand-600">
        {"★".repeat(Math.round(product.rating))}
        {"☆".repeat(5 - Math.round(product.rating))}
        <span className="ml-1 text-muted">({product.review_count} Reviews)</span>
      </div>
      {product.long_desc && (
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
          {product.long_desc}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-sand p-5">
        <div>
          <p className="text-xs text-muted">Total Investment</p>
          <p className="text-2xl font-bold text-ink">{formatPKR(product.price_pkr)}</p>
        </div>
        {savingsPct && (
          <div className="text-right">
            <p className="text-sm text-muted line-through">
              {formatPKR(product.compare_at_pkr!)}
            </p>
            <p className="text-sm font-semibold text-brand-600">Save {savingsPct}% Today</p>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <button className="btn-primary w-full" onClick={() => addItem(product, 1)}>
          🛍 Add to Cart
        </button>
        <Link href="/booking" className="btn-secondary w-full">
          📅 Book Training Session
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-muted">
        <div className="rounded-xl border border-black/10 px-4 py-3">🚚 Free Delivery in Pakistan</div>
        <div className="rounded-xl border border-black/10 px-4 py-3">🛡 1 Year Medical Warranty</div>
      </div>
    </div>
  );
}
