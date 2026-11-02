// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ShopSettings } from "@/lib/types";
import Header from "./Header";
import { Announcement, AnnouncementFallback, ChatLink, ChatLinkFallback } from "./HeaderSettings";

const { getShopSettings } = vi.hoisted(() => ({ getShopSettings: vi.fn() }));
vi.mock("@/lib/api", () => ({ getShopSettings }));
vi.mock("@/components/CartBadge", () => ({ default: () => null }));
vi.mock("@/components/MobileMenu", () => ({ default: () => null }));
vi.mock("@/components/SearchBar", () => ({ default: () => null }));

const saved: ShopSettings = {
  whatsappNumber: "8801712345678",
  supportPhone: "",
  announcementText: "Eid sale",
  announcementActive: true,
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Header", () => {
  it("does not wait for the settings, so a sleeping API cannot hold back the whole page", () => {
    getShopSettings.mockReturnValue(new Promise(() => {}));
    expect(Header()).not.toBeInstanceOf(Promise);
  });

  it("asks for the settings once", () => {
    getShopSettings.mockReturnValue(new Promise(() => {}));
    Header();
    expect(getShopSettings).toHaveBeenCalledTimes(1);
  });
});

describe("Announcement", () => {
  it("shows the saved text", async () => {
    render(await Announcement({ settings: Promise.resolve(saved) }));
    expect(screen.getByRole("link", { name: "Eid sale" }).getAttribute("href")).toBe("/saree");
  });

  it.each([
    [{ ...saved, announcementActive: false }],
    [{ ...saved, announcementText: "" }],
  ])("shows nothing when off or empty", async (settings) => {
    const { container } = render(await Announcement({ settings: Promise.resolve(settings) }));
    expect(container.textContent).toBe("");
  });

  it("stand-in takes the same space as the real strip", async () => {
    const { container: real } = render(await Announcement({ settings: Promise.resolve(saved) }));
    const { container: standIn } = render(<AnnouncementFallback />);
    const sizing = (el: Element) => el.className.split(" ").filter((c) => /^(block|py-|text-sm|font-)/.test(c));
    expect(sizing(standIn.firstElementChild!)).toEqual(sizing(real.firstElementChild!));
    expect(standIn.textContent).not.toBe("");
  });
});

describe("Chat link", () => {
  it("uses the saved number", async () => {
    render(await ChatLink({ settings: Promise.resolve(saved) }));
    expect(screen.getByRole("link").getAttribute("href")).toBe("https://wa.me/8801712345678");
  });

  it("stand-in goes to the contact page, never to a guessed number", () => {
    render(<ChatLinkFallback />);
    expect(screen.getByRole("link").getAttribute("href")).toBe("/contact");
  });
});
