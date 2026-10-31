import type { Order } from "@/lib/types";

// The same words the delivery policy page uses
const STEPS: Order["status"][] = ["Pending", "Processing", "Shipped", "Delivered"];

const MESSAGES: Record<Order["status"], string> = {
  Pending: "We have your order and will call you to confirm it.",
  Processing: "We are preparing your order.",
  Shipped: "Your order is on the way to you.",
  Delivered: "Your order has been delivered.",
  Cancelled: "This order was cancelled.",
  Returned: "This order was not delivered and came back to us.",
};

export default function OrderStatusTracker({ status }: { status: Order["status"] }) {
  const current = STEPS.indexOf(status);

  return (
    <div className="rounded-sm border border-zinc-200 p-4 sm:p-6">
      <p className="text-center text-lg font-semibold text-zinc-900">{MESSAGES[status]}</p>
      {/* Cancelled and Returned orders left the normal path, so there are no steps to show */}
      {current >= 0 && (
        <ol className="mt-6 grid grid-cols-4 gap-2">
          {STEPS.map((step, index) => {
            const reached = index <= current;
            return (
              <li
                key={step}
                aria-current={index === current ? "step" : undefined}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                    reached ? "bg-brand text-white" : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {reached ? "✓" : index + 1}
                </span>
                <span className={`text-xs sm:text-sm ${reached ? "font-medium text-zinc-900" : "text-zinc-500"}`}>
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
