import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Nunito, Tiro_Bangla } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BRAND_NAVY, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// Nunito is only for the Coovi wordmark; it has no Bengali letters
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["900"],
});

// Only the ৳ sign, cut from Hind Siliguri (licence in fonts/OFL.txt), so a price does not pull a whole
// Bengali font file. One file per weight that prices use. Keep adjustFontFallback off: its fallback face
// has no unicode-range, and being next in the stack it would take every other character.
const taka = localFont({
  variable: "--font-taka",
  src: [
    { path: "./fonts/taka-400.woff2", weight: "400" },
    { path: "./fonts/taka-500.woff2", weight: "500" },
    { path: "./fonts/taka-600.woff2", weight: "600" },
    { path: "./fonts/taka-700.woff2", weight: "700" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+09F3" }],
  adjustFontFallback: false,
});

// Headings and English saree names: one weight only, so never pair it with a bold class.
// Only Latin is preloaded; SolaimanLipi comes first in the stack, so its Bengali files never load.
const tiroBangla = Tiro_Bangla({
  variable: "--font-tiro-bangla",
  subsets: ["latin"],
  weight: "400",
});

// All Bengali text (licence in fonts/SolaimanLipi-LICENSE.txt): one weight only, so the browser fakes bold Bengali.
// Not preloaded, so the file loads only when a page shows Bengali text; the range skips ৳ so a price alone never pulls it.
// Keep adjustFontFallback off, as for taka.
const solaimanLipi = localFont({
  variable: "--font-solaiman-lipi",
  src: "./fonts/solaiman-lipi.woff2",
  weight: "400",
  declarations: [{ prop: "unicode-range", value: "U+0964-0965, U+0980-09F2, U+09F4-09FF, U+200C-200D" }],
  preload: false,
  adjustFontFallback: false,
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_BD",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_NAVY,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${taka.variable} ${hindSiliguri.variable} ${tiroBangla.variable} ${solaimanLipi.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
