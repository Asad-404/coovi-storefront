import type { Product } from "./types";

export function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-US")}`;
}

export function isOnSale(product: Pick<Product, "price" | "compareAtPrice">): boolean {
  return product.compareAtPrice != null && product.compareAtPrice > product.price;
}

export function discountPercent(product: Pick<Product, "price" | "compareAtPrice">): number {
  if (!isOnSale(product)) return 0;
  return Math.round((1 - product.price / (product.compareAtPrice as number)) * 100);
}
