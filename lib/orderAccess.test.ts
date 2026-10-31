import { describe, expect, it } from "vitest";
import { isOrderNumber, isPhone, normalizeOrderNumber, orderPagePath, orderTrackingPath } from "./orderAccess";

describe("orderAccess", () => {
  it("normalizes order numbers the way they are stored", () => {
    expect(normalizeOrderNumber("  ord-20261013-k7m3qx ")).toBe("ORD-20261013-K7M3QX");
  });

  it("accepts real order numbers and rejects anything else", () => {
    expect(isOrderNumber("K7M3QX")).toBe(true);
    expect(isOrderNumber("ORD-20261013-K7M3QX")).toBe(true);
    expect(isOrderNumber("ORD-20261013-001")).toBe(true);
    expect(isOrderNumber("")).toBe(false);
    expect(isOrderNumber("ORD/../admin")).toBe(false);
    expect(isOrderNumber("A".repeat(41))).toBe(false);
  });

  it("accepts 11-digit mobile numbers starting with 01", () => {
    expect(isPhone("01712345678")).toBe(true);
    expect(isPhone("1712345678")).toBe(false);
    expect(isPhone("0171234567x")).toBe(false);
  });

  it("builds the order page path without the phone", () => {
    expect(orderPagePath("ORD-20261013-K7M3QX")).toBe("/order-confirmation/ORD-20261013-K7M3QX");
    expect(orderPagePath("a b")).toBe("/order-confirmation/a%20b");
  });

  it("builds the tracking page path without the phone", () => {
    expect(orderTrackingPath("K7M3QX")).toBe("/track-order/K7M3QX");
    expect(orderTrackingPath("a b")).toBe("/track-order/a%20b");
  });
});
