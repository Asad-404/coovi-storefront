import { Order, Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export async function getProducts(
  options: { search?: string; sort?: string } = {}
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (options.search) params.set("search", options.search);
  if (options.sort) params.set("sort", options.sort);
  const queryString = params.toString();

  const res = await fetch(`${API_URL}/products${queryString ? `?${queryString}` : ""}`);

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${slug}`);

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data as Product;
}

export async function getDeliveryFee(): Promise<number> {
  const res = await fetch(`${API_URL}/orders/delivery-fee`);

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data.deliveryFee as number;
}

export async function getOrderByNumber(orderNumber: string, phone: string): Promise<Order> {
  const params = new URLSearchParams({ phone });
  const res = await fetch(`${API_URL}/orders/${orderNumber}?${params}`);

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data as Order;
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
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? "Failed to place order");
  }
  return json.data as Order;
}
