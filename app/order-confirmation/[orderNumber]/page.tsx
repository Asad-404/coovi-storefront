import Link from "next/link";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import { clientIpFrom } from "@/lib/clientIp";
import { ORDER_PHONE_COOKIE } from "@/lib/orderAccess";
import { getOrderOrNotFound } from "@/lib/orderLookup";
import { openOrder } from "../actions";
import OrderStatusTracker from "@/components/OrderStatusTracker";
import OrderSummary from "@/components/OrderSummary";
import type { Order } from "@/lib/types";

type Props = PageProps<"/order-confirmation/[orderNumber]">;

// Shoppers come back to this page later, so the heading follows the order's current status
const HEADINGS: Record<Order["status"], string> = {
  Pending: "Order placed!",
  Processing: "Order confirmed",
  Shipped: "Order on the way",
  Delivered: "Order delivered",
  Cancelled: "Order cancelled",
  Returned: "Order returned",
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { orderNumber } = await props.params;
  return {
    title: `Order ${orderNumber}`,
    // A guest's order details must never end up in a search engine
    robots: { index: false, follow: false },
  };
}

export default async function OrderConfirmationPage(props: Props) {
  const { orderNumber } = await props.params;
  // Set by checkout or the phone form below, and only sent to this order's page
  const phoneValue = (await cookies()).get(ORDER_PHONE_COOKIE)?.value;

  // The order number alone must NOT be enough to see the order: number +
  // phone together act as the guest's credentials. Without a phone we ask
  // for it instead of revealing anything.
  if (!phoneValue) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl text-zinc-900">
          Check your order
        </h1>
        <p className="text-zinc-500">
          Enter the phone number you used at checkout to view order{" "}
          <span className="font-mono">{orderNumber}</span>.
        </p>
        {/* Posted, not put in the address: the phone is kept in a cookie for this page */}
        <form action={openOrder} className="flex w-full flex-col gap-3">
          <input type="hidden" name="orderNumber" value={orderNumber} />
          <label htmlFor="order-phone" className="sr-only">
            Phone number used at checkout
          </label>
          <input
            id="order-phone"
            type="tel"
            name="phone"
            required
            pattern="01[0-9]{9}"
            inputMode="numeric"
            autoComplete="tel-national"
            title="11-digit mobile number starting with 01, for example 01712345678"
            placeholder="e.g. 01712345678"
            className="w-full rounded-sm border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-brand"
          />
          <button
            type="submit"
            className="btn btn-primary h-12"
          >
            View my order
          </button>
        </form>
      </main>
    );
  }

  // Pass the shopper's address so the API's lookup limit applies per shopper, not per storefront server.
  // An unknown order or the wrong phone shows the not-found page; a timeout or the API being down or
  // busy reaches this route's error.tsx, which offers a retry instead of saying the order does not exist.
  const order = await getOrderOrNotFound(orderNumber, phoneValue, clientIpFrom(await headers()));

  // Cancelled and Returned orders left the normal path, so they get a neutral mark instead of a green tick
  const stopped = order.status === "Cancelled" || order.status === "Returned";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <div
          aria-hidden="true"
          className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
            stopped ? "bg-zinc-100 text-zinc-500" : "bg-green-100 text-green-700"
          }`}
        >
          {stopped ? "✕" : "✓"}
        </div>
        <h1 className="text-3xl text-zinc-900">
          {HEADINGS[order.status]}
        </h1>
        <p className="text-zinc-600">
          Thank you, {order.customerName.split(" ")[0]}!
          {/* The confirmation call only makes sense before the order is confirmed */}
          {order.status === "Pending" && (
            <>
              {" "}We will call you at{" "}
              <span className="font-medium">{order.phone}</span> to confirm.
            </>
          )}
        </p>
        <p className="rounded-sm bg-zinc-100 px-4 py-1 font-mono text-sm text-zinc-700">
          {order.orderNumber}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <OrderStatusTracker status={order.status} />
        <OrderSummary order={order} />
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="btn btn-primary"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
