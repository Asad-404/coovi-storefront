"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];
  const displayImage = isHovered && secondaryImage ? secondaryImage : primaryImage;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            No image
          </div>
        )}

        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{product.name}</h3>
        {product.nameBn && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{product.nameBn}</p>
        )}
        <p className="mt-auto pt-2 text-lg font-semibold text-rose-700 dark:text-rose-400">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
