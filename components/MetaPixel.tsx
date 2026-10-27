"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { META_PIXEL_SCRIPT_URL, metaPixelId, startMetaPixel, trackPageView } from "@/lib/metaPixel";

// Loads the Meta Pixel on every page and sends a PageView when the shopper moves to another page.
// Renders nothing visible, and nothing at all while NEXT_PUBLIC_META_PIXEL_ID is unset.
export default function MetaPixel() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const enabled = metaPixelId() !== null;

  useEffect(() => {
    if (!enabled) return;
    // The first page's PageView goes out when the pixel starts
    if (lastPath.current === null) startMetaPixel();
    else if (lastPath.current !== pathname) trackPageView();
    lastPath.current = pathname;
  }, [enabled, pathname]);

  if (!enabled) return null;
  return <Script id="meta-pixel" src={META_PIXEL_SCRIPT_URL} strategy="afterInteractive" />;
}
