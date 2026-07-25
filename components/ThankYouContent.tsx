"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function formatPKR(v: number) {
  return `Rs ${Number(v).toLocaleString("en-PK")}`;
}

type OrderData = {
  order: {
    id: string;
    subtotal_pkr: number;
    tax_pkr: number;
    total_pkr: number;
  } | null;
  items: { product_id: string; product_name: string; unit_price_pkr: number; quantity: number }[];
  configured: boolean;
};

type BookingData = {
  booking: {
    id: string;
    service_type: string;
    preferred_date: string;
    full_name: string;
  } | null;
  configured: boolean;
};

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const bookingId = searchParams.get("booking");

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [orderRes, bookingRes] = await Promise.all([
        orderId ? fetch(`/api/orders/${orderId}`).then((r) => r.json()) : Promise.resolve(null),
        bookingId ? fetch(`/api/bookings/${bookingId}`).then((r) => r.json()) : Promise.resolve(null),
      ]);
      if (!cancelled) {
        setOrderData(orderRes);
        setBookingData(bookingRes);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [orderId, bookingId]);

  const hasOrder = Boolean(orderId);
  const hasBooking = Boolean(bookingId);

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl text-brand-500">
          ✓
        </div>
        <h1 className="mt-6 text-4xl font-bold text-ink">Thank You for Your Trust</h1>
        <p className="mt-4 text-[15px] text-muted">
          {hasOrder && hasBooking
            ? "Your booking and order have both been received."
            : hasOrder
              ? "Your order has been received."
              : "Your appointment request has been received."}{" "}
          We&apos;re looking forward to helping you achieve your physical wellness goals.
        </p>
      </div>

      {loading ? (
        <p className="mt-12 text-center text-muted">Loading your confirmation…</p>
      ) : (
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="card p-6 md:p-8">
            {hasBooking && (
              <div className="mb-6 border-b border-black/5 pb-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">📅 Appointment</h2>
                {bookingData?.booking ? (
                  <div className="mt-3 text-sm text-muted">
                    <p className="font-medium text-ink">{bookingData.booking.service_type}</p>
                    <p>Preferred date: {bookingData.booking.preferred_date}</p>
                    <p className="mt-1 text-xs">Confirmation #{bookingData.booking.id.slice(0, 8)}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">
                    Confirmation #{bookingId?.slice(0, 8)} — we&apos;ll email you shortly with details.
                  </p>
                )}
              </div>
            )}

            {hasOrder && (
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">📋 Order Details</h2>
                {orderData?.order ? (
                  <>
                    {orderData.items.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex items-center justify-between border-b border-black/5 py-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-ink">{item.product_name}</p>
                          <p className="text-xs text-muted">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-ink">
                          {formatPKR(item.unit_price_pkr * item.quantity)}
                        </p>
                      </div>
                    ))}
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-muted">
                        <span>Subtotal</span>
                        <span>{formatPKR(orderData.order.subtotal_pkr)}</span>
                      </div>
                      <div className="flex justify-between text-muted">
                        <span>Taxes &amp; Service Fees</span>
                        <span>{formatPKR(orderData.order.tax_pkr)}</span>
                      </div>
                      <div className="flex justify-between border-t border-black/5 pt-3 text-base font-bold text-ink">
                        <span>Total Amount Paid</span>
                        <span>{formatPKR(orderData.order.total_pkr)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-muted">
                    Confirmation #{orderId?.slice(0, 8)} — we&apos;ll email your receipt shortly.
                  </p>
                )}
              </div>
            )}
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
      )}

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
