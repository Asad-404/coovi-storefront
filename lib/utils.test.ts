import { describe, expect, it } from "vitest";
import { discountPercent, formatPrice, isOnSale } from "./utils";

describe("formatPrice", () => {
  it("prefixes the taka sign", () => {
    expect(formatPrice(250)).toBe("৳250");
  });

  it("groups thousands", () => {
    expect(formatPrice(1250)).toBe("৳1,250");
    expect(formatPrice(1234567)).toBe("৳1,234,567");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("৳0");
  });
});

describe("isOnSale", () => {
  it("is true when the original price is higher than the price", () => {
    expect(isOnSale({ price: 1500, compareAtPrice: 2000 })).toBe(true);
  });

  it("is false without an original price", () => {
    expect(isOnSale({ price: 1500 })).toBe(false);
  });

  it("is false when the original price is not higher", () => {
    expect(isOnSale({ price: 1500, compareAtPrice: 1500 })).toBe(false);
    expect(isOnSale({ price: 1500, compareAtPrice: 1000 })).toBe(false);
  });
});

describe("discountPercent", () => {
  it("rounds the percentage off the original price", () => {
    expect(discountPercent({ price: 2450, compareAtPrice: 2990 })).toBe(18);
    expect(discountPercent({ price: 1500, compareAtPrice: 2000 })).toBe(25);
  });

  it("is 0 when the product is not on sale", () => {
    expect(discountPercent({ price: 1500 })).toBe(0);
    expect(discountPercent({ price: 1500, compareAtPrice: 1500 })).toBe(0);
  });
});
