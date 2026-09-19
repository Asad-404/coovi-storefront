"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";

interface AddToCartButtonProps {
  product: {
    _id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
  };
  inStock: boolean;
}

export default function AddToCartButton({ product, inStock }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!inStock}
      className="mt-4 h-12 rounded-full bg-rose-700 px-8 text-base font-semibold text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
    >
      {!inStock ? "Out of Stock" : added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
