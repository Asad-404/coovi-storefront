"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const inputClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-rose-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(currentSearch);

  function pushParams(params: URLSearchParams) {
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    pushParams(params);
  }

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (event.target.value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", event.target.value);
    }
    pushParams(params);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search sarees..."
          aria-label="Search products"
          className={`${inputClass} w-full sm:w-64`}
        />
        <button
          type="submit"
          className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-800"
        >
          Search
        </button>
      </form>

      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        Sort by
        <select
          value={searchParams.get("sort") ?? "newest"}
          onChange={handleSortChange}
          className={inputClass}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </label>
    </div>
  );
}
