// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState } from "react";
import { useDialog } from "./useDialog";

afterEach(cleanup);

function Harness({
  onClose = () => {},
  trapFocus,
  initialFocus,
  empty = false,
  detached = false,
}: {
  onClose?: () => void;
  trapFocus?: boolean;
  initialFocus?: boolean;
  empty?: boolean;
  detached?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDialog(
    open,
    () => {
      onClose();
      setOpen(false);
    },
    ref,
    { trapFocus, initialFocus }
  );

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <button>Outside</button>
      {open && !detached && (
        <div ref={ref} tabIndex={-1} data-testid="panel">
          {!empty && (
            <>
              <button>First</button>
              <button>Last</button>
            </>
          )}
        </div>
      )}
    </>
  );
}

function openDialog() {
  const opener = screen.getByText("Open");
  opener.focus();
  fireEvent.click(opener);
  return opener;
}

const tab = (shiftKey = false) => fireEvent.keyDown(document, { key: "Tab", shiftKey });

describe("useDialog", () => {
  it("moves focus to the first focusable element and locks page scroll", () => {
    render(<Harness />);
    document.body.style.overflow = "auto";
    openDialog();
    expect(document.activeElement).toBe(screen.getByText("First"));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes on Escape, restores scroll and returns focus to the opener", () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    document.body.style.overflow = "auto";
    const opener = openDialog();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("panel")).toBeNull();
    expect(document.body.style.overflow).toBe("auto");
    expect(document.activeElement).toBe(opener);
  });

  it("pads the page by the scrollbar width while open so it does not jump sideways", () => {
    const clientWidth = vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(window.innerWidth - 15);
    render(<Harness />);
    document.body.style.paddingRight = "";
    openDialog();
    expect(document.body.style.paddingRight).toBe("15px");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.body.style.paddingRight).toBe("");
    clientWidth.mockRestore();
  });

  it("adds no padding when the page has no scrollbar", () => {
    const clientWidth = vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(window.innerWidth);
    render(<Harness />);
    document.body.style.paddingRight = "";
    openDialog();
    expect(document.body.style.paddingRight).toBe("");
    clientWidth.mockRestore();
  });

  it("wraps Tab from the last element to the first", () => {
    render(<Harness />);
    openDialog();
    screen.getByText("Last").focus();
    tab();
    expect(document.activeElement).toBe(screen.getByText("First"));
  });

  it("wraps Shift+Tab from the first element to the last", () => {
    render(<Harness />);
    openDialog();
    tab(true);
    expect(document.activeElement).toBe(screen.getByText("Last"));
  });

  it("leaves Tab alone between inner elements", () => {
    render(<Harness />);
    openDialog();
    const event = new KeyboardEvent("keydown", { key: "Tab", cancelable: true });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it("pulls focus back in when it has escaped the dialog", () => {
    render(<Harness />);
    openDialog();
    screen.getByText("Outside").focus();
    tab();
    expect(document.activeElement).toBe(screen.getByText("First"));
    screen.getByText("Outside").focus();
    tab(true);
    expect(document.activeElement).toBe(screen.getByText("Last"));
  });

  it("keeps focus on the container when it has nothing focusable", () => {
    render(<Harness empty />);
    openDialog();
    const panel = screen.getByTestId("panel");
    expect(document.activeElement).toBe(panel);
    const event = new KeyboardEvent("keydown", { key: "Tab", cancelable: true });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("does not trap focus or move it when both options are off", () => {
    render(<Harness trapFocus={false} initialFocus={false} />);
    const opener = openDialog();
    expect(document.activeElement).toBe(opener);
    const event = new KeyboardEvent("keydown", { key: "Tab", cancelable: true });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it("ignores other keys", () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    openDialog();
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("copes with a container that is not mounted", () => {
    const onClose = vi.fn();
    render(<Harness detached onClose={onClose} />);
    openDialog();
    const event = new KeyboardEvent("keydown", { key: "Tab", cancelable: true });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not try to restore focus when nothing had focus", () => {
    render(<Harness />);
    const spy = vi.spyOn(document, "activeElement", "get").mockReturnValue(null);
    fireEvent.click(screen.getByText("Open"));
    spy.mockRestore();
    expect(() => fireEvent.keyDown(document, { key: "Escape" })).not.toThrow();
    expect(screen.queryByTestId("panel")).toBeNull();
  });
});
