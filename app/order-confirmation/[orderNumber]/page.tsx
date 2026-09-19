import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrderByNumber } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

type Props = PageProps<"/order-confirmation/[orderNumber]">;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { orderNumber } = await props.params;
  return { title: `Order ${orderNumber} - Coovi` };
}

export default async function OrderConfirmationPage(props: Props) {
  const { orderNumber } = await props.params;

  let order;
  try {
    order = await getOrderByNumber(orderNumber);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700 dark:bg-green-900 dark:text-green-300">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Order placed!
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Thank you, {order.customerName.split(" ")[0]}! We will call you at{" "}
          <span className="font-medium">{order.phone}</span> to confirm.
        </p>
        <p className="rounded-full bg-zinc-100 px-4 py-1 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {order.orderNumber}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-zinc-400">
                    No image
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {item.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 border-t border-zinc-200 p-4 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            <span>Total (Cash on Delivery)</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="border-t border-zinc-200 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <p>
            <span className="font-medium">Status:</span> {order.status}
          </p>
          <p>
            <span className="font-medium">Delivering to:</span> {order.address}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="rounded-full bg-rose-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-800"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
