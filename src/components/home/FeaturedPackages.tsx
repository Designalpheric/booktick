"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, MapPin, Star } from "lucide-react";
import { packages } from "@/data/packages";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { formatCurrency } from "@/lib/utils";
import { TravelPackage } from "@/types";

const categories = ["All", "National", "International", "Honeymoon", "Adventure", "Luxury"];

export default function FeaturedPackages() {
  const featured = packages.filter((p) => p.isFeatured).slice(0, 5);
  const hero = featured[0];
  const rest = featured.slice(1, 5);

  const [enquiryPkg, setEnquiryPkg] = useState<TravelPackage | null>(null);

  return (
    <>
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Centered header ── */}
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#1F8C9E" }}
            >
              Curated For You
            </p>
            <h2 className="font-extrabold leading-tight mb-4">
              <span
                className="font-heading block text-4xl sm:text-5xl"
                style={{ color: "#343434", fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                Expertly Crafted Travel
              </span>
              <span
                className="font-serif italic block text-5xl sm:text-6xl"
                style={{ color: "#1F8C9E", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.1 }}
              >
                Packages for Every Traveller
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Handpicked itineraries across India and the world — beaches, mountains, culture and adventure.
            </p>
          </div>

          {/* ── Category tabs ── */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="relative flex-1 overflow-hidden">
              <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/packages${cat !== "All" ? `?category=${cat === "National" ? "national" : cat.toLowerCase()}` : ""}`}
                    className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
                    style={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", color: "#374151" }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
              <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#FAF7F2] to-transparent pointer-events-none sm:hidden" />
            </div>
            <Link
              href="/packages"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold shrink-0 transition-opacity hover:opacity-70"
              style={{ color: "#1F8C9E" }}
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Bento grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr_1fr] gap-5 lg:auto-rows-fr">

            {/* ── Large hero card — spans both rows ── */}
            {hero && (
              <div
                onClick={() => setEnquiryPkg(hero)}
                className="relative lg:row-span-2 group cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                style={{
                  boxShadow:
                    "0 2px 4px rgba(20,20,20,0.04), 0 28px 48px -20px rgba(20,20,20,0.22)",
                  minHeight: 480,
                }}
              >
                <Image
                  src={hero.coverImage}
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
                  {hero.badge && (
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.88)", color: "#1f2937", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
                    >
                      {hero.badge}
                    </span>
                  )}
                  {hero.discount && (
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.88)", color: "#1f2937", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
                    >
                      {hero.discount}% OFF
                    </span>
                  )}
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
                    {hero.destination}, {hero.country}
                  </div>
                  <h3
                    className="text-white font-extrabold mb-1.5 leading-[1.05]"
                    style={{ fontSize: "clamp(28px, 3.6vw, 44px)", letterSpacing: "-0.02em" }}
                  >
                    {hero.title}
                  </h3>
                  <p className="text-white/80 text-sm mb-6 line-clamp-2">{hero.highlights[0]}</p>

                  <div className="flex items-end justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-white/60 text-xs mb-0.5">Starting from</p>
                      <p className="text-white text-3xl font-extrabold leading-none">
                        {formatCurrency(hero.priceFrom)}
                        <span className="text-sm font-normal text-white/65 ml-1">/ person</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnquiryPkg(hero);
                      }}
                      className="inline-flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
                      style={{ backgroundColor: "#f9cc72", color: "#5a3d00" }}
                    >
                      Enquire Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── 4 small cards (2 × 2) ── */}
            {rest.map((pkg) => (
              <div
                key={pkg.id}
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
                    src={pkg.coverImage}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 25vw"
                  />
                  {/* Category badge */}
                  <span
                    className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.88)",
                      color: "#1f2937",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                    }}
                  >
                    {pkg.category === "international" ? "International" : "National"}
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
                    <span className="text-gray-400">({pkg.reviewCount})</span>
                  </div>

                  <h3
                    className="font-bold text-base leading-snug mb-1 line-clamp-2"
                    style={{ color: "#343434" }}
                  >
                    {pkg.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-1 mb-4">
                    {pkg.highlights[0]}
                  </p>

                  {/* Bottom: price + CTA */}
                  <div
                    className="mt-auto pt-4 flex items-end justify-between gap-2"
                    style={{ borderTop: "1px solid rgba(20,20,20,0.07)" }}
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">From</p>
                      <p className="text-base font-extrabold leading-none" style={{ color: "#343434" }}>
                        {formatCurrency(pkg.priceFrom)}
                        <span className="text-[10px] font-normal text-gray-400 ml-1">/ person</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnquiryPkg(pkg)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all hover:opacity-80 active:scale-95"
                      style={{ backgroundColor: "rgba(31,140,158,0.12)", color: "#0d6677" }}
                    >
                      Enquire <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="text-center mt-12">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-sm font-bold px-8 py-3.5 rounded-full transition-all hover:opacity-80 active:scale-95"
              style={{ backgroundColor: "#daf0f3", color: "#0d6677", border: "1px solid #a8d8e2" }}
            >
              Browse All Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      {enquiryPkg && (
        <EnquiryModal
          isOpen={!!enquiryPkg}
          onClose={() => setEnquiryPkg(null)}
          prefillDestination={enquiryPkg.destination}
          prefillPackageOrFlight={enquiryPkg.title}
          enquiryType="package"
          title={`Enquire: ${enquiryPkg.title}`}
        />
      )}
    </>
  );
}
