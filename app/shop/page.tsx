import ShopGrid from "@/components/ShopGrid";
import { getProducts } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop — Physionnisa" };
export const revalidate = 60;

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-bold text-ink">Clinical Grade Equipment</h1>
        <p className="mt-3 text-[15px] text-muted">
          Elevate your recovery journey with professional physiotherapy tools
          curated by our specialists for at-home care.
        </p>
      </div>
      <div className="mt-12">
        <ShopGrid products={products} />
      </div>
    </div>
  );
}
