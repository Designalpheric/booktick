"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Star } from "lucide-react";
import { packages } from "@/data/packages";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { formatCurrency } from "@/lib/utils";
import { TravelPackage } from "@/types";

const categories = ["All", "Domestic", "International", "Honeymoon", "Adventure", "Luxury"];

export default function FeaturedPackages() {
  const featured = packages.filter((p) => p.isFeatured).slice(0, 5);
  const hero = featured[0];
  const rest  = featured.slice(1, 5);

  const [enquiryPkg, setEnquiryPkg] = useState<TravelPackage | null>(null);

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Centered header ── */}
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#43C6D9" }}
            >
              Curated For You
            </p>
            <h2
              className="font-extrabold leading-tight mb-4"
            >
              <span
                className="block text-4xl sm:text-5xl"
                style={{ color: "#12004D" }}
              >
                Expertly Crafted Travel
              </span>
              <span className="block text-4xl sm:text-5xl text-gray-300 font-extrabold">
                Packages for Every Traveller
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Handpicked itineraries across India and the world — beaches, mountains, culture and adventure.
            </p>
          </div>

          {/* ── Category tabs ── */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/packages${cat !== "All" ? `?category=${cat.toLowerCase()}` : ""}`}
                  className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-gray-500 hover:text-white transition-all"
                  style={{}}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#12004D";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#12004D";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "";
                    (e.currentTarget as HTMLAnchorElement).style.color = "";
                  }}
                >
                  {cat}
                </Link>
              ))}
            </div>
            <Link
              href="/packages"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold shrink-0 transition-opacity hover:opacity-70"
              style={{ color: "#43C6D9" }}
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Bento grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr_1fr] gap-4" style={{ minHeight: 560 }}>

            {/* Large hero card — spans 2 rows on desktop */}
            {hero && (
              <div
                className="relative rounded-3xl overflow-hidden lg:row-span-2 cursor-pointer group"
                style={{ minHeight: 400 }}
                onClick={() => setEnquiryPkg(hero)}
              >
                {/* Photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.coverImage}
                  alt={hero.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Dark gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(12,0,55,0.90) 0%, rgba(12,0,55,0.35) 55%, transparent 100%)",
                  }}
                />

                {/* Badges — top left */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {hero.badge && (
                    <span
                      className="text-white text-xs font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: "#43C6D9" }}
                    >
                      {hero.badge}
                    </span>
                  )}
                  {hero.discount && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {hero.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Duration — top right */}
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {hero.duration}
                </div>

                {/* Content — bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-1.5 text-white/60 text-xs mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {hero.destination}, {hero.country}
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-1"
                  >
                    {hero.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{hero.highlights[0]}</p>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">Starting from</p>
                      <p className="text-white text-2xl font-extrabold leading-none">
                        {formatCurrency(hero.priceFrom)}
                        <span className="text-sm font-normal text-white/60 ml-1">/ person</span>
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shrink-0"
                      style={{ backgroundColor: "#F5B61A", color: "#12004D" }}
                    >
                      Enquire Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4 smaller cards — 2 × 2 on right */}
            {rest.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: "0 2px 20px rgba(18,0,77,0.08)", border: "1px solid rgba(18,0,77,0.06)" }}
                onClick={() => setEnquiryPkg(pkg)}
              >
                {/* Photo */}
                <div className="relative overflow-hidden" style={{ height: 155 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pkg.coverImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${
                        pkg.category === "international" ? "bg-blue-500" : "bg-green-500"
                      }`}
                    >
                      {pkg.category === "international" ? "International" : "Domestic"}
                    </span>
                  </div>
                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {pkg.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs mb-2">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-gray-800">{pkg.rating}</span>
                    <span className="text-gray-400">({pkg.reviewCount})</span>
                  </div>

                  <h3
                    className="font-bold text-base leading-snug mb-1.5 line-clamp-1"
                    style={{ color: "#12004D" }}
                  >
                    {pkg.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
                    {pkg.highlights[0]}
                  </p>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid rgba(18,0,77,0.07)" }}>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">From</p>
                      <p className="text-base font-extrabold leading-none" style={{ color: "#12004D" }}>
                        {formatCurrency(pkg.priceFrom)}
                      </p>
                      <p className="text-[10px] text-gray-400">/ person</p>
                    </div>
                    <button
                      className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
                      style={{ backgroundColor: "#12004D", color: "#ffffff" }}
                    >
                      Enquire <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="text-center mt-10">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-white text-sm font-bold px-8 py-3.5 rounded-full transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{ backgroundColor: "#12004D" }}
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
