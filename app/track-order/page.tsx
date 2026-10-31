"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeOrderNumber, orderTrackingPath } from "@/lib/orderAccess";
import { rememberTrackingPhone } from "@/app/order-confirmation/actions";

const inputClass =
  "w-full rounded-sm border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-brand";

export default function TrackOrderPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    orderNumber: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    // Order numbers are stored upper-case (6 characters, e.g. K7M3QX) and matched exactly
    const orderNumber = normalizeOrderNumber(form.orderNumber);
    // The phone goes in a cookie for that order's tracking page, never in the link
    const remembered = await rememberTrackingPhone(orderNumber, form.phone).catch(() => false);
    if (!remembered) {
      setError("We could not check that order. Check the order number and phone number, then try again.");
      setSubmitting(false);
      return;
    }
    router.push(orderTrackingPath(orderNumber));
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-24 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl text-zinc-900">
          Track your order
        </h1>
        <p className="mt-2 text-zinc-600">
          Enter your order details to view the status
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Order number
          <input
            type="text"
            required
            placeholder="e.g. K7M3QX"
            autoComplete="off"
            autoCapitalize="characters"
            value={form.orderNumber}
            onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Phone number
          <input
            type="tel"
            required
            pattern="01[0-9]{9}"
            minLength={11}
            maxLength={11}
            inputMode="numeric"
            autoComplete="tel-national"
            title="11-digit mobile number starting with 01, for example 01712345678"
            placeholder="01712345678"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
          />
          <span className="text-xs text-zinc-500">
            The phone number you used when placing the order
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary h-12 w-full text-base"
        >
          {submitting ? "Checking..." : "Track order"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        You can find your order number in the confirmation page after checkout
      </p>
    </main>
  );
}
