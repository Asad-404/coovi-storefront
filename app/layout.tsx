import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
