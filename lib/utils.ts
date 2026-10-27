import type { DeliveryArea, Product } from "./types";

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

// "৳70 in Dhaka city and ৳130 everywhere else in Bangladesh"
export function describeDeliveryFees(zones: Record<DeliveryArea, number>): string {
  return `${formatPrice(zones.inside_dhaka)} in Dhaka city and ${formatPrice(zones.outside_dhaka)} everywhere else in Bangladesh`;
}

// Facebook, Messenger and WhatsApp ignore price tags in a normal link preview, so the price and
// stock lead the description: "৳2,500 (was ৳3,000) · In stock · Cash on delivery across Bangladesh. <text>"
export function shareDescription(
  product: Pick<Product, "price" | "compareAtPrice" | "inStock" | "stock" | "allowPreorder" | "description">,
): string {
  const price = isOnSale(product)
    ? `${formatPrice(product.price)} (was ${formatPrice(product.compareAtPrice as number)})`
    : formatPrice(product.price);
  const stock = isAvailable(product) ? "In stock" : isPreorder(product) ? "Pre-order" : "Out of stock";
  const lead = `${price} · ${stock} · Cash on delivery across Bangladesh.`;
  const text = product.description?.trim();
  return (text ? `${lead} ${text}` : lead).slice(0, 200);
}

export interface ShareImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

// The uploaded 1200x630 share image, with its size so Facebook shows it on the very first share.
// Without one, the first product photo (its size is unknown, so none is sent)
export function shareImages(product: Pick<Product, "name" | "images" | "shareImage">): ShareImage[] {
  if (product.shareImage) return [{ url: product.shareImage, width: 1200, height: 630, alt: product.name }];
  return product.images.slice(0, 1).map((url) => ({ url, alt: product.name }));
}
