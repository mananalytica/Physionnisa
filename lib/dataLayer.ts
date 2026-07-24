"use client";

/**
 * A minimal, dependency-free dataLayer.
 *
 * No GTM/GA4 container or script tag is ever loaded — this simply pushes
 * structured events onto `window.dataLayer`, the same array shape GTM
 * expects, so you can:
 *   1. Inspect events live in the browser console (`window.dataLayer`)
 *   2. Wire up your own listener later (Segment, a GTM container, a
 *      server-side collector, MotherDuck via /api/events, etc.) without
 *      touching any page code — just read from this one array.
 *
 * Every event automatically gets: event name, ISO timestamp, and page path.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export type DataLayerEvent =
  | "page_view"
  | "view_item_list"
  | "view_item"
  | "select_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "purchase"
  | "book_appointment_start"
  | "book_appointment_request"
  | "contact_form_submit"
  | "newsletter_signup"
  | "cta_click";

export function track(
  event: DataLayerEvent,
  payload: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...payload,
    page_path: window.location.pathname,
    timestamp: new Date().toISOString(),
  });

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[dataLayer]", event, payload);
  }
}

/** Optional: also persist the event to MotherDuck via the analytics_events table. */
export function trackAndPersist(
  event: DataLayerEvent,
  payload: Record<string, unknown> = {}
) {
  track(event, payload);
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, payload, page_path: window.location.pathname }),
    keepalive: true,
  }).catch(() => {
    /* analytics must never break the UI */
  });
}
