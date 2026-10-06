export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
export const SITE_NAME = "Coovi";
export const SITE_TAGLINE = "Handcrafted sarees, delivered across Bangladesh";
export const SITE_DESCRIPTION =
  "Shop handpicked cotton, silk and georgette sarees at Coovi. Cash on delivery anywhere in Bangladesh.";
export const BRAND_NAVY = "#0c2953";
export const BRAND_CYAN = "#06b5e4";

// Shop WhatsApp number in international format, digits only (8801XXXXXXXXX). The default is a placeholder.
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801700000000").replace(/\D/g, "");

export function whatsappUrl(message?: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

// Open Graph block for a page. A page-level openGraph replaces the layout's, so shared fields are repeated here.
export function pageOpenGraph(path: string, title: string, extra: Record<string, unknown> = {}) {
  return { url: path, title, type: "website" as const, siteName: SITE_NAME, locale: "en_BD", ...extra };
}
