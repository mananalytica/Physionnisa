"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/dataLayer";

function formatPKR(value: number) {
  return `Rs ${value.toLocaleString("en-PK")}`;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/30 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold text-ink">Your Cart</h2>
          <button
            aria-label="Close cart"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-ink/70">Your cart is currently empty.</p>
            <Link href="/shop" onClick={closeCart} className="text-sm font-medium text-brand-600 underline">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-4 py-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-medium text-ink">{item.name}</p>
                      <p className="text-sm text-muted">{formatPKR(item.price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-line px-2 py-1">
                          <button
                            className="px-1 text-sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm">{item.quantity}</span>
                          <button
                            className="px-1 text-sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-xs font-medium text-muted hover:text-red-600"
                          onClick={() => removeItem(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-base font-semibold text-ink">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                className="btn-primary w-full"
                onClick={() => {
                  track("begin_checkout", { subtotal, item_count: items.length });
                  closeCart();
                }}
              >
                Proceed to Checkout
              </Link>
              <p className="mt-2 text-center text-xs text-muted">
                Taxes &amp; service fees calculated at checkout.
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
