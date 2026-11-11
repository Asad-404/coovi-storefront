// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import OrderConfirmationError from "./error";

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

afterEach(cleanup);

describe("OrderConfirmationError", () => {
  it("says the order could not be loaded, not that it is missing", () => {
    render(<OrderConfirmationError error={new Error("API request failed with status 503")} retry={() => {}} />);
    expect(screen.getByRole("heading").textContent).toBe("We couldn't load your order right now");
    expect(screen.queryByText(/not find|not found/i)).toBeNull();
  });

  it("fetches the order again on try again", () => {
    const retry = vi.fn();
    render(<OrderConfirmationError error={new Error("timed out")} retry={retry} />);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
