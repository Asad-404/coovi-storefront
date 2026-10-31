import Link from "next/link";

// A wrong phone and an unknown order number look the same, so neither reveals that an order exists
export default function OrderNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl text-zinc-900">
        We could not find that order
      </h1>
      <p className="text-zinc-600">
        Check the order number and the phone number you used at checkout, then try again.
      </p>
      <Link
        href="/track-order"
        className="btn btn-primary"
      >
        Try again
      </Link>
    </main>
  );
}
