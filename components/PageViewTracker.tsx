"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/dataLayer";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    track("page_view", {
      path: pathname,
      title: typeof document !== "undefined" ? document.title : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
