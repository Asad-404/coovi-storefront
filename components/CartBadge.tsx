"use client";

import { useEffect, useState } from "react";
import { useCartStore, cartCount } from "@/lib/cartStore";
import CartDrawer from "./CartDrawer";

export default function CartBadge() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = cartCount(items);

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="relative rounded-full bg-rose-700 px-4 py-2 text-white transition-colors hover:bg-rose-800"
      >
        Cart
        {mounted && count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-xs font-bold text-white ring-2 ring-white dark:bg-white dark:text-zinc-900 dark:ring-zinc-950">
            {count}
          </span>
        )}
      </button>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
