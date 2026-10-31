import { beforeEach, describe, expect, it, vi } from "vitest";

const set = vi.fn();
const redirect = vi.fn();
vi.mock("next/headers", () => ({ cookies: async () => ({ set }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => redirect(path) }));

const { openOrder, rememberOrderPhone, rememberTrackingPhone } = await import("./actions");

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

beforeEach(() => {
  set.mockClear();
  redirect.mockClear();
});

describe("rememberOrderPhone", () => {
  it("keeps the phone in a cookie sent only to that order's page", async () => {
    expect(await rememberOrderPhone(" ord-20261013-k7m3qx ", "01712345678")).toBe(true);
    expect(set).toHaveBeenCalledWith("coovi_order_phone", "01712345678", {
      path: "/order-confirmation/ORD-20261013-K7M3QX",
      maxAge: 604800,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
  });

  it("marks the cookie secure in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await rememberOrderPhone("ORD-20261013-K7M3QX", "01712345678");
    expect(set.mock.calls[0][2].secure).toBe(true);
    vi.unstubAllEnvs();
  });

  it("ignores a bad order number or phone", async () => {
    expect(await rememberOrderPhone("ORD/../x", "01712345678")).toBe(false);
    expect(await rememberOrderPhone("ORD-20261013-K7M3QX", "12345")).toBe(false);
    expect(set).not.toHaveBeenCalled();
  });
});

describe("rememberTrackingPhone", () => {
  it("keeps the phone in a cookie sent only to that order's tracking page", async () => {
    expect(await rememberTrackingPhone(" k7m3qx ", "01712345678")).toBe(true);
    expect(set.mock.calls[0][0]).toBe("coovi_order_phone");
    expect(set.mock.calls[0][1]).toBe("01712345678");
    expect(set.mock.calls[0][2].path).toBe("/track-order/K7M3QX");
  });

  it("ignores a bad order number or phone", async () => {
    expect(await rememberTrackingPhone("K7/../x", "01712345678")).toBe(false);
    expect(await rememberTrackingPhone("K7M3QX", "12345")).toBe(false);
    expect(set).not.toHaveBeenCalled();
  });
});

describe("openOrder", () => {
  it("remembers the phone and goes back to the order page", async () => {
    await openOrder(form({ orderNumber: "ORD-20261013-K7M3QX", phone: "01712345678" }));
    expect(set).toHaveBeenCalledOnce();
    expect(redirect).toHaveBeenCalledWith("/order-confirmation/ORD-20261013-K7M3QX");
  });

  it("sends a bad order number to the tracking page", async () => {
    await openOrder(form({ phone: "01712345678" }));
    expect(set).not.toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/track-order");
  });
});
