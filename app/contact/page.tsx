import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - Coovi",
  description: "Get in touch with Coovi for questions about orders, products, or support.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
        Contact Us
      </h1>

      <div className="mt-8 space-y-8">
        <div>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            We're here to help! Reach out to us with any questions about our products,
            orders, or general inquiries.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              📱 WhatsApp
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              For quick questions and order support
            </p>
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
            >
              <span>Chat on WhatsApp</span>
              <span>→</span>
            </a>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              📧 Email
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              For detailed inquiries and support
            </p>
            <a
              href="mailto:support@coovi.com"
              className="mt-4 inline-block font-medium text-rose-700 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300"
            >
              support@coovi.com
            </a>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              📦 Order Tracking
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Check your order status anytime
            </p>
            <Link
              href="/track-order"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-800"
            >
              <span>Track Your Order</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Business Hours
          </h2>
          <p className="mt-4 text-zinc-700 dark:text-zinc-300">
            Saturday - Thursday: 10:00 AM - 8:00 PM (Bangladesh Time)
          </p>
          <p className="mt-1 text-zinc-700 dark:text-zinc-300">
            Friday: Closed
          </p>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            We typically respond within 24 hours during business days.
          </p>
        </div>
      </div>
    </main>
  );
}
