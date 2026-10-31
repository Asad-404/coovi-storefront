import type { CartItem, Order } from "./types";

// Meta (Facebook) Pixel: tells Meta which pages and sarees people look at, what goes in the cart and
// which orders are placed, so Facebook ads can be measured later. It runs in the browser only and is off
// until NEXT_PUBLIC_META_PIXEL_ID is set. No customer details (name, phone, address) are ever sent.

export const META_PIXEL_SCRIPT_URL = "https://connect.facebook.net/en_US/fbevents.js";
export const CURRENCY = "BDT";

// Orders this browser already reported, so a refresh of the order page doesn't count the sale twice
export const REPORTED_ORDERS_KEY = "coovi-pixel-orders";
const MAX_REPORTED_ORDERS = 50;

// A confirmation page opened later (an old link, another device) is a visit, not a new sale
export const PURCHASE_WINDOW_MS = 60 * 60 * 1000;

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

// The Pixel ID is a 15 or 16 digit number from Meta Events Manager; anything else turns the pixel off
export function pixelIdFrom(value: string | undefined): string | null {
  const id = (value ?? "").trim();
  return /^\d{8,20}$/.test(id) ? id : null;
}

export function metaPixelId(): string | null {
  return pixelIdFrom(process.env.NEXT_PUBLIC_META_PIXEL_ID);
}

// Meta's standard loader stub: calls made before fbevents.js arrives wait in a queue. The first call
// starts the pixel and sends the first PageView, so events from the page itself always come after it.
function pixel(): Fbq | null {
  const id = metaPixelId();
  if (!id || typeof window === "undefined") return null;
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = fbq;
    if (!window._fbq) window._fbq = fbq;
    // No automatic button and form scanning: Meta only gets the events below, never what is typed at checkout
    fbq("set", "autoConfig", false, id);
    fbq("init", id);
    fbq("track", "PageView");
  }
  return window.fbq;
}

export function startMetaPixel(): boolean {
  return pixel() !== null;
}

function track(event: string, params?: Record<string, unknown>, eventId?: string): boolean {
  const fbq = pixel();
  if (!fbq) return false;
  if (eventId) fbq("track", event, params, { eventID: eventId });
  else if (params) fbq("track", event, params);
  else fbq("track", event);
  return true;
}

// Moving to another page inside the site (the first page's PageView is sent when the pixel starts)
export function trackPageView(): boolean {
  return track("PageView");
}

export function trackViewContent(product: { _id: string; price: number }): boolean {
  return track("ViewContent", {
    content_ids: [product._id],
    content_type: "product",
    value: product.price,
    currency: CURRENCY,
  });
}

export function trackAddToCart(item: { productId: string; price: number }, quantity = 1): boolean {
  return track("AddToCart", {
    content_ids: [item.productId],
    content_type: "product",
    contents: [{ id: item.productId, quantity }],
    value: item.price * quantity,
    currency: CURRENCY,
  });
}

// Cart prices are only the browser's copy; good enough for ad reports, never used for the order
export function trackInitiateCheckout(items: CartItem[]): boolean {
  if (items.length === 0) return false;
  return track("InitiateCheckout", {
    content_ids: items.map((item) => item.productId),
    content_type: "product",
    contents: items.map((item) => ({ id: item.productId, quantity: item.quantity })),
    num_items: items.reduce((count, item) => count + item.quantity, 0),
    value: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    currency: CURRENCY,
  });
}

// Only what the Purchase event needs, so the order page never hands the customer's details to the pixel
export type PurchaseInfo = Pick<Order, "orderNumber" | "total" | "status" | "createdAt"> & {
  items: Pick<Order["items"][number], "productId" | "quantity">[];
};

function readReportedOrders(): string[] {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(REPORTED_ORDERS_KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function rememberReportedOrder(orderNumber: string, reported: string[]) {
  try {
    const next = [...reported, orderNumber].slice(-MAX_REPORTED_ORDERS);
    window.localStorage.setItem(REPORTED_ORDERS_KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage blocked: the order number as event ID still lets Meta drop repeats
  }
}

// Sent once per order, from the order page right after checkout. The total comes from the API.
export function trackPurchase(order: PurchaseInfo, now = Date.now()): boolean {
  if (!metaPixelId() || typeof window === "undefined") return false;
  if (order.status === "Cancelled") return false;
  const placedAt = Date.parse(order.createdAt);
  if (!Number.isFinite(placedAt) || now - placedAt > PURCHASE_WINDOW_MS) return false;

  const reported = readReportedOrders();
  if (reported.includes(order.orderNumber)) return false;

  track(
    "Purchase",
    {
      content_ids: order.items.map((item) => item.productId),
      content_type: "product",
      contents: order.items.map((item) => ({ id: item.productId, quantity: item.quantity })),
      num_items: order.items.reduce((count, item) => count + item.quantity, 0),
      value: order.total,
      currency: CURRENCY,
    },
    order.orderNumber
  );
  rememberReportedOrder(order.orderNumber, reported);
  return true;
}
