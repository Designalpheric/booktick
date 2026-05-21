import type { Metadata } from "next";
import { Instrument_Sans, Urbanist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatButton from "@/components/ui/WhatsAppFloatButton";

/* ── Brand Fonts ──────────────────────────────────────────────────────────── */
const instrumentSans = Instrument_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const urbanist = Urbanist({
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
    "Discover amazing travel packages, flights, and holiday deals with BookTick. Explore domestic and international destinations. Enquire today for the best travel experience.",
  keywords: [
    "travel packages",
    "holiday deals",
    "flights",
    "domestic tours",
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
      <body className={`${instrumentSans.variable} ${urbanist.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloatButton />
      </body>
    </html>
  );
}
