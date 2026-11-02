"use client";

import { useState } from "react";
import { MAX_ITEM_QUANTITY, useCartStore } from "@/lib/cartStore";

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
  // Out of stock but taking pre-orders: no stock limit, and the button says so
  preorder?: boolean;
}

export default function AddToCartButton({ product, inStock, maxQuantity, preorder = false }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [chosenQuantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const limit = preorder ? MAX_ITEM_QUANTITY : Math.max(1, Math.min(maxQuantity, MAX_ITEM_QUANTITY));
  // The limit can drop after the shopper has chosen, when the live stock arrives
  const quantity = Math.min(chosenQuantity, limit);

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
      <div className="flex h-13 items-center border border-zinc-300 bg-white">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
          onClick={() => setQuantity(Math.min(limit, quantity + 1))}
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
        aria-live="polite"
        className="btn btn-primary h-13 flex-1 text-base"
      >
        {!inStock ? "Out of stock" : added ? "Added ✓" : preorder ? "Pre-order" : "Add to cart"}
      </button>
    </div>
  );
}
