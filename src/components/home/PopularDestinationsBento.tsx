"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Clock, MapPin, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import EnquiryModal from "@/components/ui/EnquiryModal";

/* ── Featured showcase data ──────────────────────────────────────────────── */
const hero = {
  title: "Goa Beach Bliss",
  location: "Goa, India",
  tagline: "North & South Goa beaches",
  duration: "5 Days / 4 Nights",
  price: 18999,
  image:
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&h=1300&fit=crop",
  badges: ["Best Seller", "15% OFF"],
};

const small = [
  {
    title: "Kerala Backwaters & Hills",
    tagline: "Houseboat stay in Alleppey",
    category: "Domestic",
    duration: "7 Days / 6 Nights",
    rating: 4.8,
    reviews: 428,
    price: 32500,
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&h=500&fit=crop",
  },
  {
    title: "Dubai Luxury Escape",
    tagline: "Burj Khalifa (At the Top)",
    category: "International",
    duration: "6 Days / 5 Nights",
    rating: 4.9,
    reviews: 567,
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&h=500&fit=crop",
  },
  {
    title: "Thailand Adventure & Beaches",
    tagline: "Bangkok temples & street food",
    category: "International",
    duration: "7 Days / 6 Nights",
    rating: 4.7,
    reviews: 521,
    price: 48500,
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=700&h=500&fit=crop",
  },
  {
    title: "Maldives Overwater Villas",
    tagline: "Overwater bungalow experience",
    category: "International",
    duration: "5 Days / 4 Nights",
    rating: 5,
    reviews: 178,
    price: 120000,
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&h=500&fit=crop",
  },
];

/* ── Section ─────────────────────────────────────────────────────────────── */
export default function PopularDestinationsBento() {
  const [enquiryFor, setEnquiryFor] = useState<{ title: string; destination: string } | null>(null);

  return (
    <>
      <section className="py-14 xs:py-16 sm:py-20 bg-cream">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">

          {/* Header — left aligned */}
          <div className="mb-8 xs:mb-10">
            <h2
              className="font-heading text-2xl xs:text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl mb-3"
              style={{ color: "#343434", fontWeight: 700, letterSpacing: "-0.03em" }}
            >
              Popular Destinations
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Explore our most sought-after travel packages and locations.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr_1fr] gap-5 lg:auto-rows-fr">

            {/* ── Large hero card — left, spans both rows ── */}
            <div
              onClick={() => setEnquiryFor({ title: hero.title, destination: hero.location })}
              className="relative lg:row-span-2 group cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
              style={{
                boxShadow:
                  "0 2px 4px rgba(20,20,20,0.04), 0 28px 48px -20px rgba(20,20,20,0.22)",
                minHeight: 480,
              }}
            >
              <Image
                src={hero.image}
                alt={hero.title}
                fill
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Dark gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.10) 45%, rgba(8,15,30,0.85) 100%)",
                }}
              />

              {/* Top badges */}
              <div className="absolute top-5 left-5 flex gap-2 z-10">
                <span
                  className="text-white text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #2EBE7A 0%, #1F9A60 100%)" }}
                >
                  {hero.badges[0]}
                </span>
                <span
                  className="text-white text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #2EBE7A 0%, #1F9A60 100%)" }}
                >
                  {hero.badges[1]}
                </span>
              </div>

              {/* Top-right duration */}
              <div
                className="absolute top-5 right-5 z-10 inline-flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "rgba(15,20,35,0.65)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                {hero.duration}
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
                <div className="flex items-center gap-1.5 text-white/85 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  {hero.location}
                </div>
                <h3
                  className="text-white font-extrabold mb-1.5 leading-[1.05]"
                  style={{ fontSize: "clamp(28px, 3.6vw, 44px)", letterSpacing: "-0.02em" }}
                >
                  {hero.title}
                </h3>
                <p className="text-white/80 text-sm mb-6">{hero.tagline}</p>

                <div className="flex items-end justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-white/60 text-xs mb-0.5">Starting from</p>
                    <p className="text-white text-3xl font-extrabold leading-none">
                      {formatCurrency(hero.price)}
                      <span className="text-sm font-normal text-white/65 ml-1">/ person</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnquiryFor({ title: hero.title, destination: hero.location });
                    }}
                    className="inline-flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: "#F2A93B", color: "#343434" }}
                  >
                    Enquire Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── 4 small cards (2 × 2) ── */}
            {small.map((pkg) => (
              <div
                key={pkg.title}
                className="bg-white rounded-3xl overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1"
                style={{
                  boxShadow:
                    "0 1px 2px rgba(20,20,20,0.04), 0 18px 32px -16px rgba(20,20,20,0.18)",
                  border: "1px solid rgba(20,20,20,0.04)",
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: 175 }}>
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 25vw"
                  />
                  {/* Category badge */}
                  <span
                    className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background:
                        pkg.category === "International"
                          ? "linear-gradient(135deg, #4F6BFF 0%, #2541E8 100%)"
                          : "linear-gradient(135deg, #2EBE7A 0%, #1F9A60 100%)",
                    }}
                  >
                    {pkg.category}
                  </span>
                  {/* Duration pill */}
                  <div
                    className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(15,20,35,0.65)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                    }}
                  >
                    <Clock className="w-3 h-3" />
                    {pkg.duration}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs mb-2">
                    <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#F2A93B" }} />
                    <span className="font-bold" style={{ color: "#343434" }}>
                      {pkg.rating}
                    </span>
                    <span className="text-gray-400">({pkg.reviews})</span>
                  </div>

                  <h3
                    className="font-bold text-base leading-snug mb-1 line-clamp-2"
                    style={{ color: "#343434" }}
                  >
                    {pkg.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-1 mb-4">
                    {pkg.tagline}
                  </p>

                  {/* Bottom: price + CTA */}
                  <div
                    className="mt-auto pt-4 flex items-end justify-between gap-2"
                    style={{ borderTop: "1px solid rgba(20,20,20,0.07)" }}
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">From</p>
                      <p className="text-base font-extrabold leading-none" style={{ color: "#343434" }}>
                        {formatCurrency(pkg.price)}
                        <span className="text-[10px] font-normal text-gray-400 ml-1">/ person</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnquiryFor({ title: pkg.title, destination: pkg.title.split(" ")[0] })}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
                      style={{ backgroundColor: "#0E1424", color: "#ffffff" }}
                    >
                      Enquire <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry modal */}
      {enquiryFor && (
        <EnquiryModal
          isOpen={!!enquiryFor}
          onClose={() => setEnquiryFor(null)}
          prefillDestination={enquiryFor.destination}
          prefillPackageOrFlight={enquiryFor.title}
          enquiryType="package"
          title={`Enquire: ${enquiryFor.title}`}
        />
      )}
    </>
  );
}
