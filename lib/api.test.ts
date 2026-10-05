import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getDeliveryFee,
  getOrderByNumber,
  getProductBySlug,
  getProducts,
  postOrder,
} from "./api";

const API_URL = "http://localhost:5000/api";
const TIMEOUT_MESSAGE = "Request timed out. Please check your connection and try again.";

const fetchMock = vi.fn();

function respond(body: unknown, status = 200) {
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );
}

function rejectWith(name: string) {
  fetchMock.mockRejectedValueOnce(new DOMException("aborted", name));
}

const requestedUrl = () => fetchMock.mock.calls[0][0] as string;
const requestInit = () => fetchMock.mock.calls[0][1] as RequestInit;

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

describe("getProducts", () => {
  const pagination = { page: 1, limit: 12, total: 1, pages: 1, hasMore: false };

  it("requests /products without a query string by default", async () => {
    respond({ data: [{ _id: "p1" }], pagination });
    const result = await getProducts();
    expect(requestedUrl()).toBe(`${API_URL}/products`);
    expect(requestInit().signal).toBeInstanceOf(AbortSignal);
    expect(result).toEqual({ data: [{ _id: "p1" }], pagination });
  });

  it("passes search, sort, page and limit as query params", async () => {
    respond({ data: [], pagination });
    await getProducts({ search: "soap", sort: "price_asc", page: 2, limit: 24 });
    const url = new URL(requestedUrl());
    expect(url.pathname).toBe("/api/products");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      search: "soap",
      sort: "price_asc",
      page: "2",
      limit: "24",
    });
  });

  it("throws with the status on a non-OK response", async () => {
    respond({ message: "boom" }, 500);
    await expect(getProducts()).rejects.toThrow("API request failed with status 500");
  });

  it("maps AbortError to a friendly message", async () => {
    rejectWith("AbortError");
    await expect(getProducts()).rejects.toThrow(TIMEOUT_MESSAGE);
  });

  it("maps a real timeout (TimeoutError) to a friendly message", async () => {
    rejectWith("TimeoutError");
    await expect(getProducts()).rejects.toThrow(TIMEOUT_MESSAGE);
  });

  it("rethrows other errors unchanged", async () => {
    const error = new TypeError("fetch failed");
    fetchMock.mockRejectedValueOnce(error);
    await expect(getProducts()).rejects.toBe(error);
  });
});

describe("getProductBySlug", () => {
  it("returns the product from /products/:slug", async () => {
    respond({ data: { _id: "p1", slug: "soap" } });
    await expect(getProductBySlug("soap")).resolves.toEqual({ _id: "p1", slug: "soap" });
    expect(requestedUrl()).toBe(`${API_URL}/products/soap`);
  });

  it("throws on 404", async () => {
    respond({ message: "Not found" }, 404);
    await expect(getProductBySlug("missing")).rejects.toThrow(
      "API request failed with status 404"
    );
  });

  it("maps AbortError to a friendly message", async () => {
    rejectWith("AbortError");
    await expect(getProductBySlug("soap")).rejects.toThrow(TIMEOUT_MESSAGE);
  });
});

describe("getDeliveryFee", () => {
  it("returns data.deliveryFee", async () => {
    respond({ data: { deliveryFee: 60 } });
    await expect(getDeliveryFee()).resolves.toBe(60);
    expect(requestedUrl()).toBe(`${API_URL}/orders/delivery-fee`);
  });

  it("throws on a non-OK response", async () => {
    respond({}, 503);
    await expect(getDeliveryFee()).rejects.toThrow("API request failed with status 503");
  });

  it("maps AbortError to a friendly message", async () => {
    rejectWith("AbortError");
    await expect(getDeliveryFee()).rejects.toThrow(TIMEOUT_MESSAGE);
  });
});

describe("getOrderByNumber", () => {
  it("sends the phone number as a query param", async () => {
    respond({ data: { orderNumber: "CV-1001" } });
    await expect(getOrderByNumber("CV-1001", "+8801700000000")).resolves.toEqual({
      orderNumber: "CV-1001",
    });
    const url = new URL(requestedUrl());
    expect(url.pathname).toBe("/api/orders/CV-1001");
    expect(url.searchParams.get("phone")).toBe("+8801700000000");
  });

  it("throws on a non-OK response", async () => {
    respond({}, 404);
    await expect(getOrderByNumber("CV-404", "017")).rejects.toThrow(
      "API request failed with status 404"
    );
  });

  it("maps AbortError to a friendly message", async () => {
    rejectWith("AbortError");
    await expect(getOrderByNumber("CV-1001", "017")).rejects.toThrow(TIMEOUT_MESSAGE);
  });
});

describe("postOrder", () => {
  const order = {
    customerName: "Rahim",
    phone: "01700000000",
    address: "Dhaka",
    notes: "Call first",
    items: [
      { productId: "p1", quantity: 2 },
      { productId: "p2", quantity: 1 },
    ],
  };

  it("POSTs JSON to /orders and returns the created order", async () => {
    respond({ success: true, data: { orderNumber: "CV-1001", total: 750 } });
    await expect(postOrder(order)).resolves.toEqual({ orderNumber: "CV-1001", total: 750 });
    expect(requestedUrl()).toBe(`${API_URL}/orders`);
    const init = requestInit();
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("sends only customer details and product IDs with quantities", async () => {
    respond({ success: true, data: {} });
    await postOrder(order);
    const body = JSON.parse(requestInit().body as string);
    expect(body).toEqual(order);
    for (const item of body.items) {
      expect(Object.keys(item).sort()).toEqual(["productId", "quantity"]);
    }
    expect(body).not.toHaveProperty("total");
    expect(body).not.toHaveProperty("subtotal");
    expect(body).not.toHaveProperty("deliveryFee");
  });

  it("throws the API message on a non-OK response", async () => {
    respond({ success: false, message: "Soap is out of stock" }, 400);
    await expect(postOrder(order)).rejects.toThrow("Soap is out of stock");
  });

  it("throws when the API reports success: false with a 200", async () => {
    respond({ success: false, message: "Invalid phone" });
    await expect(postOrder(order)).rejects.toThrow("Invalid phone");
  });

  it("falls back to a generic message", async () => {
    respond({ success: false }, 500);
    await expect(postOrder(order)).rejects.toThrow("Failed to place order");
  });

  it("maps AbortError to a friendly message", async () => {
    rejectWith("AbortError");
    await expect(postOrder(order)).rejects.toThrow(TIMEOUT_MESSAGE);
  });
});
