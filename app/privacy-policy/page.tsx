import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What personal information Coovi collects when you order, why, and how it is used.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: pageOpenGraph("/privacy-policy", "Privacy policy | Coovi"),
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="You can shop at Coovi without creating an account. This page explains what we collect when you place an order and what we do with it."
      sections={[
        {
          heading: "What we collect",
          body: (
            <ul className="list-disc space-y-1 pl-6">
              <li>Your name, phone number and delivery address.</li>
              <li>Any note you add to your order.</li>
              <li>The sarees you order, the prices and the date.</li>
            </ul>
          ),
        },
        {
          heading: "What we do not collect",
          body: (
            <p>
              We do not take online payments, so we never see or store card or mobile-banking details. We do not
              create customer accounts or store passwords for shoppers.
            </p>
          ),
        },
        {
          heading: "Why we use it",
          body: (
            <p>
              We use your details only to confirm your order, contact you about it, deliver it, and let you look it up
              on the Track order page. Your order number together with your phone number acts as the key to view an
              order.
            </p>
          ),
        },
        {
          heading: "Your cart",
          body: (
            <p>
              Items in your cart are saved in your own browser so they are still there when you come back. This stays
              on your device and is not sent to us until you place an order.
            </p>
          ),
        },
        {
          heading: "Who sees your information",
          body: (
            <p>
              Your name, phone number and address are shared with the person delivering your order. Our website,
              database and hosting providers handle the data on our behalf so the shop can run. We do not sell your
              information.
            </p>
          ),
        },
        {
          heading: "Cookies and tracking",
          body: (
            <p>
              We do not currently use advertising or analytics cookies. If that changes we will update this page.
            </p>
          ),
        },
        {
          heading: "Your choices",
          body: (
            <p>
              You can ask us to correct your details or to delete your order information by contacting us. We may need
              to keep basic order records where we need them for our accounts.
            </p>
          ),
        },
      ]}
    />
  );
}
