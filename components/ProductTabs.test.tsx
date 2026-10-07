// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ProductTabs from "./ProductTabs";

afterEach(cleanup);

const details = [{ label: "Category", value: "Cotton" }];

describe("ProductTabs", () => {
  it("opens on the description and links the panel to its tab", () => {
    render(<ProductTabs description="Soft cotton" descriptionBn="নরম সুতি" details={details} />);
    const tab = screen.getByRole("tab", { name: "Description" });
    expect(tab.getAttribute("aria-selected")).toBe("true");
    const panel = screen.getByRole("tabpanel", { name: "Description" });
    expect(panel.textContent).toContain("Soft cotton");
    expect(screen.getByText("নরম সুতি").getAttribute("lang")).toBe("bn");
  });

  it("keeps only the active tab in the Tab order", () => {
    render(<ProductTabs details={details} />);
    const tabIndexes = screen.getAllByRole("tab").map((tab) => tab.getAttribute("tabindex"));
    expect(tabIndexes).toEqual(["-1", "0", "-1"]);
  });

  it("moves between tabs with the arrow keys, Home and End", () => {
    render(<ProductTabs details={details} />);
    const [care, description, extra] = screen.getAllByRole("tab");

    fireEvent.keyDown(description, { key: "ArrowRight" });
    expect(document.activeElement).toBe(extra);
    expect(screen.getByRole("tabpanel").textContent).toContain("Cotton");

    fireEvent.keyDown(extra, { key: "ArrowRight" });
    expect(document.activeElement).toBe(care);
    expect(screen.getByRole("tabpanel").textContent).toContain("Saree care guide");

    fireEvent.keyDown(care, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(extra);

    fireEvent.keyDown(extra, { key: "Home" });
    expect(document.activeElement).toBe(care);

    fireEvent.keyDown(care, { key: "End" });
    expect(document.activeElement).toBe(extra);

    fireEvent.keyDown(extra, { key: "ArrowUp" });
    expect(document.activeElement).toBe(description);

    fireEvent.keyDown(description, { key: "ArrowDown" });
    expect(document.activeElement).toBe(extra);
  });

  it("ignores other keys and switches on click", () => {
    render(<ProductTabs details={details} />);
    const description = screen.getByRole("tab", { name: "Description" });
    fireEvent.keyDown(description, { key: "Enter" });
    expect(description.getAttribute("aria-selected")).toBe("true");

    fireEvent.click(screen.getByRole("tab", { name: "Care guide" }));
    expect(screen.getByRole("tabpanel", { name: "Care guide" })).toBeTruthy();
  });

  it("says when there is no description", () => {
    render(<ProductTabs details={details} />);
    expect(screen.getByText("No description has been added for this saree yet.")).toBeTruthy();
  });
});
