import { Order, Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const TIMEOUT_MS = 8000;

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

export async function getProducts(
  options: { search?: string; sort?: string; page?: number; limit?: number } = {}
): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.sort) params.set("sort", options.sort);
  if (options.page) params.set("page", options.page.toString());
  if (options.limit) params.set("limit", options.limit.toString());
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
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<Product> {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data as Product;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
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
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw error;
  }
}

export async function getOrderByNumber(orderNumber: string, phone: string): Promise<Order> {
  try {
    const params = new URLSearchParams({ phone });
    const res = await fetch(`${API_URL}/orders/${orderNumber}?${params}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data as Order;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
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
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw error;
  }
}
