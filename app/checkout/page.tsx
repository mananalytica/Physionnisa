import CheckoutForm from "@/components/CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout — Physionnisa" };

export default function CheckoutPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-bold text-ink">Checkout</h1>
        <p className="mt-3 text-[15px] text-muted">
          Complete your order below. Prefer to combine this with an
          appointment? You can still{" "}
          <a href="/booking" className="font-semibold text-brand-600">
            book a session
          </a>{" "}
          separately.
        </p>
      </div>
      <div className="mt-12">
        <CheckoutForm />
      </div>
    </div>
  );
}
