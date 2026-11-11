// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductListingError from "./ProductListingError";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ProductListingError", () => {
  it("shows a human-readable error message", () => {
    render(<ProductListingError />);
    expect(screen.getByText(/could not load products/i)).toBeTruthy();
  });

  it("shows a Try again button", () => {
    render(<ProductListingError />);
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
  });

  it("calls router.refresh() when Try again is clicked", () => {
    render(<ProductListingError />);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("disables the button and changes its label while retrying", () => {
    render(<ProductListingError />);
    const btn = screen.getByRole("button", { name: "Try again" });
    fireEvent.click(btn);
    const retryBtn = screen.getByRole("button") as HTMLButtonElement;
    expect(retryBtn.disabled).toBe(true);
    expect(retryBtn.textContent).toContain("Loading");
  });
});
