import { describe, expect, it } from "vitest";
import { clientIpFrom } from "./clientIp";

describe("clientIpFrom", () => {
  it("prefers x-real-ip", () => {
    expect(clientIpFrom(new Headers({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "198.51.100.1" }))).toBe(
      "203.0.113.7"
    );
  });

  it("falls back to the first x-forwarded-for address", () => {
    expect(clientIpFrom(new Headers({ "x-forwarded-for": " 198.51.100.1 , 10.0.0.1" }))).toBe("198.51.100.1");
  });

  it("returns undefined without either header", () => {
    expect(clientIpFrom(new Headers())).toBeUndefined();
    expect(clientIpFrom(new Headers({ "x-forwarded-for": " " }))).toBeUndefined();
  });
});
