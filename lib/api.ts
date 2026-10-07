import { Order, Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const TIMEOUT_MS = 8000;

// AbortSignal.timeout() rejects fetch with a TimeoutError; a manual abort
// rejects with an AbortError. Both mean the request never completed.
function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface ProductQuery {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  category?: string;
  onSale?: boolean;
}

// GET /api/products clamps `limit` to this; asking for more silently returns fewer products
export const MAX_PAGE_SIZE = 50;

export async function getProducts(options: ProductQuery = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.sort) params.set("sort", options.sort);
  if (options.page) params.set("page", options.page.toString());
  if (options.limit) params.set("limit", options.limit.toString());
  if (options.category) params.set("category", options.category);
  if (options.onSale) params.set("onSale", "true");
  const queryString = params.toString();

  try {
    const res = await fetch(`${API_URL}/products${queryString ? `?${queryString}` : ""}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = await res.json();
    return {
      data: json.data as Product[],
      pagination: json.pagination,
    };
  } catch (error) {
    if (isTimeoutError(error)) {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw error;
  }
}

// The first `count` products, fetched in API-sized pages so counts above MAX_PAGE_SIZE still arrive in full
export async function getFirstProducts(
  options: Omit<ProductQuery, "page" | "limit">,
  count: number
): Promise<ProductsResponse> {
  const limit = Math.min(count, MAX_PAGE_SIZE);
  const pageCount = Math.ceil(count / limit);
  const responses = await Promise.all(
    Array.from({ length: pageCount }, (_, i) => getProducts({ ...options, page: i + 1, limit }))
  );
  const data = responses.flatMap((response) => response.data).slice(0, count);
  const total = responses[0].pagination.total;
  return {
    data,
    pagination: { page: 1, limit: count, total, pages: Math.ceil(total / count), hasMore: count < total },
  };
}

// Every product (sitemap, llms.txt), walking the API's pages until it reports no more
export async function getAllProducts(maxPages = 100): Promise<Product[]> {
  const products: Product[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const response = await getProducts({ page, limit: MAX_PAGE_SIZE });
    products.push(...response.data);
    if (!response.pagination.hasMore) break;
  }
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product> {
  try {
    const res = await fetch(`${API_URL}/products/${encodeURIComponent(slug)}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data as Product;
  } catch (error) {
    if (isTimeoutError(error)) {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw error;
  }
}

export async function getDeliveryFee(): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/orders/delivery-fee`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data.deliveryFee as number;
  } catch (error) {
    if (isTimeoutError(error)) {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw error;
  }
}

export async function getOrderByNumber(orderNumber: string, phone: string): Promise<Order> {
  try {
    const params = new URLSearchParams({ phone });
    const res = await fetch(`${API_URL}/orders/${encodeURIComponent(orderNumber)}?${params}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data as Order;
  } catch (error) {
    if (isTimeoutError(error)) {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw error;
  }
}

// The order body sends ONLY what the customer actually chose: who they are,
// where to deliver, and how many of each product. No prices, no totals —
// those belong to the server, which recomputes them from its own database.
export interface OrderInput {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: { productId: string; quantity: number }[];
}

export async function postOrder(order: OrderInput): Promise<Order> {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message ?? "Failed to place order");
    }
    return json.data as Order;
  } catch (error) {
    if (isTimeoutError(error)) {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw error;
  }
}
