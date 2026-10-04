"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductFilters({ total, shown }: { total: number; shown: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (event.target.value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", event.target.value);
    }
    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }

  return (
    <div className="mb-8 flex flex-col gap-3 text-sm text-ink sm:flex-row sm:items-center sm:gap-8">
      <label className="flex items-center gap-2">
        <span className="sr-only">Sort products</span>
        <select
          value={searchParams.get("sort") ?? "newest"}
          onChange={handleSortChange}
          className="w-56 border-b border-zinc-300 bg-white py-2 pr-6 text-sm focus:border-brand focus:outline-none"
        >
          <option value="newest">Sort by latest</option>
          <option value="price-asc">Sort by price: low to high</option>
          <option value="price-desc">Sort by price: high to low</option>
          <option value="name-asc">Sort by name: A to Z</option>
          <option value="name-desc">Sort by name: Z to A</option>
        </select>
      </label>
      <p className="font-medium">
        {shown >= total ? `Showing all ${total} results` : `Showing 1–${shown} of ${total} results`}
      </p>
    </div>
  );
}
