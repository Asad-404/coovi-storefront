import { describe, expect, it } from "vitest";
import { formatPrice } from "./utils";

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
