// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import CheckoutPage from "./page";
import { getDeliveryOptions, getProductBySlug, postOrder } from "@/lib/api";
import { useCartStore } from "@/lib/cartStore";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));
vi.mock("@/lib/api", () => ({
  getDeliveryOptions: vi.fn(),
  getProductBySlug: vi.fn(),
  postOrder: vi.fn(),
}));
vi.mock("@/app/order-confirmation/actions", () => ({ rememberOrderPhone: vi.fn(async () => true) }));

const inside = () => screen.getByRole<HTMLInputElement>("radio", { name: /Inside Dhaka/ });
const outside = () => screen.getByRole<HTMLInputElement>("radio", { name: /Outside Dhaka/ });
const district = () => screen.getByRole<HTMLSelectElement>("combobox", { name: "District" });
const placeOrder = () => screen.getByRole("button", { name: /Place order/ });

function type(name: string | RegExp, value: string) {
  fireEvent.change(screen.getByRole("textbox", { name }), { target: { value } });
}

async function renderLoaded() {
  render(<CheckoutPage />);
  await waitFor(() => expect(inside().disabled).toBe(false));
}

beforeEach(() => {
  localStorage.clear();
  useCartStore.setState({
    items: [{ productId: "p1", slug: "jamdani", name: "Jamdani", price: 2000, image: "", quantity: 1 }],
  });
  vi.mocked(getDeliveryOptions).mockResolvedValue({
    zones: { inside_dhaka: 70, outside_dhaka: 130 },
    districts: ["Dhaka", "Sylhet"],
  });
  vi.mocked(getProductBySlug).mockRejectedValue(new Error("not needed"));
  vi.mocked(postOrder).mockResolvedValue({ orderNumber: "K7M3QX" } as Awaited<ReturnType<typeof postOrder>>);
});
afterEach(cleanup);

describe("CheckoutPage delivery area", () => {
  it("starts with no area chosen and no total, showing both fees", async () => {
    await renderLoaded();
    expect(inside().checked).toBe(false);
    expect(outside().checked).toBe(false);
    expect(inside().required).toBe(true);
    expect(placeOrder().textContent).toBe("Place order");
    expect(screen.getByText("৳70")).toBeTruthy();
    expect(screen.getByText("৳130")).toBeTruthy();
  });

  it("shows the total for the chosen area", async () => {
    await renderLoaded();
    fireEvent.click(outside());
    expect(placeOrder().textContent).toBe("Place order for ৳2,130");
  });

  it("sets the district to Dhaka when inside Dhaka is chosen", async () => {
    await renderLoaded();
    fireEvent.change(district(), { target: { value: "Sylhet" } });
    fireEvent.click(inside());
    expect(district().value).toBe("Dhaka");
    expect(inside().checked).toBe(true);
  });

  it("moves to outside Dhaka when another district is chosen", async () => {
    await renderLoaded();
    fireEvent.click(inside());
    fireEvent.change(district(), { target: { value: "Sylhet" } });
    expect(outside().checked).toBe(true);
    expect(placeOrder().textContent).toBe("Place order for ৳2,130");
  });

  it("keeps outside Dhaka for district Dhaka, for the suburbs", async () => {
    await renderLoaded();
    fireEvent.click(outside());
    fireEvent.change(district(), { target: { value: "Dhaka" } });
    expect(outside().checked).toBe(true);
    expect(district().value).toBe("Dhaka");
  });
});

describe("CheckoutPage order", () => {
  it("sends the joined address, district and area, with no prices", async () => {
    await renderLoaded();
    type("Full name", "Fatima Rahman");
    type(/^Phone number/, "01712345678");
    type("House and road", "House 12, Road 5");
    type("Area or thana", "Dhanmondi");
    fireEvent.click(inside());
    fireEvent.submit(placeOrder().closest("form") as HTMLFormElement);

    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(postOrder).toHaveBeenCalledWith({
      customerName: "Fatima Rahman",
      phone: "01712345678",
      address: "House 12, Road 5, Dhanmondi",
      district: "Dhaka",
      deliveryArea: "inside_dhaka",
      notes: undefined,
      items: [{ productId: "p1", quantity: 1 }],
    });
  });

  it("does not send an order with no area chosen", async () => {
    await renderLoaded();
    fireEvent.submit(placeOrder().closest("form") as HTMLFormElement);
    expect(postOrder).not.toHaveBeenCalled();
  });
});
