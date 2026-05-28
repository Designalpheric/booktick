import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import DealsSection from "@/components/home/DealsSection";
import WhyUs from "@/components/home/WhyUs";
import ReasonsSection from "@/components/home/ReasonsSection";
import PhotoGallery from "@/components/home/PhotoGallery";
import CustomerReviews from "@/components/home/CustomerReviews";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import EnquiryCTA from "@/components/home/EnquiryCTA";

export const metadata: Metadata = {
  title: "BookTick — Travel Packages, Flights & Holiday Deals",
  description:
    "Discover amazing travel packages, flights, and holiday deals. Explore Goa, Kerala, Dubai, Bali, Maldives and more. Enquire now for personalised travel assistance.",
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <PopularDestinations />
      <DealsSection />
      <WhyUs />
      <PhotoGallery />
      <FeaturedPackages />
      <MarqueeStrip />
      <ReasonsSection />
      <CustomerReviews />
      <EnquiryCTA />
    </>
  );
}
