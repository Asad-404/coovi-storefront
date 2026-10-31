// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));
vi.mock("next/script", () => ({
  default: (props: { id: string; src: string }) => <script data-testid={props.id} data-src={props.src} />,
}));

import MetaPixel from "./MetaPixel";
import { TrackPurchase, TrackViewContent } from "./MetaPixelEvents";
import { META_PIXEL_SCRIPT_URL } from "@/lib/metaPixel";

function tracked(): unknown[][] {
  return (window.fbq?.queue ?? [])
    .map((args) => Array.from(args as unknown[]))
    .filter((args) => args[0] === "track");
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789012345");
  navigation.pathname = "/";
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  delete window.fbq;
  delete window._fbq;
  window.localStorage.clear();
});

describe("MetaPixel", () => {
  it("renders nothing while no Pixel ID is set", () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    const { container } = render(<MetaPixel />);
    expect(container.innerHTML).toBe("");
    expect(window.fbq).toBeUndefined();
  });

  it("loads Meta's script and sends one PageView per page", () => {
    const { getByTestId, rerender } = render(<MetaPixel />);
    expect(getByTestId("meta-pixel").dataset.src).toBe(META_PIXEL_SCRIPT_URL);
    expect(tracked()).toEqual([["track", "PageView"]]);

    rerender(<MetaPixel />);
    expect(tracked()).toHaveLength(1);

    navigation.pathname = "/saree";
    rerender(<MetaPixel />);
    expect(tracked()).toEqual([
      ["track", "PageView"],
      ["track", "PageView"],
    ]);
  });
});

describe("TrackViewContent", () => {
  it("sends one ViewContent per product", () => {
    const { rerender } = render(<TrackViewContent productId="p1" price={2500} />);
    rerender(<TrackViewContent productId="p1" price={2500} />);
    rerender(<TrackViewContent productId="p2" price={900} />);
    expect(tracked().filter((args) => args[1] === "ViewContent").map((args) => (args[2] as { content_ids: string[] }).content_ids)).toEqual([
      ["p1"],
      ["p2"],
    ]);
  });
});

describe("TrackPurchase", () => {
  it("sends the Purchase once for a new order", () => {
    const order = {
      orderNumber: "ORD-20261020-ABC234",
      total: 5120,
      status: "Pending" as const,
      createdAt: new Date().toISOString(),
      items: [{ productId: "p1", quantity: 2 }],
    };
    render(<TrackPurchase order={order} />);
    cleanup();
    render(<TrackPurchase order={order} />);
    expect(tracked().filter((args) => args[1] === "Purchase")).toHaveLength(1);
  });
});
