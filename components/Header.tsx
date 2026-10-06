import Link from "next/link";
import CartBadge from "@/components/CartBadge";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import MobileMenu from "@/components/MobileMenu";
import { whatsappUrl } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Saree" },
  { href: "/sale", label: "On Sale" },
  { href: "/track-order", label: "Track Order" },
];

export default function Header() {
  return (
    <>
      <div className="hidden border-b border-zinc-100 bg-white text-sm text-zinc-700 md:block">
        <div className="mx-auto flex h-9 max-w-[1170px] items-center justify-between px-4">
          <p>Cash on delivery across Bangladesh</p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-semibold hover:text-brand"
          >
            Chat:
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25d366] text-white">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.1Z" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/95 backdrop-blur">
        <div className="grid h-[68px] grid-cols-[1fr_auto_1fr] items-center px-4 md:hidden">
          <div className="justify-self-start">
            <MobileMenu />
          </div>
          <Logo />
          <div className="justify-self-end">
            <CartBadge showTotal={false} />
          </div>
        </div>

        <div className="mx-auto hidden h-[90px] max-w-[1170px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:grid">
          <div className="justify-self-start">
            <Logo />
          </div>

          <nav className="flex items-center gap-6 text-sm font-semibold uppercase text-ink">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition-colors hover:text-brand">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4">
            <SearchBar />
            <span className="h-8 w-px bg-zinc-200" aria-hidden="true" />
            <CartBadge />
          </div>
        </div>
      </header>

      <div className="bg-brand py-3.5 text-center text-sm font-semibold text-white">
        Coovi Festive Collection
      </div>
    </>
  );
}
