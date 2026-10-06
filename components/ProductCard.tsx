"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/types";
import { isAvailable, isOnSale } from "@/lib/utils";
import { useCartStore } from "@/lib/cartStore";
import PriceTag from "@/components/PriceTag";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];
  const displayImage = isHovered && secondaryImage ? secondaryImage : primaryImage;
  const available = isAvailable(product);

  function handleAdd() {
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: primaryImage ?? "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="group flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-3/4 overflow-hidden bg-mist">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              No image
            </div>
          )}

          {isOnSale(product) && available && (
            <span className="absolute left-2 top-2 bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Sale
            </span>
          )}

          {!available && (
            <span className="absolute inset-x-0 bottom-0 bg-white/80 py-1.5 text-center text-xs font-medium text-ink">
              Out of stock
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 px-1 pt-3 text-center">
          <h3 className="flex flex-col gap-0.5 text-ink transition-colors group-hover:text-brand">
            {product.nameBn && (
              <span lang="bn" className="font-display text-xl leading-snug sm:text-2xl">
                {product.nameBn}
              </span>
            )}
            <span className={product.nameBn ? "text-sm text-zinc-600" : "font-display text-lg leading-snug sm:text-xl"}>
              {product.name}
            </span>
          </h3>
          <PriceTag product={product} className="justify-center text-sm text-ink" />
        </div>
      </Link>

      {available ? (
        <button
          type="button"
          onClick={handleAdd}
          className="btn btn-secondary mt-3 py-2.5 md:opacity-0 md:transition-opacity md:focus:opacity-100 md:group-hover:opacity-100"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      ) : (
        <Link
          href={`/products/${product.slug}`}
          className="btn btn-secondary mt-3 py-2.5 md:opacity-0 md:transition-opacity md:focus:opacity-100 md:group-hover:opacity-100"
        >
          View details
        </Link>
      )}
    </div>
  );
}
