"use client";

import { useEffect, useState } from "react";
import { useCartStore, cartCount, cartTotal } from "@/lib/cartStore";
import { formatPrice } from "@/lib/utils";
import CartDrawer from "./CartDrawer";

export default function CartBadge({ showTotal = true }: { showTotal?: boolean }) {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <span className="flex h-7 min-w-7 items-center justify-center rounded border border-gold px-1.5 text-xs font-semibold text-gold">
          {count}
        </span>
      </button>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
