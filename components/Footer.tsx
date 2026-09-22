import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center sm:px-6">
        <p className="font-semibold tracking-widest text-rose-700 dark:text-rose-400">COOVI</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Beautiful sarees, delivered across Bangladesh.</p>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/about" className="hover:text-rose-700 dark:hover:text-rose-400">
            About
          </Link>
          <Link href="/contact" className="hover:text-rose-700 dark:hover:text-rose-400">
            Contact
          </Link>
          <Link href="/track-order" className="hover:text-rose-700 dark:hover:text-rose-400">
            Track Order
          </Link>
        </nav>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">© {new Date().getFullYear()} Coovi. A learning project.</p>
      </div>
    </footer>
  );
}
