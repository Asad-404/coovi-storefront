import { describe, expect, it } from "vitest";
import {
  describeDeliveryFees,
  discountPercent,
  formatPrice,
  isAvailable,
  isOnSale,
  isPreorder,
  preorderText,
  shareDescription,
  shareImages,
} from "./utils";

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

describe("isAvailable", () => {
  it("is true when switched on with units left", () => {
    expect(isAvailable({ inStock: true, stock: 3 })).toBe(true);
  });

  it("is false when the stock has run out, even if still switched on", () => {
    expect(isAvailable({ inStock: true, stock: 0 })).toBe(false);
  });

  it("is false when the admin switched it off, even with units left", () => {
    expect(isAvailable({ inStock: false, stock: 3 })).toBe(false);
  });
});

describe("isPreorder", () => {
  it("is true when out of stock, switched on and taking pre-orders", () => {
    expect(isPreorder({ inStock: true, stock: 0, allowPreorder: true })).toBe(true);
  });

  it("is false while units are left, so the saree sells from stock", () => {
    expect(isPreorder({ inStock: true, stock: 2, allowPreorder: true })).toBe(false);
  });

  it("is false when pre-orders are off or the product is switched off", () => {
    expect(isPreorder({ inStock: true, stock: 0 })).toBe(false);
    expect(isPreorder({ inStock: true, stock: 0, allowPreorder: false })).toBe(false);
    expect(isPreorder({ inStock: false, stock: 0, allowPreorder: true })).toBe(false);
  });
});

describe("preorderText", () => {
  it("names the wait, falling back to 15 days", () => {
    expect(preorderText(20)).toBe("Pre-order, ships in about 20 days");
    expect(preorderText()).toBe("Pre-order, ships in about 15 days");
  });
});

describe("describeDeliveryFees", () => {
  it("names both fees", () => {
    expect(describeDeliveryFees({ inside_dhaka: 70, outside_dhaka: 1300 })).toBe(
      "৳70 in Dhaka city and ৳1,300 everywhere else in Bangladesh"
    );
  });
});

describe("shareDescription", () => {
  const base = { price: 2500, inStock: true, stock: 3, allowPreorder: false };

  it("leads with price and stock, then the product text", () => {
    expect(shareDescription({ ...base, description: " Soft cotton saree. " })).toBe(
      "৳2,500 · In stock · Cash on delivery across Bangladesh. Soft cotton saree.",
    );
  });

  it("shows the original price of a product on sale", () => {
    expect(shareDescription({ ...base, compareAtPrice: 3000 })).toBe(
      "৳2,500 (was ৳3,000) · In stock · Cash on delivery across Bangladesh.",
    );
  });

  it("says pre-order or out of stock", () => {
    expect(shareDescription({ ...base, stock: 0, allowPreorder: true })).toMatch(/· Pre-order ·/);
    expect(shareDescription({ ...base, stock: 0 })).toMatch(/· Out of stock ·/);
  });

  it("keeps it to 200 characters", () => {
    expect(shareDescription({ ...base, description: "x".repeat(500) })).toHaveLength(200);
  });
});

describe("shareImages", () => {
  it("uses the uploaded share image with its size", () => {
    expect(shareImages({ name: "Red saree", images: ["https://a/1.jpg"], shareImage: "https://a/wide.jpg" })).toEqual([
      { url: "https://a/wide.jpg", width: 1200, height: 630, alt: "Red saree" },
    ]);
  });

  it("falls back to the first photo", () => {
    expect(shareImages({ name: "Red saree", images: ["https://a/1.jpg", "https://a/2.jpg"] })).toEqual([
      { url: "https://a/1.jpg", alt: "Red saree" },
    ]);
  });

  it("returns nothing when there is no photo", () => {
    expect(shareImages({ name: "Red saree", images: [] })).toEqual([]);
  });
});
