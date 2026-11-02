// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LiveAddToCart, LivePrice, LiveProductProvider, LiveProductTabs, LiveStock } from "./LiveProduct";
import { getProductBySlug } from "@/lib/api";
import { useCartStore } from "@/lib/cartStore";

vi.mock("@/lib/api", () => ({ getProductBySlug: vi.fn() }));

const fetchLive = vi.mocked(getProductBySlug);

const saved = { slug: "red-saree", price: 2000, stock: 5, inStock: true };
const basics = { _id: "p1", slug: "red-saree", name: "Red saree", image: "/red.jpg" };

function renderPage() {
  render(
    <LiveProductProvider product={saved}>
      <LivePrice />
      <dl>
        <LiveStock />
      </dl>
      <LiveAddToCart product={basics} />
      <LiveProductTabs details={[{ label: "Category", value: "Silk" }]} />
    </LiveProductProvider>
  );
}

const answerWith = (fields: object) =>
  fetchLive.mockResolvedValueOnce({ ...saved, ...fields } as Awaited<ReturnType<typeof getProductBySlug>>);

beforeEach(() => {
  fetchLive.mockReset();
  useCartStore.setState({ items: [] });
});

afterEach(cleanup);

describe("LiveProduct", () => {
  it("shows the saved numbers first, then the live ones, from one request", async () => {
    answerWith({ price: 2500, stock: 2 });
    renderPage();
    expect(screen.getByText("৳2,000")).toBeTruthy();
    expect(screen.getByText("In stock (5 available)")).toBeTruthy();

    await waitFor(() => expect(screen.getByText("৳2,500")).toBeTruthy());
    expect(screen.getAllByText("In stock (2 available)").length).toBeGreaterThan(0);
    expect(fetchLive).toHaveBeenCalledTimes(1);
    expect(fetchLive).toHaveBeenCalledWith("red-saree");
  });

  it("keeps the saved numbers when the API fails", async () => {
    fetchLive.mockRejectedValueOnce(new Error("Request timed out"));
    renderPage();
    await waitFor(() => expect(fetchLive).toHaveBeenCalled());
    await Promise.resolve();
    expect(screen.getByText("৳2,000")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeTruthy();
  });

  it("stops the sale when the live stock has run out", async () => {
    answerWith({ stock: 0 });
    renderPage();
    const button = await screen.findByRole("button", { name: "Out of stock" });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getAllByText("Out of stock").length).toBeGreaterThan(1);
  });

  it("offers a pre-order when stock ran out and pre-orders are on", async () => {
    answerWith({ stock: 0, allowPreorder: true, preorderDays: 10 });
    renderPage();
    expect(await screen.findByRole("button", { name: "Pre-order" })).toBeTruthy();
    expect(screen.getAllByText("Pre-order, ships in about 10 days").length).toBeGreaterThan(0);
  });

  it("adds the item to the cart at the live price", async () => {
    answerWith({ price: 2500 });
    renderPage();
    await screen.findByText("৳2,500");
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    expect(useCartStore.getState().items[0]).toMatchObject({ productId: "p1", price: 2500, quantity: 1 });
  });

  it("lowers a chosen quantity that the live stock can no longer fill", async () => {
    let answer: (value: Awaited<ReturnType<typeof getProductBySlug>>) => void = () => {};
    fetchLive.mockReturnValueOnce(new Promise((resolve) => (answer = resolve)));
    renderPage();
    const more = screen.getByRole("button", { name: "Increase quantity" });
    fireEvent.click(more);
    fireEvent.click(more);
    fireEvent.click(more);

    answer({ ...saved, stock: 2 } as Awaited<ReturnType<typeof getProductBySlug>>);
    await waitFor(() => expect(screen.getAllByText("In stock (2 available)").length).toBeGreaterThan(0));
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("ignores an answer that arrives after leaving the page", async () => {
    let answer: (value: Awaited<ReturnType<typeof getProductBySlug>>) => void = () => {};
    fetchLive.mockReturnValueOnce(new Promise((resolve) => (answer = resolve)));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    renderPage();
    cleanup();
    answer({ ...saved, price: 9999 } as Awaited<ReturnType<typeof getProductBySlug>>);
    await Promise.resolve();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
