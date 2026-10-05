import { afterEach, describe, expect, it, vi } from "vitest";

async function loadSite() {
  vi.resetModules();
  return import("./site");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("SITE_URL", () => {
  it("falls back to localhost when NEXT_PUBLIC_SITE_URL is not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const { SITE_URL } = await loadSite();
    expect(SITE_URL).toBe("http://localhost:3000");
  });

  it("uses NEXT_PUBLIC_SITE_URL and strips trailing slashes", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://shop.example.com//");
    const { SITE_URL } = await loadSite();
    expect(SITE_URL).toBe("https://shop.example.com");
  });
});

describe("pageOpenGraph", () => {
  it("builds an Open Graph block that keeps the site name and locale", async () => {
    const { pageOpenGraph } = await loadSite();
    expect(pageOpenGraph("/shop", "Sarees | Coovi")).toEqual({
      url: "/shop",
      title: "Sarees | Coovi",
      type: "website",
      siteName: "Coovi",
      locale: "en_BD",
    });
  });

  it("lets a page add or override fields", async () => {
    const { pageOpenGraph } = await loadSite();
    expect(pageOpenGraph("/p", "P", { description: "d", images: ["a.jpg"] })).toMatchObject({
      description: "d",
      images: ["a.jpg"],
      siteName: "Coovi",
    });
  });
});
