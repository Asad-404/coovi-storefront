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

// Orderable only when the admin has it switched on AND units remain: the API refuses an order
// for either reason, and stock reaching 0 does not flip the inStock switch by itself
export function isAvailable(product: Pick<Product, "inStock" | "stock">): boolean {
  return product.inStock && product.stock > 0;
}

// Out of stock but taking pre-orders: still orderable, and the API marks the line as a pre-order
export function isPreorder(product: Pick<Product, "inStock" | "stock" | "allowPreorder">): boolean {
  return product.inStock && product.stock <= 0 && product.allowPreorder === true;
}

// 15 days is the API's default wait when a product does not set its own
export function preorderText(days?: number): string {
  return `Pre-order, ships in about ${days ?? 15} days`;
}
