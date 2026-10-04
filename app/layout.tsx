import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Coovi - Premium Sarees Online",
  description: "Shop beautiful cotton, silk, and georgette sarees at Coovi.",
  openGraph: {
    title: "Coovi - Premium Sarees Online",
    description: "Shop beautiful cotton, silk, and georgette sarees at Coovi.",
    type: "website",
    locale: "en_US",
    siteName: "Coovi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coovi - Premium Sarees Online",
    description: "Shop beautiful cotton, silk, and georgette sarees at Coovi.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
