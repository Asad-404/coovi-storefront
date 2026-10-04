import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const privatePaths = ["/cart", "/checkout", "/track-order", "/order-confirmation/"];

// Search and AI crawlers are welcome on the public shop; private order pages are off limits to everyone.
const crawlers = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privatePaths },
      ...crawlers.map((userAgent) => ({ userAgent, allow: "/", disallow: privatePaths })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
