"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, cartTotal } from "@/lib/cartStore";
import type { DeliveryArea, DeliveryOptions } from "@/lib/types";
import { getDeliveryOptions, getProductBySlug, postOrder } from "@/lib/api";
import { orderPagePath } from "@/lib/orderAccess";
import { formatPrice, isAvailable, isPreorder, joinAddress, preorderText } from "@/lib/utils";
import { rememberOrderPhone } from "@/app/order-confirmation/actions";
import { trackInitiateCheckout } from "@/lib/metaPixel";

const inputClass =
  "w-full rounded-sm border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-brand";

const AREA_OPTIONS: { value: DeliveryArea; label: string; hint: string }[] = [
  { value: "inside_dhaka", label: "Inside Dhaka", hint: "Dhaka city only" },
  {
    value: "outside_dhaka",
    label: "Outside Dhaka",
    hint: "All other districts, and suburbs such as Savar and Keraniganj",
  },
];

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    street: "",
    flat: "",
    thana: "",
    district: "",
    notes: "",
  });
  // Nothing is chosen at first: starting on the cheaper fee would undercharge anyone who misses it.
  // Inside Dhaka always goes with district Dhaka; the API refuses any other pair
  const [area, setArea] = useState<DeliveryArea | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [delivery, setDelivery] = useState<DeliveryOptions | null>(null);
  const [stockIssues, setStockIssues] = useState<string[]>([]);
  const [preorderNotes, setPreorderNotes] = useState<string[]>([]);

  // Meta Pixel: once per visit to checkout, as soon as the saved cart has something in it
  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (checkoutTracked.current || items.length === 0) return;
    checkoutTracked.current = true;
    trackInitiateCheckout(items);
  }, [items]);

  // Delivery fees and live stock both come from the API — the browser's copy
  // of either could be stale or spoofed
  useEffect(() => {
    let active = true;

    getDeliveryOptions()
      .then((options) => {
        if (active) setDelivery(options);
      })
      .catch(() => {
        if (active) setError("Could not load the delivery fee — please refresh the page");
      });

    // One lookup per cart item: a single product-list page would miss anything
    // beyond its first 12 products. A failed lookup is not fatal — the API
    // re-checks availability and stock when the order is submitted.
    Promise.allSettled(items.map((item) => getProductBySlug(item.slug))).then((results) => {
      if (!active) return;
      const issues: string[] = [];
      const notes: string[] = [];
      results.forEach((result, i) => {
        if (result.status !== "fulfilled") return;
        const product = result.value;
        const item = items[i];
        // Short on stock but taking pre-orders: the API turns the line into a pre-order
        if (product.inStock && product.allowPreorder && product.stock < item.quantity) {
          notes.push(`"${item.name}": ${preorderText(product.preorderDays).toLowerCase()}`);
        } else if (!isAvailable(product) && !isPreorder(product)) {
          issues.push(`"${item.name}" is currently unavailable — please remove it from your cart`);
        } else if (product.stock < item.quantity) {
          issues.push(
            `Only ${product.stock} left of "${item.name}" — please reduce the quantity in your cart`
          );
        }
      });
      setStockIssues(issues);
      setPreorderNotes(notes);
    });

    return () => {
      active = false;
    };
  }, [items]);

  const subtotal = cartTotal(items);
  // Shown for the chosen area; the API charges the same amount for that area
  const deliveryFee = delivery && area ? delivery.zones[area] : null;
  const total = deliveryFee === null ? null : subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl text-zinc-900">
          Nothing to check out
        </h1>
        <p className="text-zinc-500">
          Your cart is empty. Add a saree first!
        </p>
        <Link
          href="/"
          className="btn btn-primary"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  function chooseArea(next: DeliveryArea) {
    setArea(next);
    if (next === "inside_dhaka") setForm({ ...form, district: "Dhaka" });
  }

  // Dhaka keeps the chosen area, because a Dhaka suburb is outside Dhaka city
  function chooseDistrict(district: string) {
    setForm({ ...form, district });
    if (district !== "Dhaka") setArea("outside_dhaka");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // The required radios stop this in the browser
    if (area === null) return;
    setSubmitting(true);
    setError("");

    try {
      // Only WHAT the customer chose is sent — the server decides all prices
      const order = await postOrder({
        customerName: form.customerName,
        phone: form.phone,
        address: joinAddress(form.street, form.flat, form.thana),
        district: form.district,
        deliveryArea: area,
        notes: form.notes || undefined,
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
      });

      // Order number + phone together act as the guest's credentials on the
      // confirmation page; the phone goes in a cookie, not in the link
      // If this fails the order page simply asks for the phone again
      await rememberOrderPhone(order.orderNumber, form.phone).catch(() => false);
      clearCart();
      router.push(orderPagePath(order.orderNumber));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your order could not be placed. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <h1 className="py-8 text-3xl text-zinc-900">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <fieldset className="flex h-fit flex-col gap-4">
          <legend className="mb-2 text-lg font-semibold text-zinc-900">
            Delivery details
          </legend>

          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            Full name
            <input
              type="text"
              required
              minLength={1}
              maxLength={100}
              autoComplete="name"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="e.g. Fatima Rahman"
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
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="01712345678 (11 digits)"
              aria-describedby="phone-hint"
              className={inputClass}
            />
            <span id="phone-hint" className="font-normal text-zinc-500">
              We will call this number to confirm your order.
            </span>
          </label>

          {/* Short enough that the joined address and district fit Steadfast's 250 characters */}
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            House and road
            <input
              type="text"
              required
              minLength={3}
              maxLength={120}
              autoComplete="address-line1"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              placeholder="e.g. House 12, Road 5"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            Flat or floor (optional)
            <input
              type="text"
              maxLength={40}
              autoComplete="address-line2"
              value={form.flat}
              onChange={(e) => setForm({ ...form, flat: e.target.value })}
              placeholder="e.g. Flat 4B"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            Area or thana
            <input
              type="text"
              required
              minLength={2}
              maxLength={60}
              autoComplete="address-level2"
              value={form.thana}
              onChange={(e) => setForm({ ...form, thana: e.target.value })}
              placeholder="e.g. Dhanmondi"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            District
            <select
              required
              autoComplete="address-level1"
              value={form.district}
              onChange={(e) => chooseDistrict(e.target.value)}
              disabled={delivery === null}
              className={inputClass}
            >
              <option value="" disabled>
                {delivery === null ? "Loading districts..." : "Choose your district"}
              </option>
              {delivery?.districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            Order notes (optional)
            <textarea
              rows={2}
              maxLength={500}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Anything we should know?"
              className={inputClass}
            />
          </label>
        </fieldset>

        <div className="h-fit">
          <section className="rounded-sm border border-zinc-200 p-6">
            <h2 className="text-lg text-zinc-900">
              Order summary
            </h2>

            <ul className="mt-4 flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between gap-2 text-sm text-zinc-600"
                >
                  <span>
                    {item.name}
                    <span className="text-zinc-500"> × {item.quantity}</span>
                  </span>
                  <span className="whitespace-nowrap font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4 text-zinc-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>

            <fieldset className="mt-4 border-t border-zinc-200 pt-4">
              <legend className="float-left w-full text-zinc-600">Delivery</legend>
              <div className="clear-both flex flex-col gap-3 pt-3">
                {AREA_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-start gap-2 text-zinc-700">
                    <input
                      type="radio"
                      required
                      name="deliveryArea"
                      value={option.value}
                      checked={area === option.value}
                      onChange={() => chooseArea(option.value)}
                      disabled={delivery === null}
                      className="mt-1.5 accent-brand"
                    />
                    <span className="flex-1">
                      <span className="block font-medium">{option.label}</span>
                      <span className="block text-sm text-zinc-500">{option.hint}</span>
                    </span>
                    <span className="whitespace-nowrap font-medium">
                      {delivery === null ? "Loading..." : formatPrice(delivery.zones[option.value])}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4 text-lg font-semibold text-zinc-900">
              <span>Total</span>
              <span>{total === null ? "–" : formatPrice(total)}</span>
            </div>
          </section>

          {error && (
            <p role="alert" className="mt-4 rounded-sm border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {stockIssues.length > 0 && (
            <ul role="status" className="mt-4 flex list-disc flex-col gap-1 rounded-sm border border-amber-300 bg-amber-50 p-3 pl-8 text-sm text-amber-800">
              {stockIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          )}

          {preorderNotes.length > 0 && (
            <ul role="status" className="mt-4 flex list-disc flex-col gap-1 rounded-sm border border-zinc-200 bg-zinc-50 p-3 pl-8 text-sm text-zinc-700">
              {preorderNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            disabled={submitting || delivery === null || stockIssues.length > 0}
            className="btn btn-primary mt-6 h-12 w-full text-base"
          >
            {submitting
              ? "Placing order..."
              : delivery === null
                ? "Loading..."
                : total === null
                  ? "Place order"
                  : `Place order for ${formatPrice(total)}`}
          </button>

          <p className="mt-4 text-sm text-zinc-500">
            Payment: Cash on Delivery. We will call you to confirm your order.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            By placing your order you agree to our{" "}
            <Link href="/terms" className="underline hover:text-brand">
              Terms
            </Link>
            ,{" "}
            <Link href="/return-policy" className="underline hover:text-brand">
              Return &amp; Exchange
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline hover:text-brand">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </form>
    </main>
  );
}
