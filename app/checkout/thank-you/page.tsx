import { Suspense } from "react";
import ThankYouContent from "@/components/ThankYouContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Thank You — Physionnisa" };

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="container-page py-24 text-center text-muted">Loading…</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
