"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-rose-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export default function TrackOrderPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    orderNumber: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/order-confirmation/${form.orderNumber}?phone=${encodeURIComponent(form.phone)}`);
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-24 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Track Your Order
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Enter your order details to view the status
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Order Number
          <input
            type="text"
            required
            placeholder="e.g. ORD-20260921-001"
            value={form.orderNumber}
            onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Phone Number
          <input
            type="tel"
            required
            pattern="01[0-9]{9}"
            minLength={11}
            maxLength={11}
            inputMode="numeric"
            placeholder="01712345678"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
          />
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            The phone number you used when placing the order
          </span>
        </label>

        <button
          type="submit"
          className="h-12 w-full rounded-full bg-rose-700 text-base font-semibold text-white transition-colors hover:bg-rose-800"
        >
          Track Order
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        You can find your order number in the confirmation page after checkout
      </p>
    </main>
  );
}
