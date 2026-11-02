// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LiveAddToCart, LivePrice, LiveProductProvider, LiveProductTabs, LiveStock } from "./LiveProduct";
import { getProductBySlug } from "@/lib/api";
import { useCartStore } from "@/lib/cartStore";

vi.mock("@/lib/api", () => ({ getProductBySlug: vi.fn() }));

type Fresh = Awaited<ReturnType<typeof getProductBySlug>>;

const fetchLive = vi.mocked(getProductBySlug);

const saved = { slug: "red-saree", price: 2000, stock: 5, inStock: true };
const basics = { _id: "p1", slug: "red-saree", name: "Red saree", image: "/red.jpg" };

function renderPage() {
  return render(
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

const answerWith = (fields: object) => fetchLive.mockResolvedValueOnce({ ...saved, ...fields } as Fresh);

// An API that answers only when the test says so
function holdAnswer() {
  let answer: (value: Fresh) => void = () => {};
  fetchLive.mockReturnValueOnce(new Promise((resolve) => (answer = resolve)));
  return (fields: object) => answer({ ...saved, ...fields } as Fresh);
}

beforeEach(() => {
  fetchLive.mockReset();
  useCartStore.setState({ items: [] });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("LiveProduct", () => {
  it("shows skeletons, then the live numbers, from one request", async () => {
    answerWith({ price: 2500, stock: 2 });
    const { container } = renderPage();
    expect(container.querySelectorAll(".animate-pulse").length).toBe(3);
    expect(screen.queryByText("৳2,000")).toBeNull();
    expect(screen.queryByRole("button", { name: "Add to cart" })).toBeNull();

    expect(await screen.findByText("৳2,500")).toBeTruthy();
    expect(screen.getAllByText("In stock (2 available)").length).toBeGreaterThan(0);
    expect(container.querySelector(".animate-pulse")).toBeNull();
    expect(fetchLive).toHaveBeenCalledTimes(1);
    expect(fetchLive).toHaveBeenCalledWith("red-saree");
  });

  it("shows the saved numbers when the API fails", async () => {
    fetchLive.mockRejectedValueOnce(new Error("Request timed out"));
    renderPage();
    expect(await screen.findByText("৳2,000")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeTruthy();
  });

  it("shows the saved numbers after 3 seconds, then updates when a slow answer arrives", async () => {
    vi.useFakeTimers();
    const answer = holdAnswer();
    const { container } = renderPage();

    act(() => vi.advanceTimersByTime(2999));
    expect(container.querySelectorAll(".animate-pulse").length).toBe(3);

    act(() => vi.advanceTimersByTime(1));
    expect(container.querySelector(".animate-pulse")).toBeNull();
    expect(screen.getByText("৳2,000")).toBeTruthy();

    await act(async () => answer({ price: 2500 }));
    expect(screen.getByText("৳2,500")).toBeTruthy();
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
    vi.useFakeTimers();
    const answer = holdAnswer();
    renderPage();
    act(() => vi.advanceTimersByTime(3000));

    const more = screen.getByRole("button", { name: "Increase quantity" });
    fireEvent.click(more);
    fireEvent.click(more);
    fireEvent.click(more);

    await act(async () => answer({ stock: 2 }));
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("ignores an answer that arrives after leaving the page", async () => {
    const answer = holdAnswer();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    renderPage();
    cleanup();
    answer({ price: 9999 });
    await waitFor(() => expect(fetchLive).toHaveBeenCalled());
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
