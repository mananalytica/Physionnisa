"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/dataLayer";
import { CHECKOUT_TAX_RATE } from "@/lib/data";
import { validateEmail, validatePhone, validateAddress, formatAddress } from "@/lib/addressValidator";

function formatPKR(v: number) {
  return `Rs ${v.toLocaleString("en-PK")}`;
}

type Errors = Record<string, string>;

export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [country, setCountry] = useState("Pakistan");

  const tax = Math.round(subtotal * CHECKOUT_TAX_RATE);
  const total = subtotal + tax;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const fields = {
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      addressLine1: String(form.get("addressLine1") || ""),
      addressLine2: String(form.get("addressLine2") || ""),
      city: String(form.get("city") || ""),
      postalCode: String(form.get("postalCode") || ""),
      country,
    };

    const fieldErrors: Errors = { ...validateAddress(fields) };
    const emailErr = validateEmail(fields.email);
    if (emailErr) fieldErrors.email = emailErr;
    const phoneErr = validatePhone(fields.phone, country);
    if (phoneErr) fieldErrors.phone = phoneErr;
    if (!fields.fullName.trim()) fieldErrors.fullName = "Full name is required.";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    setStatus("submitting");

    const payload = {
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      tax,
      total,
      fullName: fields.fullName,
      email: fields.email,
      phone: fields.phone,
      addressLine1: fields.addressLine1,
      addressLine2: fields.addressLine2,
      city: fields.city,
      postalCode: fields.postalCode,
      country: fields.country,
      shippingAddress: formatAddress(fields),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      const { orderId, stored } = await res.json();
      if (!stored) {
        console.warn(
          "Order was accepted but NOT written to MotherDuck — check /api/health for config diagnostics."
        );
      }

      track("purchase", {
        transaction_id: orderId,
        value: total,
        tax,
        items: payload.items.map((i) => ({
          item_id: i.productId,
          item_name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      });

      clearCart();
      router.push(`/checkout/thank-you?order=${orderId}`);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("We couldn't place your order. Please try again.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-lg font-semibold text-ink">Your cart is empty</p>
        <p className="mt-2 text-sm text-muted">Add a product from the shop to check out.</p>
        <a href="/shop" className="btn-primary mt-4 inline-flex">
          Go to Shop
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit} noValidate className="card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Contact Details</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" className={`input ${errors.fullName ? "input-error" : ""}`} placeholder="Sana Malik" />
            {errors.fullName && <p className="field-error">{errors.fullName}</p>}
          </div>
          <div>
            <label className="label" htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" className={`input ${errors.email ? "input-error" : ""}`} placeholder="sana@example.com" />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" className={`input ${errors.phone ? "input-error" : ""}`} placeholder="+92 300 1234567" />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted">Shipping Address</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="addressLine1">House / Building &amp; Street</label>
            <input
              id="addressLine1" name="addressLine1" className={`input ${errors.addressLine1 ? "input-error" : ""}`}
              placeholder="House 12-C, Street 4"
            />
            {errors.addressLine1 && <p className="field-error">{errors.addressLine1}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="addressLine2">Area / Block / Landmark (optional)</label>
            <input id="addressLine2" name="addressLine2" className="input" placeholder="Block C, Gulberg III" />
          </div>
          <div>
            <label className="label" htmlFor="city">City</label>
            <input
              id="city" name="city" className={`input ${errors.city ? "input-error" : ""}`}
              placeholder="Lahore" defaultValue="Lahore"
            />
            {errors.city && <p className="field-error">{errors.city}</p>}
          </div>
          <div>
            <label className="label" htmlFor="postalCode">Postal Code</label>
            <input
              id="postalCode" name="postalCode" className={`input ${errors.postalCode ? "input-error" : ""}`}
              placeholder="54000"
            />
            {errors.postalCode && <p className="field-error">{errors.postalCode}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="country">Country</label>
            <select
              id="country" name="country" className="input"
              value={country} onChange={(e) => setCountry(e.target.value)}
            >
              <option value="Pakistan">Pakistan</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={status === "submitting"} className="btn-primary mt-6 w-full">
          {status === "submitting" ? "Placing Order…" : `Place Order — ${formatPKR(total)}`}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          This is a demo checkout — no live payment gateway is connected yet.
        </p>
      </form>

      <div className="card h-fit p-6">
        <h3 className="font-semibold text-ink">Order Summary</h3>
        <ul className="mt-4 divide-y divide-line">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-3 py-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex flex-1 items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-muted">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-ink">{formatPKR(item.price * item.quantity)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Taxes &amp; Service Fees</span>
            <span>{formatPKR(tax)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-bold text-ink">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
