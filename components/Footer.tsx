import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col items-center gap-5 px-4 py-14">
        <Logo size="lg" />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-700">
          <Link href="/shop" className="hover:text-brand">Saree</Link>
          <Link href="/sale" className="hover:text-brand">On Sale</Link>
          <Link href="/track-order" className="hover:text-brand">Track Order</Link>
          <Link href="/about" className="hover:text-brand">About</Link>
          <Link href="/contact" className="hover:text-brand">Contact</Link>
        </nav>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
          <Link href="/return-policy" className="hover:text-brand">Return &amp; Exchange</Link>
          <Link href="/delivery-policy" className="hover:text-brand">Delivery &amp; Payment</Link>
          <Link href="/privacy-policy" className="hover:text-brand">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand">Terms of Service</Link>
        </nav>
      </div>

      <div className="bg-brand py-7 text-center text-base font-medium text-white">
        © Copyright Coovi {new Date().getFullYear()}
      </div>
    </footer>
  );
}
