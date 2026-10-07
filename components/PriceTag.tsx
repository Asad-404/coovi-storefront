import type { Product } from "@/lib/types";
import { discountPercent, formatPrice, isOnSale } from "@/lib/utils";

export default function PriceTag({
  product,
  className = "",
}: {
  product: Pick<Product, "price" | "compareAtPrice">;
  className?: string;
}) {
  if (!isOnSale(product)) {
    return <span className={className}>{formatPrice(product.price)}</span>;
  }

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className="font-bold text-accent">{formatPrice(product.price)}</span>
      <s className="text-[0.85em] font-normal text-zinc-500">{formatPrice(product.compareAtPrice as number)}</s>
      <span className="hidden text-[0.75em] font-semibold text-accent sm:inline">-{discountPercent(product)}%</span>
    </span>
  );
}
