import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/order-confirmation/",
    },
    sitemap: "https://coovi.com/sitemap.xml",
  };
}
