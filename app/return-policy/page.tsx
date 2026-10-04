import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Return and exchange policy",
  description: "How checking your saree at delivery works, and what to do if something is wrong with your order.",
  alternates: { canonical: "/return-policy" },
  openGraph: pageOpenGraph("/return-policy", "Return and exchange policy | Coovi"),
};

export default function ReturnPolicyPage() {
  return (
    <PolicyPage
      title="Return & Exchange"
      intro="We want you to be happy with your saree. Because you pay on delivery, the best time to check your order is when it arrives."
      sections={[
        {
          heading: "Check your parcel when it arrives",
          body: (
            <>
              <p>
                Please open the parcel and check the saree in front of the delivery person before you pay. If you
                received the wrong saree, or it is damaged, you do not have to pay. Refuse the parcel and message us
                with your order number.
              </p>
            </>
          ),
        },
        {
          heading: "If you find a problem after delivery",
          body: (
            <>
              <p>
                If you notice a problem after you have paid, such as the wrong item or a defect that was not visible
                at delivery, contact us as soon as possible. Send your order number and clear photos of the saree.
              </p>
              <p>
                Where the problem is on our side (wrong item, damage or a fabric defect), we will arrange an exchange
                or a refund. We will tell you how it will be handled when you contact us.
              </p>
            </>
          ),
        },
        {
          heading: "What we cannot accept",
          body: (
            <ul className="list-disc space-y-1 pl-6">
              <li>Sarees that have been worn, washed or altered.</li>
              <li>
                Small differences in colour or texture. Our sarees are handcrafted and screens show colours slightly
                differently, so a saree may look a little different from its photo.
              </li>
              <li>Changing your mind about a saree that arrived exactly as ordered.</li>
            </ul>
          ),
        },
        {
          heading: "Cancelling an order",
          body: (
            <p>
              You can ask us to cancel an order before it has been shipped. Contact us with your order number. You can
              check the status of your order on the{" "}
              <Link href="/track-order" className="underline hover:text-brand">
                Track Order
              </Link>{" "}
              page.
            </p>
          ),
        },
      ]}
    />
  );
}
