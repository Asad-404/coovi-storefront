// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import CartDrawer from "./CartDrawer";
import { useCartStore } from "@/lib/cartStore";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const soap = { productId: "p1", slug: "soap", name: "Jamdani", price: 4500, image: "" };

beforeEach(() => {
  localStorage.clear();
  useCartStore.setState({ items: [{ ...soap, quantity: 1 }] });
});
afterEach(cleanup);

describe("CartDrawer", () => {
  it("is inert while closed so Tab cannot reach its links", () => {
    render(<CartDrawer isOpen={false} onClose={() => {}} />);
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.closest("[inert]")).not.toBeNull();
  });

  it("is a labelled modal dialog when open and takes focus", () => {
    render(<CartDrawer isOpen onClose={() => {}} />);
    const dialog = screen.getByRole("dialog", { name: "Shopping Cart (1)" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.closest("[inert]")).toBeNull();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<CartDrawer isOpen onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("names the remove button after the item", () => {
    render(<CartDrawer isOpen onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove Jamdani" }));
    expect(useCartStore.getState().items).toEqual([]);
  });
});
