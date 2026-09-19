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

export async function getOrderByNumber(orderNumber: string): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${orderNumber}`);

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data as Order;
}
