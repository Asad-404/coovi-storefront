"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ORDER_PHONE_COOKIE,
  isOrderNumber,
  isPhone,
  normalizeOrderNumber,
  orderPagePath,
  orderTrackingPath,
} from "@/lib/orderAccess";

const ONE_WEEK = 7 * 24 * 60 * 60;

// Remembers which phone opens this order, in this browser only. The page still asks
// the API, which checks that the number and the phone belong together.
async function rememberPhone(
  orderNumber: string,
  phone: string,
  pagePath: (orderNumber: string) => string,
): Promise<boolean> {
  const number = normalizeOrderNumber(String(orderNumber));
  const phoneValue = String(phone).trim();
  if (!isOrderNumber(number) || !isPhone(phoneValue)) return false;

  (await cookies()).set(ORDER_PHONE_COOKIE, phoneValue, {
    path: pagePath(number),
    maxAge: ONE_WEEK,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return true;
}

export async function rememberOrderPhone(orderNumber: string, phone: string): Promise<boolean> {
  return rememberPhone(orderNumber, phone, orderPagePath);
}

// The Track Order form posts here; the cookie is sent only to that order's tracking page
export async function rememberTrackingPhone(orderNumber: string, phone: string): Promise<boolean> {
  return rememberPhone(orderNumber, phone, orderTrackingPath);
}

// The "enter your phone" form on an order page posts here, then lands back on that page
export async function openOrder(formData: FormData): Promise<void> {
  const orderNumber = normalizeOrderNumber(String(formData.get("orderNumber") ?? ""));
  await rememberOrderPhone(orderNumber, String(formData.get("phone") ?? ""));
  redirect(isOrderNumber(orderNumber) ? orderPagePath(orderNumber) : "/track-order");
}
