"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string; full_name: string; email: string; phone: string | null;
  service_type: string; preferred_date: string; reason: string | null;
  status: string; created_at: string;
};
type Note = { id: string; note: string | null; plan: string | null; created_at: string };

export default function SpecialistPortal({ fullName }: { fullName: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function load() {
    fetch("/api/specialist/bookings")
      .then((r) => r.json())
      .then((d) => {
        setBookings(d.bookings || []);
        setMessage(d.message || null);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/specialist/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.preferred_date >= today);
  const past = bookings.filter((b) => b.preferred_date < today);

  return (
    <div>
      <div>
        <p className="text-sm text-muted">Welcome back,</p>
        <h1 className="text-2xl font-bold text-ink">{fullName}</h1>
      </div>

      {message && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{message}</div>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-muted">Loading your schedule…</p>
      ) : (
        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-ink">Upcoming Appointments ({upcoming.length})</h2>
            <div className="mt-3 space-y-3">
              {upcoming.length === 0 && <p className="text-sm text-muted">No upcoming appointments assigned to you.</p>}
              {upcoming.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  expanded={expandedId === b.id}
                  onToggle={() => setExpandedId(expandedId === b.id ? null : b.id)}
                  onStatusChange={(status) => updateStatus(b.id, status)}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink">Past Appointments ({past.length})</h2>
            <div className="mt-3 space-y-3">
              {past.length === 0 && <p className="text-sm text-muted">No past appointments yet.</p>}
              {past.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  expanded={expandedId === b.id}
                  onToggle={() => setExpandedId(expandedId === b.id ? null : b.id)}
                  onStatusChange={(status) => updateStatus(b.id, status)}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function BookingRow({
  booking, expanded, onToggle, onStatusChange,
}: {
  booking: Booking; expanded: boolean; onToggle: () => void; onStatusChange: (status: string) => void;
}) {
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{booking.full_name} — {booking.service_type}</p>
          <p className="text-sm text-muted">
            {booking.preferred_date} · {booking.email}{booking.phone ? ` · ${booking.phone}` : ""}
          </p>
          {booking.reason && <p className="mt-1 text-sm text-muted">&ldquo;{booking.reason}&rdquo;</p>}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={booking.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium"
          >
            <option value="requested">Requested</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button onClick={onToggle} className="text-sm font-medium text-brand-600 hover:underline">
            {expanded ? "Hide notes" : "Notes & plan"}
          </button>
        </div>
      </div>
      {expanded && <NotesPanel bookingId={booking.id} />}
    </div>
  );
}

function NotesPanel({ bookingId }: { bookingId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState("");
  const [plan, setPlan] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);

  function loadNotes() {
    fetch(`/api/specialist/notes?bookingId=${bookingId}`)
      .then((r) => r.json())
      .then((d) => {
        setNotes(d.notes || []);
        setLoadingNotes(false);
      });
  }

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  async function handleSave() {
    if (!note && !plan) return;
    setSaving(true);
    await fetch("/api/specialist/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, note, plan }),
    });
    setNote("");
    setPlan("");
    setSaving(false);
    loadNotes();
  }

  return (
    <div className="mt-4 border-t border-black/5 pt-4">
      {loadingNotes ? (
        <p className="text-xs text-muted">Loading notes…</p>
      ) : (
        <div className="space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="rounded-lg bg-sand p-3 text-sm">
              <p className="text-xs text-muted">{new Date(n.created_at).toLocaleString()}</p>
              {n.note && <p className="mt-1 text-ink">{n.note}</p>}
              {n.plan && <p className="mt-1 text-brand-700"><span className="font-medium">Plan: </span>{n.plan}</p>}
            </div>
          ))}
          {notes.length === 0 && <p className="text-xs text-muted">No notes yet for this appointment.</p>}
        </div>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Clinical note (visible to patient)"
          rows={2}
          className="input resize-none text-sm"
        />
        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="Plan for next session / home exercises"
          rows={2}
          className="input resize-none text-sm"
        />
      </div>
      <button onClick={handleSave} disabled={saving} className="btn-primary mt-2 !py-2 text-sm">
        {saving ? "Saving…" : "Save Note"}
      </button>
    </div>
  );
}
