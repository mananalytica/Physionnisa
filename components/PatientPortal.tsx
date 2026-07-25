"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Booking = {
  id: string; service_type: string; preferred_date: string; status: string;
  specialist_name: string | null; reason: string | null; created_at: string;
};
type Order = {
  id: string; total_pkr: number; status: string; created_at: string;
};
type Note = {
  id: string; note: string | null; plan: string | null; specialist_name: string | null; created_at: string;
};

function formatPKR(v: number) {
  return `Rs ${Number(v).toLocaleString("en-PK")}`;
}

export default function PatientPortal({ fullName }: { fullName: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/patient/bookings").then((r) => r.json()),
      fetch("/api/patient/orders").then((r) => r.json()),
      fetch("/api/patient/notes").then((r) => r.json()),
    ]).then(([b, o, n]) => {
      setBookings(b.bookings || []);
      setOrders(o.orders || []);
      setNotes(n.notes || []);
      setLoading(false);
    });
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.preferred_date >= today);
  const past = bookings.filter((b) => b.preferred_date < today);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Welcome back,</p>
          <h1 className="text-2xl font-bold text-ink">{fullName}</h1>
        </div>
        <Link href="/booking" className="btn-primary">
          Book a New Visit
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted">Loading your history…</p>
      ) : (
        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-ink">Upcoming Appointments</h2>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                No upcoming appointments. <Link href="/booking" className="text-brand-600 font-medium">Plan one now</Link>.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {upcoming.map((b) => (
                  <div key={b.id} className="card flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <p className="font-medium text-ink">{b.service_type}</p>
                      <p className="text-sm text-muted">
                        {b.preferred_date}{b.specialist_name ? ` · with ${b.specialist_name}` : ""}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink">Care Notes &amp; Plans</h2>
            {notes.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Your specialist hasn&apos;t added any notes yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {notes.map((n) => (
                  <div key={n.id} className="card p-5">
                    <p className="text-xs text-muted">
                      {new Date(n.created_at).toLocaleDateString()} {n.specialist_name ? `· ${n.specialist_name}` : ""}
                    </p>
                    {n.note && <p className="mt-2 text-sm text-ink">{n.note}</p>}
                    {n.plan && (
                      <p className="mt-2 text-sm text-brand-700">
                        <span className="font-medium">Plan: </span>{n.plan}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink">Past Appointments</h2>
            {past.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No past appointments yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {past.map((b) => (
                  <div key={b.id} className="card flex flex-wrap items-center justify-between gap-3 p-5 opacity-80">
                    <div>
                      <p className="font-medium text-ink">{b.service_type}</p>
                      <p className="text-sm text-muted">
                        {b.preferred_date}{b.specialist_name ? ` · with ${b.specialist_name}` : ""}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink">Order History</h2>
            {orders.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No orders yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="card flex items-center justify-between p-5">
                    <div>
                      <p className="font-medium text-ink">Order #{o.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted">{new Date(o.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="font-semibold text-ink">{formatPKR(o.total_pkr)}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    requested: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status] || "bg-sand text-muted"}`}>
      {status}
    </span>
  );
}
