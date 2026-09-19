import Link from "next/link";
import CartBadge from "@/components/CartBadge";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-widest text-rose-700 dark:text-rose-400">
          COOVI
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link href="/" className="hover:text-rose-700 dark:hover:text-rose-400">
            Shop
          </Link>
          <CartBadge />
        </nav>
      </div>
    </header>
  );
}
