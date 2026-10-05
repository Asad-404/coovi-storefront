"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Saree" },
  { href: "/sale", label: "On Sale" },
  { href: "/track-order", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MobileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = term.trim();
    setOpen(false);
    router.push(trimmed ? `/shop?search=${encodeURIComponent(trimmed)}` : "/shop");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex items-center gap-2 text-xs font-bold uppercase text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
        Menu
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-30 max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-zinc-100 bg-white px-5 pb-6 pt-4 shadow-lg">
          <form onSubmit={handleSearch} className="mb-2 flex gap-2">
            <input
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search sarees..."
              aria-label="Search sarees"
              className="min-w-0 flex-1 rounded-sm border border-zinc-300 px-3 py-2.5 text-sm focus:border-brand"
            />
            <button type="submit" className="btn btn-primary px-4 py-2.5">
              Go
            </button>
          </form>
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-zinc-100 py-3.5 text-sm font-semibold uppercase text-ink hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
