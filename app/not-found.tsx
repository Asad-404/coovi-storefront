import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <p className="font-logo text-7xl font-black text-brand">
        404<span className="text-logo-dot">.</span>
      </p>
      <h1 className="text-3xl text-ink sm:text-4xl">We could not find that page</h1>
      <p className="max-w-md text-zinc-600">
        The link may be old, or the saree may no longer be available. Try our collection or head back to the home
        page.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/shop"
          className="btn btn-primary"
        >
          Browse sarees
        </Link>
        <Link
          href="/"
          className="btn btn-secondary"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
