"use client";

import { useEffect, useRef } from "react";
import { trackPurchase, trackViewContent, type PurchaseInfo } from "@/lib/metaPixel";

// Small invisible helpers that a Server Component page drops in to send one pixel event when it opens

export function TrackViewContent({ productId, price }: { productId: string; price: number }) {
  // Keyed on the product: moving from one saree to another can reuse this component
  const sentFor = useRef<string | null>(null);
  useEffect(() => {
    if (sentFor.current === productId) return;
    sentFor.current = productId;
    trackViewContent({ _id: productId, price });
  }, [productId, price]);
  return null;
}

export function TrackPurchase({ order }: { order: PurchaseInfo }) {
  // trackPurchase also skips orders this browser already reported
  useEffect(() => {
    trackPurchase(order);
  }, [order]);
  return null;
}
