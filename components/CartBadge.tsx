"use client";

import { useState, useSyncExternalStore } from "react";
import { useCartStore, cartCount, cartTotal } from "@/lib/cartStore";
import { formatPrice } from "@/lib/utils";
import CartDrawer from "./CartDrawer";

const subscribeNoop = () => () => {};

export default function CartBadge({ showTotal = true }: { showTotal?: boolean }) {
  const items = useCartStore((state) => state.items);
  // The cart lives in localStorage, so the server always renders an empty
  // cart. Only show the count once hydrated to avoid a hydration mismatch.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const count = mounted ? cartCount(items) : 0;
  const total = mounted ? cartTotal(items) : 0;

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        aria-label={`Open cart, ${count} items`}
        className="flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-brand"
      >
        {showTotal && <span>{formatPrice(total)}</span>}
        <span className="flex h-7 min-w-7 items-center justify-center rounded-sm border border-highlight px-1.5 text-xs font-semibold text-highlight">
          {count}
        </span>
      </button>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
