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
  maxQuantity: number;
}

export default function AddToCartButton({ product, inStock, maxQuantity }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const limit = Math.max(1, Math.min(maxQuantity, 99));

  function handleAdd() {
    addItem(
      {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex items-stretch gap-3">
      <div className="flex h-[52px] items-center border border-zinc-300 bg-white">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={!inStock || quantity <= 1}
          aria-label="Decrease quantity"
          className="h-full w-10 text-lg text-zinc-600 hover:text-brand disabled:text-zinc-300"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(limit, q + 1))}
          disabled={!inStock || quantity >= limit}
          aria-label="Increase quantity"
          className="h-full w-10 text-lg text-zinc-600 hover:text-brand disabled:text-zinc-300"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!inStock}
        className="h-[52px] flex-1 rounded bg-gold text-base font-bold text-white transition-colors hover:bg-gold/85 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {!inStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  );
}
