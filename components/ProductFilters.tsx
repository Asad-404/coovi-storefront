"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

const inputClass =
  "border border-zinc-300 bg-white px-3 py-2 text-sm text-ink placeholder-zinc-400 focus:border-brand focus:outline-none";

export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const onSalePage = pathname === "/sale";
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(currentSearch);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length >= 2) {
        try {
          const result = await getProducts({ search: search.trim(), limit: 5 });
          setSuggestions(result.data);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function pushParams(params: URLSearchParams) {
    const queryString = params.toString();
    // Filters and sorting always act on the page the shopper is on (/shop or /sale)
    const target = onSalePage ? "/sale" : "/shop";
    router.push(queryString ? `${target}?${queryString}` : target);
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    pushParams(params);
  }

  function handleSuggestionClick(productSlug: string) {
    setShowSuggestions(false);
    router.push(`/products/${productSlug}`);
  }

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (event.target.value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", event.target.value);
    }
    params.delete("page");
    pushParams(params);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div ref={wrapperRef} className="relative">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search sarees..."
            aria-label="Search products"
            className={`${inputClass} w-full sm:w-64`}
          />
          <button
            type="submit"
            className="bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Search
          </button>
        </form>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 top-full z-10 mt-1 w-full border border-zinc-200 bg-white shadow-lg sm:w-64">
            <ul className="py-1">
              {suggestions.map((product) => (
                <li key={product._id}>
                  <button
                    onClick={() => handleSuggestionClick(product.slug)}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-cream"
                  >
                    <span className="flex-1 truncate text-zinc-900">
                      {product.name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      ৳{product.price}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-600">
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
