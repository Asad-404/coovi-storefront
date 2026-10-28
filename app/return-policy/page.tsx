import type { Metadata } from "next";
import Link from "next/link";
import Accordion from "@/components/Accordion";
import PolicyPage from "@/components/PolicyPage";
import { getShopSettings } from "@/lib/api";
import { pageOpenGraph, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Return and exchange policy",
  description:
    "Check your saree in front of the delivery person. How returns, delivery charges and defects work, plus answers to common questions.",
  alternates: { canonical: "/return-policy" },
  openGraph: pageOpenGraph("/return-policy", "Return and exchange policy | Coovi"),
};

export default async function ReturnPolicyPage() {
  const settings = await getShopSettings();
  const whatsappLink = (
    <a
      href={whatsappUrl(undefined, settings.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-brand"
    >
      WhatsApp
    </a>
  );

  return (
    <PolicyPage
      title="Return & Exchange"
      intro="Please read all the details about a saree before you order."
      sections={[
        {
          heading: "Return policy",
          body: (
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Screens and lighting vary, so the colour of the fabric or block print may look a little different in
                photos than in person.
              </li>
              <li>
                If you are unsure about a colour, message us on {whatsappLink} before you buy. We are always happy to
                send extra photos.
              </li>
              <li>
                You must check the saree in front of the delivery person. If you want to return it, hand it straight
                back to them.
              </li>
              <li>If you return a saree, you pay the delivery charge. Coovi does not cover it.</li>
              <li>If the saree itself has a defect, Coovi pays the return delivery charge.</li>
              <li>Once the delivery person has left, we cannot accept any return or complaint.</li>
              <li>
                You can ask us to cancel an order before it has been shipped. Contact us with your order number, and
                check its status on the{" "}
                <Link href="/track-order" className="underline hover:text-brand">
                  Track order
                </Link>{" "}
                page.
              </li>
            </ul>
          ),
        },
        {
          heading: "Frequently asked questions",
          body: (
            <div className="rounded-sm border border-zinc-200 px-4 [&>details:last-child]:border-b-0">
              <Accordion title="How long does delivery take?">
                2–4 days inside Dhaka and 4–6 days outside Dhaka.
              </Accordion>
              <Accordion title="Does the saree come with a blouse piece?">
                Most of our sarees are 13 yards, so you can cut a blouse piece from them. A 12 or 12.5 yard saree is too
                short to cut one. Each product description gives the length.
              </Accordion>
              <Accordion title="Can you make a custom blouse?">No, we do not make custom blouses.</Accordion>
              <Accordion title="What material is the saree?">Each product description lists the material.</Accordion>
              <Accordion title="Will the colour match the photo?">
                The product description gives the colour. It may look slightly different because of screens or
                lighting. Message us on {whatsappLink} if you are unsure.
              </Accordion>
              <Accordion title="How do you deliver?">We deliver through Steadfast Courier.</Accordion>
              <Accordion title="How do I pay?">
                Cash on delivery only. You pay the delivery person when your saree arrives.
              </Accordion>
              <Accordion title="Where are you based? Can I see a saree in person?">
                We are based in Dhaka. We do not have a showroom, so you cannot see sarees in person.
              </Accordion>
              <Accordion title="Will the colour run when I wash it?">
                <ul className="list-disc space-y-1 pl-6">
                  <li>Hand wash in cold water with a mild detergent.</li>
                  <li>Do not use harsh chemicals or a washing machine.</li>
                  <li>Optionally, soak the saree in salt water for 10–15 minutes first.</li>
                  <li>Dry it in the shade on a hanger.</li>
                  <li>Iron at medium heat with a cotton cloth over the saree.</li>
                </ul>
              </Accordion>
            </div>
          ),
        },
      ]}
    />
  );
}
