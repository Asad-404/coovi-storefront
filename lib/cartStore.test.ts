// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { cartCount, cartTotal, useCartStore } from "./cartStore";
import { CartItem } from "./types";

const soap = { productId: "p1", slug: "soap", name: "Soap", price: 120, image: "/soap.jpg" };
const oil = { productId: "p2", slug: "oil", name: "Oil", price: 450, image: "/oil.jpg" };

const items = () => useCartStore.getState().items;

beforeEach(() => {
  localStorage.clear();
  useCartStore.setState({ items: [] });
});

describe("useCartStore", () => {
  it("adds a new item with quantity 1", () => {
    useCartStore.getState().addItem(soap);
    expect(items()).toEqual([{ ...soap, quantity: 1 }]);
  });

  it("increments quantity when the same product is added again", () => {
    useCartStore.getState().addItem(soap);
    useCartStore.getState().addItem(oil);
    useCartStore.getState().addItem(soap);
    expect(items()).toEqual([
      { ...soap, quantity: 2 },
      { ...oil, quantity: 1 },
    ]);
  });

  it("removes an item", () => {
    useCartStore.getState().addItem(soap);
    useCartStore.getState().addItem(oil);
    useCartStore.getState().removeItem("p1");
    expect(items()).toEqual([{ ...oil, quantity: 1 }]);
  });

  it("sets a quantity", () => {
    useCartStore.getState().addItem(soap);
    useCartStore.getState().updateQuantity("p1", 5);
    expect(items()).toEqual([{ ...soap, quantity: 5 }]);
  });

  it.each([0, -1])("removes the item when quantity is set to %i", (quantity) => {
    useCartStore.getState().addItem(soap);
    useCartStore.getState().addItem(oil);
    useCartStore.getState().updateQuantity("p1", quantity);
    expect(items()).toEqual([{ ...oil, quantity: 1 }]);
  });

  it("ignores updates for products not in the cart", () => {
    useCartStore.getState().addItem(soap);
    useCartStore.getState().updateQuantity("missing", 3);
    expect(items()).toEqual([{ ...soap, quantity: 1 }]);
  });

  it("clears the cart", () => {
    useCartStore.getState().addItem(soap);
    useCartStore.getState().addItem(oil);
    useCartStore.getState().clearCart();
    expect(items()).toEqual([]);
  });

  it("persists the cart to localStorage under coovi-cart", () => {
    useCartStore.getState().addItem(soap);
    const stored = JSON.parse(localStorage.getItem("coovi-cart")!);
    expect(stored.state.items).toEqual([{ ...soap, quantity: 1 }]);
  });
});

describe("cart totals", () => {
  const cart: CartItem[] = [
    { ...soap, quantity: 2 },
    { ...oil, quantity: 3 },
  ];

  it("sums price × quantity", () => {
    expect(cartTotal(cart)).toBe(120 * 2 + 450 * 3);
  });

  it("counts units, not lines", () => {
    expect(cartCount(cart)).toBe(5);
  });

  it("returns 0 for an empty cart", () => {
    expect(cartTotal([])).toBe(0);
    expect(cartCount([])).toBe(0);
  });
});
