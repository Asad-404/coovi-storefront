"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, cartTotal } from "@/lib/cartStore";
import { DELIVERY_FEE, formatPrice } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-rose-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartTotal(items);
  const total = subtotal + DELIVERY_FEE;

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Nothing to check out
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Your cart is empty. Add a saree first!
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          address: form.address,
          notes: form.notes || undefined,
          items: items.map(({ productId, name, price, quantity, image }) => ({
            productId,
            name,
            price,
            quantity,
            image,
          })),
          subtotal,
          deliveryFee: DELIVERY_FEE,
          total,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message ?? "Failed to place order");
      }

      clearCart();
      router.push(`/order-confirmation/${json.data.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <h1 className="py-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Delivery details
            </legend>

            <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full name
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="e.g. Fatima Rahman"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Phone number
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 01712345678"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full address
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="House, road, area, city"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Order notes (optional)
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Anything we should know?"
                className={inputClass}
              />
            </label>
          </fieldset>

          {error && (
            <p className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 h-12 w-full rounded-full bg-rose-700 text-base font-semibold text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700 sm:w-auto sm:px-12"
          >
            {submitting ? "Placing order..." : `Place Order - ${formatPrice(total)}`}
          </button>

          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Payment: Cash on Delivery. We will call you to confirm your order.
          </p>
        </form>

        <aside className="h-fit rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Order summary
          </h2>

          <ul className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between gap-2 text-sm text-zinc-600 dark:text-zinc-300"
              >
                <span>
                  {item.name}
                  <span className="text-zinc-400"> × {item.quantity}</span>
                </span>
                <span className="whitespace-nowrap font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-zinc-600 dark:text-zinc-300">
              <span>Delivery</span>
              <span className="font-medium">{formatPrice(DELIVERY_FEE)}</span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
