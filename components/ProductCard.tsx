"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/types";
import { isOnSale } from "@/lib/utils";
import PriceTag from "@/components/PriceTag";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];
  const displayImage = isHovered && secondaryImage ? secondaryImage : primaryImage;
  const title = product.nameBn ? `${product.nameBn} – ${product.name}` : product.name;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-3/4 overflow-hidden bg-cream">
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

        {isOnSale(product) && product.inStock && (
          <span className="absolute left-2 top-2 bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Sale
          </span>
        )}

        {!product.inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-white/80 py-1.5 text-center text-xs font-medium text-ink">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 px-1 pt-3 text-center">
        <p className="text-[11px] uppercase tracking-wider text-zinc-600">{product.category}</p>
        <h3 className="text-sm font-semibold text-ink transition-colors group-hover:text-brand sm:text-base">
          {title}
        </h3>
        <PriceTag product={product} className="justify-center text-sm text-ink" />
      </div>
    </Link>
  );
}
