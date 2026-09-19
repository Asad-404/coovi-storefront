export const DELIVERY_FEE = 60;

export function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-US")}`;
}
