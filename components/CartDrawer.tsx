"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, cartTotal, cartCount } from "@/lib/cartStore";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const total = cartTotal(items);
  const count = cartCount(items);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-white shadow-xl transition-transform duration-300 dark:bg-zinc-950 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Shopping Cart ({count})
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-2xl text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">Your cart is empty</p>
              <button
                onClick={onClose}
                className="rounded-full bg-rose-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-800"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-4 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={onClose}
                    className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs text-zinc-400">
                        No image
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="text-sm font-medium text-zinc-900 hover:text-rose-700 dark:text-zinc-50 dark:hover:text-rose-400"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <div className="mb-4 flex items-center justify-between text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex h-12 items-center justify-center rounded-full bg-rose-700 font-semibold text-white transition-colors hover:bg-rose-800"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="mt-2 flex h-12 items-center justify-center rounded-full border-2 border-zinc-200 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
