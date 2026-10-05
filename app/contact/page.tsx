import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact us",
  alternates: { canonical: "/contact" },
  openGraph: pageOpenGraph("/contact", "Contact us | Coovi"),
  description: "Get in touch with Coovi for questions about orders, products, or support.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl text-zinc-900">
        Contact Us
      </h1>

      <div className="mt-8 space-y-8">
        <div>
          <p className="text-lg text-zinc-700">
            We&apos;re here to help! Reach out to us with any questions about our products,
            orders, or general inquiries.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-sm border border-zinc-200 bg-white p-6">
            <h2 className="text-xl text-zinc-900">
              📱 WhatsApp
            </h2>
            <p className="mt-2 text-zinc-600">
              For quick questions and order support
            </p>
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-4 gap-2 bg-green-600 text-white hover:bg-green-700"
            >
              <span>Chat on WhatsApp</span>
              <span>→</span>
            </a>
          </div>

          <div className="rounded-sm border border-zinc-200 bg-white p-6">
            <h2 className="text-xl text-zinc-900">
              📧 Email
            </h2>
            <p className="mt-2 text-zinc-600">
              For detailed inquiries and support
            </p>
            <a
              href="mailto:support@coovi.com"
              className="mt-4 inline-block font-medium text-brand hover:text-brand-dark"
            >
              support@coovi.com
            </a>
          </div>

          <div className="rounded-sm border border-zinc-200 bg-white p-6">
            <h2 className="text-xl text-zinc-900">
              📦 Order Tracking
            </h2>
            <p className="mt-2 text-zinc-600">
              Check your order status anytime
            </p>
            <Link
              href="/track-order"
              className="btn btn-primary mt-4 gap-2"
            >
              <span>Track Your Order</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-8">
          <h2 className="text-2xl text-zinc-900">
            Business Hours
          </h2>
          <p className="mt-4 text-zinc-700">
            Saturday - Thursday: 10:00 AM - 8:00 PM (Bangladesh Time)
          </p>
          <p className="mt-1 text-zinc-700">
            Friday: Closed
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            We typically respond within 24 hours during business days.
          </p>
        </div>
      </div>
    </main>
  );
}
