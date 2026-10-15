"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ORDER_PHONE_COOKIE,
  isOrderNumber,
  isPhone,
  normalizeOrderNumber,
  orderPagePath,
} from "@/lib/orderAccess";

const ONE_WEEK = 7 * 24 * 60 * 60;

// Remembers which phone opens this order, in this browser only. The order page still
// asks the API, which checks that the number and the phone belong together.
export async function rememberOrderPhone(orderNumber: string, phone: string): Promise<boolean> {
  const number = normalizeOrderNumber(String(orderNumber));
  const phoneValue = String(phone).trim();
  if (!isOrderNumber(number) || !isPhone(phoneValue)) return false;

  (await cookies()).set(ORDER_PHONE_COOKIE, phoneValue, {
    path: orderPagePath(number),
    maxAge: ONE_WEEK,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return true;
}

// The "enter your phone" form on an order page posts here, then lands back on that page
export async function openOrder(formData: FormData): Promise<void> {
  const orderNumber = normalizeOrderNumber(String(formData.get("orderNumber") ?? ""));
  await rememberOrderPhone(orderNumber, String(formData.get("phone") ?? ""));
  redirect(isOrderNumber(orderNumber) ? orderPagePath(orderNumber) : "/track-order");
}
