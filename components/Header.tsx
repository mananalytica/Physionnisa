"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/dataLayer";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/booking", label: "Booking" },
  { href: "/specialists", label: "Specialists" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-brand-500"
          onClick={() => track("cta_click", { label: "logo" })}
        >
          Physionnisa
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[15px] font-medium transition-colors ${
                  active ? "text-brand-600" : "text-ink/70 hover:text-brand-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label={`Open cart, ${itemCount} items`}
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition hover:bg-black/5"
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>
          <Link
            href="/account"
            aria-label="Account, login, or sign up"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 transition hover:bg-black/5 sm:flex"
          >
            <UserIcon />
          </Link>
          <Link
            href="/booking"
            className="btn-primary hidden sm:inline-flex"
            onClick={() => track("cta_click", { label: "book_now_header" })}
          >
            Book Now
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-black/5 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/5 bg-cream md:hidden">
          <nav className="container-page flex flex-col gap-4 py-5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium text-ink/80"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/booking" className="btn-primary w-full" onClick={() => setMobileOpen(false)}>
              Book Now
            </Link>
            <Link href="/account" className="text-base font-medium text-ink/80" onClick={() => setMobileOpen(false)}>
              My Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6 5 2H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}
