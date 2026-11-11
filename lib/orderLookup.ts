import { notFound } from "next/navigation";
import { getOrderByNumber, OrderNotFoundError } from "./api";
import type { Order } from "./types";

// Loads a guest's order for the order pages. Only a real miss (an unknown number or the
// wrong phone, which the API answers the same way) shows the not-found page. A timeout, a
// network error or the API being down or busy is thrown on, so the page's error boundary
// can offer a retry instead of telling the shopper their order does not exist.
export async function getOrderOrNotFound(orderNumber: string, phone: string, clientIp?: string): Promise<Order> {
  try {
    return await getOrderByNumber(orderNumber, phone, clientIp);
  } catch (error) {
    if (error instanceof OrderNotFoundError) notFound();
    throw error;
  }
}
