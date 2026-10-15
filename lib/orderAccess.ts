// The phone number unlocks a guest's order page, so it is kept out of the address
// bar: a URL ends up in browser history, hosting logs and links people share.
// Instead it goes into a cookie the browser only sends back to that one order's page.
export const ORDER_PHONE_COOKIE = "coovi_order_phone";

const PHONE_PATTERN = /^01[0-9]{9}$/;
// ORD-YYYYMMDD-XXXXXX (older orders end in -NNN)
const ORDER_NUMBER_PATTERN = /^[A-Z0-9-]{1,40}$/;

// Order numbers are stored upper-case and matched exactly
export function normalizeOrderNumber(orderNumber: string): string {
  return orderNumber.trim().toUpperCase();
}

export function isOrderNumber(orderNumber: string): boolean {
  return ORDER_NUMBER_PATTERN.test(orderNumber);
}

export function isPhone(phone: string): boolean {
  return PHONE_PATTERN.test(phone);
}

export function orderPagePath(orderNumber: string): string {
  return `/order-confirmation/${encodeURIComponent(orderNumber)}`;
}
