"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSubmit(event: React.FormEvent) {
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
        aria-label="Search sarees"
        aria-expanded={open}
        className="text-ink transition-colors hover:text-brand"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="absolute inset-x-0 top-full z-30 border-b border-zinc-200 bg-white px-4 py-4 shadow-md"
        >
          <div className="mx-auto flex max-w-[1170px] gap-2">
            <input
              ref={inputRef}
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search sarees by name..."
              aria-label="Search sarees"
              className="flex-1 rounded-sm border border-zinc-300 px-4 py-2.5 text-sm focus:border-brand"
            />
            <button type="submit" className="btn btn-primary px-6 py-2.5">
              Search
            </button>
          </div>
        </form>
      )}
    </>
  );
}
