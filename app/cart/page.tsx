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
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center sm:px-6">
        <svg viewBox="0 0 64 64" className="h-32 w-32 text-zinc-200" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 14h8l5 28h28l6-20H17" />
          <circle cx="24" cy="52" r="3.5" />
          <circle cx="44" cy="52" r="3.5" />
          <path d="M26 4l2 6M36 3v7M46 4l-2 6" />
        </svg>
        <h1 className="text-3xl text-ink sm:text-4xl">Your cart is currently empty.</h1>
        <Link
          href="/shop"
          className="rounded bg-highlight px-8 py-3.5 font-bold text-white transition-colors hover:bg-highlight/85"
        >
          Return to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <h1 className="py-8 text-3xl text-zinc-900">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ul className="flex flex-col divide-y divide-zinc-200 lg:col-span-2">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-4">
              <Link
                href={`/products/${item.slug}`}
                className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100"
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
                    className="font-medium text-zinc-900 hover:text-brand"
                  >
                    {item.name}
                  </Link>
                  <span className="font-semibold text-zinc-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">
                  {formatPrice(item.price)} each
                </p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:bg-zinc-100"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium text-zinc-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:bg-zinc-100"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-zinc-500 underline-offset-2 transition-colors hover:text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-zinc-200 p-6">
          <h2 className="text-lg text-zinc-900">
            Summary
          </h2>
          <div className="mt-4 flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span className="font-medium">{formatPrice(cartTotal(items))}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-zinc-500">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block w-full rounded bg-highlight py-3.5 text-center font-bold text-white transition-colors hover:bg-highlight/85"
          >
            Proceed to Checkout
          </Link>

          <button
            type="button"
            onClick={clearCart}
            className="mt-4 w-full text-sm text-zinc-500 underline-offset-2 transition-colors hover:text-red-600 hover:underline"
          >
            Clear cart
          </button>
        </aside>
      </div>
    </main>
  );
}
