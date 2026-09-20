"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, cartTotal } from "@/lib/cartStore";
import { getDeliveryFee, getProducts, postOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

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
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [stockIssues, setStockIssues] = useState<string[]>([]);

  // Delivery fee and live stock both come from the API — the browser's copy
  // of either could be stale or spoofed
  useEffect(() => {
    let active = true;

    getDeliveryFee()
      .then((fee) => {
        if (active) setDeliveryFee(fee);
      })
      .catch(() => {
        if (active) setError("Could not load the delivery fee — please refresh the page");
      });

    getProducts()
      .then((products) => {
        if (!active) return;
        const issues: string[] = [];
        for (const item of items) {
          const product = products.find((p) => p._id === item.productId);
          if (product && product.stock < item.quantity) {
            issues.push(
              `Only ${product.stock} left of "${item.name}" — please reduce the quantity in your cart`
            );
          }
        }
        setStockIssues(issues);
      })
      .catch(() => {
        // Not fatal: the API re-checks stock again when the order is submitted
      });

    return () => {
      active = false;
    };
  }, [items]);

  const subtotal = cartTotal(items);
  const total = deliveryFee === null ? null : subtotal + deliveryFee;

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
      // Only WHAT the customer chose is sent — the server decides all prices
      const order = await postOrder({
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        notes: form.notes || undefined,
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
      });

      clearCart();
      // The phone travels with the link: order number + phone together act
      // as the guest's credentials on the confirmation page
      router.push(
        `/order-confirmation/${order.orderNumber}?phone=${encodeURIComponent(form.phone)}`
      );
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

          {stockIssues.length > 0 && (
            <ul className="mt-4 flex list-disc flex-col gap-1 rounded-lg border border-amber-300 bg-amber-50 p-3 pl-8 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {stockIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            disabled={submitting || total === null || stockIssues.length > 0}
            className="mt-6 h-12 w-full rounded-full bg-rose-700 text-base font-semibold text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700 sm:w-auto sm:px-12"
          >
            {submitting
              ? "Placing order..."
              : total === null
                ? "Loading..."
                : `Place Order - ${formatPrice(total)}`}
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
              <span className="font-medium">
                {deliveryFee === null ? "Loading..." : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              <span>Total</span>
              <span>{total === null ? "Loading..." : formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
