import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { clientIpFrom } from "@/lib/clientIp";
import { ORDER_PHONE_COOKIE } from "@/lib/orderAccess";
import { getOrderOrNotFound } from "@/lib/orderLookup";
import OrderStatusTracker from "@/components/OrderStatusTracker";
import OrderSummary from "@/components/OrderSummary";

type Props = PageProps<"/track-order/[orderNumber]">;

export default async function TrackedOrderPage(props: Props) {
  const { orderNumber } = await props.params;
  // Set by the Track Order form. Number + phone together act as the guest's
  // credentials, so without a phone we send them back to that form.
  const phoneValue = (await cookies()).get(ORDER_PHONE_COOKIE)?.value;
  if (!phoneValue) redirect("/track-order");

  // Pass the shopper's address so the API's lookup limit applies per shopper, not per storefront server.
  // Only a real miss means "check your details"; the API being down or busy goes to the error page.
  const order = await getOrderOrNotFound(orderNumber, phoneValue, clientIpFrom(await headers()));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl text-zinc-900">
          Track your order
        </h1>
        <p className="rounded-sm bg-zinc-100 px-4 py-1 font-mono text-sm text-zinc-700">
          {order.orderNumber}
        </p>
      </div>

      <OrderStatusTracker status={order.status} />
      <OrderSummary order={order} />

      <div className="mt-2 text-center">
        <Link
          href="/track-order"
          className="btn btn-secondary"
        >
          Track another order
        </Link>
      </div>
    </main>
  );
}
