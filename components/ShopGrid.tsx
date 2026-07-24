"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { track } from "@/lib/dataLayer";
import type { Product } from "@/lib/types";

export default function ShopGrid({ products }: { products: Product[] }) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );
  const [active, setActive] = useState<string>("All Products");

  const filtered =
    active === "All Products" ? products : products.filter((p) => p.category === active);

  useEffect(() => {
    track("view_item_list", {
      list_name: active,
      item_ids: filtered.map((p) => p.id),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-6">
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Categories</p>
          <div className="space-y-2 text-sm">
            {["All Products", ...categories].map((c) => (
              <label key={c} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  checked={active === c}
                  onChange={() => setActive(c)}
                  className="accent-brand-500"
                />
                <span className={active === c ? "text-ink" : "text-muted"}>{c}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-sand p-4 text-sm text-muted">
          Need help? Our clinicians can help you find the right equipment for
          your condition.{" "}
          <a href="/booking" className="font-semibold text-brand-600">
            Book a Consultation
          </a>
        </div>
      </aside>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-16 text-center text-muted">
            No products in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
