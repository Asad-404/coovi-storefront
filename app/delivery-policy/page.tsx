import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { getDeliveryFee } from "@/lib/api";
import { pageOpenGraph } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Delivery and payment",
  description: "Delivery charge, cash on delivery and how to track your Coovi order.",
  alternates: { canonical: "/delivery-policy" },
  openGraph: pageOpenGraph("/delivery-policy", "Delivery and payment | Coovi"),
};

export const revalidate = 3600;

export default async function DeliveryPolicyPage() {
  const fee = await getDeliveryFee().catch(() => null);

  return (
    <PolicyPage
      title="Delivery & Payment"
      intro="We deliver across Bangladesh and you pay in cash when your saree arrives."
      sections={[
        {
          heading: "Delivery charge",
          body: (
            <p>
              {fee !== null
                ? `Delivery costs ${formatPrice(fee)} per order, wherever in Bangladesh you are.`
                : "The delivery charge is the same for every order and is shown at checkout."}{" "}
              It is added to your total at checkout, so you see the full amount before you place the order.
            </p>
          ),
        },
        {
          heading: "Cash on delivery",
          body: (
            <p>
              We only take cash on delivery. You do not pay anything online. You pay the delivery person when the
              parcel arrives, after you have checked your saree.
            </p>
          ),
        },
        {
          heading: "How your order moves",
          body: (
            <>
              <p>
                After you order, your order is <strong>Pending</strong> until we confirm it, then{" "}
                <strong>Processing</strong>, <strong>Shipped</strong> and finally <strong>Delivered</strong>. If an
                order is cancelled it shows <strong>Cancelled</strong>.
              </p>
              <p>
                Track it on the{" "}
                <Link href="/track-order" className="underline hover:text-brand">
                  Track order
                </Link>{" "}
                page with your order number and the phone number you used at checkout.
              </p>
            </>
          ),
        },
        {
          heading: "Delivery time",
          body: (
            <p>
              Delivery time depends on where you live. We will contact you on the phone number you gave at checkout to
              confirm your order and the delivery. Please make sure your phone number and address are correct and that
              someone can receive the parcel.
            </p>
          ),
        },
      ]}
    />
  );
}
