"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, cartTotal } from "@/lib/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Your cart is empty
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Browse our collection and find something you love.
        </p>
        <Link
          href="/"
          className="rounded-full bg-rose-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-800"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <h1 className="py-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ul className="flex flex-col divide-y divide-zinc-200 lg:col-span-2 dark:divide-zinc-800">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-4">
              <Link
                href={`/products/${item.slug}`}
                className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-zinc-400">
                    No image
                  </span>
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium text-zinc-900 hover:text-rose-700 dark:text-zinc-50 dark:hover:text-rose-400"
                  >
                    {item.name}
                  </Link>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatPrice(item.price)} each
                </p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium text-zinc-900 dark:text-zinc-50">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-zinc-500 underline-offset-2 transition-colors hover:text-red-600 hover:underline dark:text-zinc-400 dark:hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Summary
          </h2>
          <div className="mt-4 flex justify-between text-zinc-600 dark:text-zinc-300">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(cartTotal(items))}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>

          <button
            type="button"
            disabled
            className="mt-6 w-full rounded-full bg-zinc-300 py-3 font-semibold text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
            title="Coming in the next task"
          >
            Proceed to Checkout
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="mt-4 w-full text-sm text-zinc-500 underline-offset-2 transition-colors hover:text-red-600 hover:underline dark:text-zinc-400"
          >
            Clear cart
          </button>
        </aside>
      </div>
    </main>
  );
}
