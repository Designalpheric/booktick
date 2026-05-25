import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Inter, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTABanner from "@/components/layout/CTABanner";
import WhatsAppFloatButton from "@/components/ui/WhatsAppFloatButton";

/* ── Brand Fonts ──────────────────────────────────────────────────────────────
   Display: Fraunces — italic-capable serif for emotive headlines
   Heading: Instrument Sans — geometric clarity for section titles
   Body:    Inter — workhorse readability
────────────────────────────────────────────────────────────────────────────── */
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BookTick — Travel Packages, Flights & Holiday Deals",
    template: "%s | BookTick Travel",
  },
  description:
    "Discover amazing travel packages, flights, and holiday deals with BookTick. Explore national and international destinations. Enquire today for the best travel experience.",
  keywords: [
    "travel packages",
    "holiday deals",
    "flights",
    "national tours",
    "international tours",
    "Goa",
    "Kerala",
    "Dubai",
    "Bali",
    "Maldives",
    "travel agency India",
  ],
  authors: [{ name: "BookTick Travel" }],
  creator: "BookTick Travel",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "BookTick Travel",
    title: "BookTick — Travel Packages, Flights & Holiday Deals",
    description:
      "Explore handcrafted travel packages and flight options. No direct booking — enquire via WhatsApp or our form for personalised travel assistance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookTick — Travel Packages & Flights",
    description: "Discover amazing travel packages and flight options.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${inter.variable} antialiased`}>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main>{children}</main>
        <CTABanner />
        <Footer />
        <WhatsAppFloatButton />
      </body>
    </html>
  );
}
