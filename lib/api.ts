import { Order, Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`);

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

export async function getOrderByNumber(orderNumber: string): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${orderNumber}`);

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data as Order;
}
