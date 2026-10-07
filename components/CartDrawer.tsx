"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MAX_ITEM_QUANTITY, useCartStore, cartTotal, cartCount } from "@/lib/cartStore";
import { formatPrice } from "@/lib/utils";
import { useDialog } from "@/lib/useDialog";

const subscribeNoop = () => () => {};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // False on the server and during hydration, true afterwards (the portal needs document.body)
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const panelRef = useRef<HTMLDivElement>(null);
  // Header renders a CartBadge (and so a drawer) for both mobile and desktop, so the id must be unique
  const titleId = useId();
  useDialog(isOpen, onClose, panelRef);

  const total = cartTotal(items);
  const count = cartCount(items);

  // Portal to <body>: the sticky header uses backdrop-blur, which would otherwise make this fixed panel size itself to the header
  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* The wrapper clips the closed drawer so it cannot widen the page on phones */}
      {/* inert while closed: the off-screen panel must not take Tab focus or be read out */}
      <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? "" : "pointer-events-none"}`} inert={!isOpen}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md transform flex-col bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-4">
          <h2 id={titleId} className="text-lg text-zinc-900">
            Shopping cart ({count})
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-2xl text-zinc-500 transition-colors hover:bg-zinc-100"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-zinc-500">Your cart is empty</p>
              <button
                onClick={onClose}
                className="btn btn-primary"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-4 rounded-sm border border-zinc-200 p-3"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={onClose}
                    className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-zinc-100"
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
                      <span className="flex h-full items-center justify-center text-xs text-zinc-500">
                        No image
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="text-sm font-medium text-zinc-900 hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-zinc-600">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="relative flex h-6 w-6 items-center justify-center rounded-sm border border-zinc-300 text-sm text-zinc-700 transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-zinc-100"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= MAX_ITEM_QUANTITY}
                          className="relative flex h-6 w-6 items-center justify-center rounded-sm border border-zinc-300 text-sm text-zinc-700 transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-zinc-100 disabled:opacity-40"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                        className="relative text-xs text-red-600 after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] hover:text-red-700"
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
          <div className="border-t border-zinc-200 p-4">
            <div className="mb-4 flex items-center justify-between text-lg font-semibold text-zinc-900">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn btn-primary flex h-12"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="btn btn-secondary mt-2 flex h-12"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
      </div>
    </>,
    document.body
  );
}
