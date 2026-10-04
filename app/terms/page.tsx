import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms for ordering from Coovi: prices, orders, payment and delivery.",
  alternates: { canonical: "/terms" },
  openGraph: pageOpenGraph("/terms", "Terms of service | Coovi"),
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="By placing an order at Coovi you agree to these terms. They are written to be short and clear."
      sections={[
        {
          heading: "Orders and prices",
          body: (
            <p>
              All prices are in Bangladeshi taka (BDT). The price you pay is the price calculated by our system when
              you place your order, plus the delivery charge shown at checkout. Prices and availability can change.
              Each saree is limited in stock, so an order is only final once we confirm it. If a saree turns out to be
              unavailable or a price was shown wrongly, we will contact you and may cancel that order.
            </p>
          ),
        },
        {
          heading: "Payment",
          body: (
            <p>
              Payment is cash on delivery only. See{" "}
              <Link href="/delivery-policy" className="underline hover:text-brand">
                Delivery &amp; Payment
              </Link>
              .
            </p>
          ),
        },
        {
          heading: "Delivery, returns and exchanges",
          body: (
            <p>
              Delivery is covered in{" "}
              <Link href="/delivery-policy" className="underline hover:text-brand">
                Delivery &amp; Payment
              </Link>{" "}
              and problems with an order in{" "}
              <Link href="/return-policy" className="underline hover:text-brand">
                Return &amp; Exchange
              </Link>
              .
            </p>
          ),
        },
        {
          heading: "Product descriptions and photos",
          body: (
            <p>
              We try to describe and photograph every saree accurately. Handcrafted fabrics and different screens can
              make colours and textures look slightly different in person.
            </p>
          ),
        },
        {
          heading: "Correct details",
          body: (
            <p>
              Please give a correct name, phone number and address. We are not responsible for a failed delivery caused
              by wrong or unreachable details.
            </p>
          ),
        },
        {
          heading: "Our content",
          body: (
            <p>
              The Coovi name, logo, photos and text on this site belong to Coovi or are used with permission. Please do
              not copy them without asking.
            </p>
          ),
        },
        {
          heading: "Changes and law",
          body: (
            <p>
              We may update these terms from time to time; the date at the top shows the latest version. These terms
              are governed by the laws of Bangladesh.
            </p>
          ),
        },
      ]}
    />
  );
}
