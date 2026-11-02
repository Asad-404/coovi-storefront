"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import PriceTag from "@/components/PriceTag";
import ProductTabs from "@/components/ProductTabs";
import { getProductBySlug } from "@/lib/api";
import type { Product } from "@/lib/types";
import { discountPercent, isAvailable, isOnSale, isPreorder, stockText } from "@/lib/utils";

type LiveFields = Pick<
  Product,
  "slug" | "price" | "compareAtPrice" | "stock" | "inStock" | "allowPreorder" | "preorderDays"
>;

const LiveProductContext = createContext<LiveFields | null>(null);

const useLiveProduct = () => useContext(LiveProductContext) as LiveFields;

// The product page is a saved copy that can be minutes old. It shows those numbers at once, then asks
// the API once for the current price and stock. If the API is asleep or fails, the saved numbers stay.
export function LiveProductProvider({ product, children }: { product: LiveFields; children: ReactNode }) {
  const [live, setLive] = useState(product);
  const { slug } = product;

  useEffect(() => {
    let current = true;
    getProductBySlug(slug)
      .then((fresh) => {
        if (current) setLive(fresh);
      })
      .catch(() => {});
    return () => {
      current = false;
    };
  }, [slug]);

  return <LiveProductContext.Provider value={live}>{children}</LiveProductContext.Provider>;
}

export function LivePrice() {
  const live = useLiveProduct();
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
  const live = useLiveProduct();
  const colour = isAvailable(live) ? "text-green-700" : isPreorder(live) ? "text-amber-700" : "text-red-600";
  return <dd className={colour}>{stockText(live)}</dd>;
}

export function LiveAddToCart({ product }: { product: { _id: string; slug: string; name: string; image: string } }) {
  const live = useLiveProduct();
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
  const live = useLiveProduct();
  return (
    <ProductTabs
      description={description}
      descriptionBn={descriptionBn}
      details={[...details, { label: "Availability", value: stockText(live) }]}
    />
  );
}
