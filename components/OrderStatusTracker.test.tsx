// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import OrderStatusTracker from "./OrderStatusTracker";

afterEach(cleanup);

describe("OrderStatusTracker", () => {
  it("marks the order's current step", () => {
    render(<OrderStatusTracker status="Shipped" />);
    expect(screen.getByText("Your order is on the way to you.")).toBeTruthy();
    expect(screen.getByText("Shipped").closest("li")?.getAttribute("aria-current")).toBe("step");
    expect(screen.getByText("Delivered").closest("li")?.getAttribute("aria-current")).toBeNull();
  });

  it.each([
    ["Cancelled", "This order was cancelled."],
    ["Returned", "This order was not delivered and came back to us."],
  ] as const)("shows only the message for a %s order", (status, message) => {
    render(<OrderStatusTracker status={status} />);
    expect(screen.getByText(message)).toBeTruthy();
    expect(screen.queryByRole("list")).toBeNull();
  });
});
