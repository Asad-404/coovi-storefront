import { beforeEach, describe, expect, it, vi } from "vitest";
import { getOrderOrNotFound } from "./orderLookup";

// Like the real notFound(), the mock throws, so the page never renders past it
const NOT_FOUND = new Error("NEXT_NOT_FOUND");
const notFound = vi.fn(() => {
  throw NOT_FOUND;
});
vi.mock("next/navigation", () => ({ notFound: () => notFound() }));

const fetchMock = vi.fn();

function respond(status: number, body: unknown = {}) {
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })
  );
}

beforeEach(() => {
  fetchMock.mockReset();
  notFound.mockClear();
  vi.stubGlobal("fetch", fetchMock);
});

describe("getOrderOrNotFound", () => {
  it("returns the order", async () => {
    respond(200, { data: { orderNumber: "K7M3QX", status: "Pending" } });
    await expect(getOrderOrNotFound("K7M3QX", "01712345678", "203.0.113.7")).resolves.toEqual({
      orderNumber: "K7M3QX",
      status: "Pending",
    });
  });

  it("shows the not-found page for an unknown order or the wrong phone", async () => {
    respond(404);
    await expect(getOrderOrNotFound("K7M3QX", "01700000000")).rejects.toBe(NOT_FOUND);
    expect(notFound).toHaveBeenCalledOnce();
  });

  it.each([500, 503, 429])("passes a %i on to the error page instead of saying the order is missing", async (status) => {
    respond(status);
    await expect(getOrderOrNotFound("K7M3QX", "01712345678")).rejects.toThrow(`status ${status}`);
    expect(notFound).not.toHaveBeenCalled();
  });

  it("passes a timeout on to the error page", async () => {
    fetchMock.mockRejectedValueOnce(new DOMException("timed out", "TimeoutError"));
    await expect(getOrderOrNotFound("K7M3QX", "01712345678")).rejects.toThrow("Request timed out");
    expect(notFound).not.toHaveBeenCalled();
  });

  it("passes a network failure on to the error page", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    await expect(getOrderOrNotFound("K7M3QX", "01712345678")).rejects.toThrow("fetch failed");
    expect(notFound).not.toHaveBeenCalled();
  });
});
