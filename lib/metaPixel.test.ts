// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PURCHASE_WINDOW_MS,
  REPORTED_ORDERS_KEY,
  metaPixelId,
  pixelIdFrom,
  startMetaPixel,
  trackAddToCart,
  trackInitiateCheckout,
  trackPageView,
  trackPurchase,
  trackViewContent,
  type PurchaseInfo,
} from "./metaPixel";

const PIXEL_ID = "123456789012345";
const NOW = Date.parse("2026-10-20T10:00:00Z");

const order: PurchaseInfo = {
  orderNumber: "ORD-20261020-ABC234",
  total: 5120,
  status: "Pending",
  createdAt: "2026-10-20T09:59:00Z",
  items: [
    { productId: "p1", quantity: 2 },
    { productId: "p2", quantity: 1 },
  ],
};

// Each call the pixel queued, without the internal arguments wrapper
function calls(): unknown[][] {
  return (window.fbq?.queue ?? []).map((args) => Array.from(args as unknown[]));
}

function eventCalls(): unknown[][] {
  return calls().filter((args) => args[0] === "track" && args[1] !== "PageView");
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", PIXEL_ID);
});

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.fbq;
  delete window._fbq;
  window.localStorage.clear();
});

describe("pixelIdFrom", () => {
  it("accepts a numeric ID and trims spaces", () => {
    expect(pixelIdFrom(` ${PIXEL_ID} `)).toBe(PIXEL_ID);
  });

  it("turns the pixel off for a missing or malformed ID", () => {
    expect(pixelIdFrom(undefined)).toBeNull();
    expect(pixelIdFrom("")).toBeNull();
    expect(pixelIdFrom("12345")).toBeNull();
    expect(pixelIdFrom("123');alert(1)//")).toBeNull();
  });

  it("reads NEXT_PUBLIC_META_PIXEL_ID", () => {
    expect(metaPixelId()).toBe(PIXEL_ID);
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    expect(metaPixelId()).toBeNull();
  });
});

