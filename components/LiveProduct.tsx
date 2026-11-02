"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import PriceTag from "@/components/PriceTag";
import ProductTabs from "@/components/ProductTabs";
import Skeleton from "@/components/Skeleton";
import { getProductBySlug } from "@/lib/api";
import type { Product } from "@/lib/types";
import { discountPercent, isAvailable, isOnSale, isPreorder, stockText } from "@/lib/utils";

type LiveFields = Pick<
  Product,
  "slug" | "price" | "compareAtPrice" | "stock" | "inStock" | "allowPreorder" | "preorderDays"
>;

// A sleeping API can take up to a minute to answer, which is too long to show nothing
const SKELETON_MAX_MS = 3000;

const LiveProductContext = createContext<{ live: LiveFields; ready: boolean } | null>(null);

const useLiveProduct = () => useContext(LiveProductContext) as { live: LiveFields; ready: boolean };

// The product page is a saved copy that can be minutes old, so price and stock wait behind a skeleton
// while the page asks the API once for the current numbers. If the API fails, or is slow to answer, the
// saved numbers show instead; a slow answer still replaces them when it arrives.
export function LiveProductProvider({ product, children }: { product: LiveFields; children: ReactNode }) {
  const [live, setLive] = useState(product);
  const [ready, setReady] = useState(false);
  const { slug } = product;

  useEffect(() => {
    let current = true;
    const showSaved = setTimeout(() => setReady(true), SKELETON_MAX_MS);
    getProductBySlug(slug)
      .then((fresh) => {
        if (current) setLive(fresh);
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(showSaved);
        if (current) setReady(true);
      });
    return () => {
      current = false;
      clearTimeout(showSaved);
    };
  }, [slug]);

  return <LiveProductContext.Provider value={{ live, ready }}>{children}</LiveProductContext.Provider>;
}

export function LivePrice() {
  const { live, ready } = useLiveProduct();
  if (!ready) return <Skeleton className="h-7 w-28" />;
  return (
    <>
      <PriceTag product={live} className="text-xl font-medium text-ink" />
      {isOnSale(live) && (
        <span className="rounded-sm bg-accent px-2.5 py-1 text-xs font-bold text-white">
          Save {discountPercent(live)}%
        </span>
      )}
    </>
  );
}

export function LiveStock() {
  const { live, ready } = useLiveProduct();
  if (!ready) {
    return (
      <dd>
        <Skeleton className="h-5 w-40" />
      </dd>
    );
  }
  const colour = isAvailable(live) ? "text-green-700" : isPreorder(live) ? "text-amber-700" : "text-red-600";
  return <dd className={colour}>{stockText(live)}</dd>;
}

// The button waits too: until stock is known it could turn out to say "Out of stock"
export function LiveAddToCart({ product }: { product: { _id: string; slug: string; name: string; image: string } }) {
  const { live, ready } = useLiveProduct();
  if (!ready) return <Skeleton className="h-13" />;
  const preorder = isPreorder(live);
  return (
    <AddToCartButton
      product={{ ...product, price: live.price }}
      inStock={isAvailable(live) || preorder}
      maxQuantity={live.stock}
      preorder={preorder}
    />
  );
}

export function LiveProductTabs({
  description,
  descriptionBn,
  details,
}: {
  description?: string;
  descriptionBn?: string;
  details: { label: string; value: string }[];
}) {
  const { live, ready } = useLiveProduct();
  return (
    <ProductTabs
      description={description}
      descriptionBn={descriptionBn}
      details={[...details, { label: "Availability", value: ready ? stockText(live) : "Checking stock..." }]}
    />
  );
}
