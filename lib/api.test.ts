import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAllProducts,
  getDeliveryFee,
  getFirstProducts,
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

  it("passes the category and onSale filters", async () => {
    respond({ data: [], pagination });
    await getProducts({ category: "Saree", onSale: true });
    expect(Object.fromEntries(new URL(requestedUrl()).searchParams)).toEqual({
      category: "Saree",
      onSale: "true",
    });
  });

  it("leaves onSale out when it is false", async () => {
    respond({ data: [], pagination });
    await getProducts({ onSale: false });
    expect(requestedUrl()).toBe(`${API_URL}/products`);
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

function productsPage(ids: string[], total: number, hasMore: boolean) {
  respond({
    data: ids.map((_id) => ({ _id })),
    pagination: { page: 1, limit: ids.length, total, pages: 1, hasMore },
  });
}

const requestedParams = (call: number) => new URL(fetchMock.mock.calls[call][0] as string).searchParams;

describe("getFirstProducts", () => {
  it("asks for one page when the count fits under the API's 50 cap", async () => {
    productsPage(["a", "b"], 30, true);
    const result = await getFirstProducts({ sort: "price-asc" }, 24);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(requestedParams(0).get("limit")).toBe("24");
    expect(requestedParams(0).get("page")).toBe("1");
    expect(requestedParams(0).get("sort")).toBe("price-asc");
    expect(result.pagination).toEqual({ page: 1, limit: 24, total: 30, pages: 2, hasMore: true });
  });

  it("splits counts above 50 into API-sized pages and trims to the count", async () => {
    const ids = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}${i}`);
    productsPage(ids("a", 50), 120, true);
    productsPage(ids("b", 50), 120, true);
    const result = await getFirstProducts({ onSale: true }, 60);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(requestedParams(1).get("page")).toBe("2");
    expect(requestedParams(1).get("limit")).toBe("50");
    expect(requestedParams(1).get("onSale")).toBe("true");
    expect(result.data).toHaveLength(60);
    expect(result.data[59]._id).toBe("b9");
    expect(result.pagination.hasMore).toBe(true);
  });

  it("reports no more products once the count covers the total", async () => {
    productsPage(["a"], 1, false);
    const result = await getFirstProducts({}, 12);
    expect(result.pagination.hasMore).toBe(false);
  });
});

describe("getAllProducts", () => {
  it("walks pages of 50 until the API reports no more", async () => {
    productsPage(["a", "b"], 3, true);
    productsPage(["c"], 3, false);
    const products = await getAllProducts();
    expect(products.map((p) => p._id)).toEqual(["a", "b", "c"]);
    expect(requestedParams(0).get("limit")).toBe("50");
    expect(requestedParams(1).get("page")).toBe("2");
  });

  it("stops at the page limit even if the API keeps reporting more", async () => {
    productsPage(["a"], 99, true);
    productsPage(["b"], 99, true);
    expect(await getAllProducts(2)).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
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

  it("encodes the order number into the path", async () => {
    respond({ data: { orderNumber: "A/B" } });
    await getOrderByNumber("A/B", "01712345678");
    expect(new URL(requestedUrl()).pathname).toBe("/api/orders/A%2FB");
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