describe("without a Pixel ID", () => {
  beforeEach(() => vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", ""));

  it("sends nothing and loads no pixel", () => {
    expect(startMetaPixel()).toBe(false);
    expect(trackPageView()).toBe(false);
    expect(trackViewContent({ _id: "p1", price: 2500 })).toBe(false);
    expect(trackPurchase(order, NOW)).toBe(false);
    expect(window.fbq).toBeUndefined();
  });
});

describe("starting the pixel", () => {
  it("turns off automatic scanning, starts the pixel and sends the first PageView once", () => {
    expect(startMetaPixel()).toBe(true);
    expect(startMetaPixel()).toBe(true);
    expect(calls()).toEqual([
      ["set", "autoConfig", false, PIXEL_ID],
      ["init", PIXEL_ID],
      ["track", "PageView"],
    ]);
    expect(window._fbq).toBe(window.fbq);
  });

  it("hands calls to Meta's script once it has loaded", () => {
    startMetaPixel();
    const callMethod = vi.fn();
    window.fbq!.callMethod = callMethod;
    trackPageView();
    expect(callMethod).toHaveBeenCalledWith("track", "PageView");
  });

  it("keeps an existing _fbq", () => {
    const other = (() => {}) as unknown as NonNullable<Window["_fbq"]>;
    window._fbq = other;
    startMetaPixel();
    expect(window._fbq).toBe(other);
  });

  it("sends later PageViews for moves inside the site", () => {
    trackPageView();
    expect(calls().filter((args) => args[1] === "PageView")).toHaveLength(2);
  });
});

describe("shopping events", () => {
  it("ViewContent carries the product id and price in BDT", () => {
    trackViewContent({ _id: "p1", price: 2500 });
    expect(eventCalls()).toEqual([
      ["track", "ViewContent", { content_ids: ["p1"], content_type: "product", value: 2500, currency: "BDT" }],
    ]);
  });

  it("AddToCart values the quantity added", () => {
    trackAddToCart({ productId: "p1", price: 2500 }, 2);
    trackAddToCart({ productId: "p2", price: 900 });
    expect(eventCalls()).toEqual([
      [
        "track",
        "AddToCart",
        { content_ids: ["p1"], content_type: "product", contents: [{ id: "p1", quantity: 2 }], value: 5000, currency: "BDT" },
      ],
      [
        "track",
        "AddToCart",
        { content_ids: ["p2"], content_type: "product", contents: [{ id: "p2", quantity: 1 }], value: 900, currency: "BDT" },
      ],
    ]);
  });

  it("InitiateCheckout sums the cart and skips an empty one", () => {
    expect(trackInitiateCheckout([])).toBe(false);
    trackInitiateCheckout([
      { productId: "p1", slug: "a", name: "A", price: 2500, image: "", quantity: 2 },
      { productId: "p2", slug: "b", name: "B", price: 900, image: "", quantity: 1 },
    ]);
    expect(eventCalls()).toEqual([
      [
        "track",
        "InitiateCheckout",
        {
          content_ids: ["p1", "p2"],
          content_type: "product",
          contents: [
            { id: "p1", quantity: 2 },
            { id: "p2", quantity: 1 },
          ],
          num_items: 3,
          value: 5900,
          currency: "BDT",
        },
      ],
    ]);
  });
});

describe("trackPurchase", () => {
  it("sends the API's total with the order number as event ID", () => {
    expect(trackPurchase(order, NOW)).toBe(true);
    expect(eventCalls()).toEqual([
      [
        "track",
        "Purchase",
        {
          content_ids: ["p1", "p2"],
          content_type: "product",
          contents: [
            { id: "p1", quantity: 2 },
            { id: "p2", quantity: 1 },
          ],
          num_items: 3,
          value: 5120,
          currency: "BDT",
        },
        { eventID: order.orderNumber },
      ],
    ]);
  });

  it("counts an order only once in this browser", () => {
    expect(trackPurchase(order, NOW)).toBe(true);
    expect(trackPurchase(order, NOW)).toBe(false);
    expect(eventCalls()).toHaveLength(1);
    expect(JSON.parse(window.localStorage.getItem(REPORTED_ORDERS_KEY)!)).toEqual([order.orderNumber]);
  });

  it("keeps only the latest 50 order numbers", () => {
    const old = Array.from({ length: 50 }, (_, i) => `ORD-OLD-${i}`);
    window.localStorage.setItem(REPORTED_ORDERS_KEY, JSON.stringify(old));
    trackPurchase(order, NOW);
    const saved = JSON.parse(window.localStorage.getItem(REPORTED_ORDERS_KEY)!);
    expect(saved).toHaveLength(50);
    expect(saved.at(-1)).toBe(order.orderNumber);
    expect(saved[0]).toBe("ORD-OLD-1");
  });

  it("ignores unreadable saved data", () => {
    window.localStorage.setItem(REPORTED_ORDERS_KEY, "not json");
    expect(trackPurchase(order, NOW)).toBe(true);
    window.localStorage.setItem(REPORTED_ORDERS_KEY, JSON.stringify({ a: 1 }));
    expect(trackPurchase({ ...order, orderNumber: "ORD-2" }, NOW)).toBe(true);
    window.localStorage.setItem(REPORTED_ORDERS_KEY, JSON.stringify([1, "ORD-3"]));
    expect(trackPurchase({ ...order, orderNumber: "ORD-3" }, NOW)).toBe(false);
  });

  it("still sends when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(trackPurchase(order, NOW)).toBe(true);
  });

  it("skips old, undated and cancelled orders", () => {
    expect(trackPurchase(order, Date.parse(order.createdAt) + PURCHASE_WINDOW_MS + 1)).toBe(false);
    expect(trackPurchase({ ...order, createdAt: "unknown" }, NOW)).toBe(false);
    expect(trackPurchase({ ...order, status: "Cancelled" }, NOW)).toBe(false);
    expect(eventCalls()).toHaveLength(0);
  });

  it("uses the current time by default", () => {
    expect(trackPurchase({ ...order, createdAt: new Date().toISOString() })).toBe(true);
  });
});
