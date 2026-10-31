import Image from "next/image";
import type { Order } from "@/lib/types";
import { formatPrice, preorderText } from "@/lib/utils";

// The items, totals and delivery address of an order, shared by the confirmation and tracking pages
export default function OrderSummary({ order, showStatus = false }: { order: Order; showStatus?: boolean }) {
  return (
    <div className="rounded-sm border border-zinc-200">
      <ul className="flex flex-col divide-y divide-zinc-200">
        {order.items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm bg-zinc-100">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-xs text-zinc-500">
                  No image
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-zinc-900">
                {item.name}
              </p>
              {item.preorder && (
                <p className="text-sm text-amber-700">{preorderText(item.preorderDays)}</p>
              )}
              <p className="text-sm text-zinc-500">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-zinc-900">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 border-t border-zinc-200 p-4 text-zinc-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {Boolean(order.discount) && (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatPrice(order.discount ?? 0)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{formatPrice(order.deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold text-zinc-900">
          <span>Total (Cash on Delivery)</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="border-t border-zinc-200 p-4 text-sm text-zinc-500">
        {showStatus && (
          <p>
            <span className="font-medium">Status:</span> {order.status}
          </p>
        )}
        <p>
          <span className="font-medium">Delivering to:</span> {order.address}
          {order.district ? `, ${order.district}` : ""}
        </p>
      </div>
    </div>
  );
}
