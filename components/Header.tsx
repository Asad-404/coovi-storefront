import { Suspense } from "react";
import Link from "next/link";
import CartBadge from "@/components/CartBadge";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import MobileMenu from "@/components/MobileMenu";
import { Announcement, AnnouncementFallback, ChatLink, ChatLinkFallback } from "@/components/HeaderSettings";
import { getShopSettings } from "@/lib/api";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/saree", label: "Saree" },
  { href: "/sale", label: "On sale" },
  { href: "/track-order", label: "Track order" },
];

export default function Header() {
  // Owner-editable from the admin Settings page; falls back to the old values if the API is down.
  // Not awaited: the header is above every loading skeleton, so waiting here would hold back the
  // whole page while the API wakes up. Only the two pieces that need the settings wait for them.
  const settings = getShopSettings();

  return (
    <>
      <div className="hidden border-b border-zinc-100 bg-white text-sm text-zinc-700 md:block">
        <div className="mx-auto flex h-9 max-w-292.5 items-center justify-between px-4">
          <p>Cash on delivery across Bangladesh</p>
          <Suspense fallback={<ChatLinkFallback />}>
            <ChatLink settings={settings} />
          </Suspense>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/95 backdrop-blur">
        <div className="grid h-17 grid-cols-[1fr_auto_1fr] items-center px-4 md:hidden">
          <div className="justify-self-start">
            <MobileMenu />
          </div>
          <Logo />
          <div className="justify-self-end">
            <CartBadge showTotal={false} />
          </div>
        </div>

        <div className="mx-auto hidden h-22.5 max-w-292.5 grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:grid">
          <div className="justify-self-start">
            <Logo />
          </div>

          <nav className="flex items-center gap-6 text-nav font-semibold text-ink">
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

      <Suspense fallback={<AnnouncementFallback />}>
        <Announcement settings={settings} />
      </Suspense>
    </>
  );
}
