"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/dataLayer";

function formatPKR(v: number) {
  return `Rs ${v.toLocaleString("en-PK")}`;
}

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking");
  const { items, subtotal, clearCart } = useCart();
  const [orderTotal, setOrderTotal] = useState<{ tax: number; total: number } | null>(null);
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;

    const tax = Math.round(subtotal * 0.086); // service & tax rate — adjust to your local rate
    const total = subtotal + tax;
    setOrderTotal({ tax, total });

    if (items.length > 0) {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal,
          tax,
          total,
        }),
      }).catch(() => {});
    }

    track("purchase", {
      transaction_id: bookingId || `order_${Date.now()}`,
      value: total,
      tax,
      items: items.map((i) => ({ item_id: i.productId, item_name: i.name, price: i.price, quantity: i.quantity })),
    });

    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tax = orderTotal?.tax ?? 0;
  const total = orderTotal?.total ?? subtotal;

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl text-brand-500">
          ✓
        </div>
        <h1 className="mt-6 text-4xl font-bold text-ink">Thank You for Your Trust</h1>
        <p className="mt-4 text-[15px] text-muted">
          Your booking{items.length > 0 ? " and order have" : " has"} been
          successfully processed. We&apos;re looking forward to helping you
          achieve your physical wellness goals.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card p-6 md:p-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
            📋 Order Details
          </h2>

          {bookingId && (
            <div className="mt-5 flex items-center justify-between border-b border-black/5 pb-4">
              <div>
                <p className="text-sm font-medium text-brand-600">Appointment Booked</p>
                <p className="text-xs text-muted">Confirmation #{bookingId.slice(0, 8)}</p>
              </div>
            </div>
          )}

          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between border-b border-black/5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-sand">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-muted">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-ink">
                {formatPKR(item.price * item.quantity)}
              </p>
            </div>
          ))}

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Taxes &amp; Service Fees</span>
              <span>{formatPKR(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-black/5 pt-3 text-base font-bold text-ink">
              <span>Total Amount Paid</span>
              <span>{formatPKR(total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-brand-500 p-6 text-white">
            <p className="font-semibold">Visit Preparation</p>
            <p className="mt-2 text-sm text-white/85">
              Please arrive 10 minutes early to complete your intake form if
              you haven&apos;t done so online.
            </p>
            <p className="mt-4 text-sm text-white/85">
              📍 120 Wellness Way, Suite 400<br />Central Medical District
            </p>
            <button className="btn-outline-light mt-4 w-full">Add to Calendar</button>
          </div>
          <div className="card p-5 text-sm">
            <p className="font-semibold text-ink">Questions?</p>
            <p className="mt-2 text-muted">
              Our clinical coordinators are available to assist you.
            </p>
            <p className="mt-3 text-muted">☎ (555) 012-3456</p>
            <p className="text-muted">✉ care@physionnisa.com</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          🏠 Back to Home
        </Link>
        <button className="btn-secondary" onClick={() => window.print()}>
          ⬇ Download Invoice
        </button>
      </div>
    </div>
  );
}
