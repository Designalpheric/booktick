"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Clock, MapPin, Star, Tag } from "lucide-react";
import { packages } from "@/data/packages";
import EnquiryModal from "@/components/ui/EnquiryModal";
import { formatCurrency } from "@/lib/utils";
import { TravelPackage } from "@/types";

const categories = ["All", "National", "International", "Honeymoon", "Adventure", "Luxury"];

export default function FeaturedPackages() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [enquiryPkg, setEnquiryPkg] = useState<TravelPackage | null>(null);

  const allFeatured = packages.filter((p) => p.isFeatured);
  const matchesCategory = (p: TravelPackage) => {
    if (activeCategory === "All") return true;
    const lc = activeCategory.toLowerCase();
    if (lc === "national" || lc === "international") return p.category === lc;
    return p.type?.some((t) => t.toLowerCase() === lc);
  };
  const filtered = allFeatured.filter(matchesCategory).slice(0, 5);
  const hero = filtered[0];
  const rest = filtered.slice(1, 5);

  return (
    <>
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header ── */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-10">
            {/* Heading */}
            <div>
              <h2 className="leading-none">
                <span
                  className="block sm:inline lg:block font-extrabold"
                  style={{ fontSize: "clamp(28px,3.4vw,46px)", color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1.06 }}
                >
                  Expertly Crafted Travel{" "}
                </span>
                <span
                  className="block sm:inline lg:block font-serif italic font-normal"
                  style={{ fontSize: "clamp(30px,3.8vw,50px)", color: "#1F8C9E", letterSpacing: "-0.02em", lineHeight: 1.1 }}
                >
                  Packages for Every Traveller
                </span>
              </h2>
              <p className="mt-2.5 text-[15px] text-gray-400 max-w-md">
                Handpicked itineraries across India and the world.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0 sm:overflow-x-auto sm:scrollbar-hide pb-0.5">
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className="px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 hover:scale-[1.03] shrink-0"
                    style={
                      active
                        ? {
                            background: "#fff",
                            border: "1.5px solid #9CA3AF",
                            color: "#1F2937",
                          }
                        : {
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            color: "#374151",
                          }
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr] gap-5">

            {/* ── HERO CARD ── */}
            {hero && (() => {
              const origPrice = hero.discount
                ? Math.round(hero.priceFrom / (1 - hero.discount / 100))
                : null;
              const savings = origPrice ? origPrice - hero.priceFrom : null;
              return (
                <>
                  {/* ── MOBILE + TABLET (< lg): Hot Deals card style ── */}
                  <div
                    className="lg:hidden bg-white group rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
                    style={{
                      boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                    onClick={() => router.push(`/packages/${hero.slug}`)}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ height: 196 }}>
                      <Image
                        src={hero.coverImage} alt={hero.title} fill priority
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="100vw"
                      />

                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 40%, transparent 55%, rgba(0,0,0,0.50) 100%)" }}
                      />

                      {/* Badge — top left: light teal */}
                      {hero.badge && (
                        <div
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide z-10"
                          style={{ background: "rgba(255,255,255,0.92)", color: "#1F8C9E", border: "1px solid rgba(31,140,158,0.22)" }}
                        >
                          {hero.badge}
                        </div>
                      )}

                      {/* Discount — top right: light amber */}
                      {hero.discount && (
                        <div
                          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black z-10"
                          style={{ background: "rgba(255,255,255,0.92)", color: "#B45309", border: "1px solid rgba(242,169,59,0.35)" }}
                        >
                          <Tag className="w-2.5 h-2.5" />{hero.discount}% OFF
                        </div>
                      )}

                      {/* Duration — bottom gradient overlay */}
                      <div
                        className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-1.5 z-10"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 100%)" }}
                      >
                        <Clock className="w-3 h-3 text-white/70" />
                        <span className="text-white text-[11px] font-semibold">{hero.duration}</span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-col flex-1 px-4 py-3.5">
                      <h3
                        className="font-bold line-clamp-1 mb-1"
                        style={{ fontSize: "14px", color: "#0F172A", letterSpacing: "-0.01em", lineHeight: 1.4 }}
                      >
                        {hero.title}
                      </h3>
                      <div className="flex items-center gap-1 mb-2.5">
                        <MapPin className="w-3 h-3 shrink-0 text-gray-300" />
                        <span className="text-[11px] text-gray-400 truncate">{hero.destination}, {hero.country}</span>
                      </div>
                      <div className="h-px bg-gray-100 mb-3" />
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">From</p>
                          <span className="font-black text-[17px] leading-none" style={{ color: "#1F8C9E" }}>
                            {formatCurrency(hero.priceFrom)}
                          </span>
                          {origPrice && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] line-through text-gray-300">{formatCurrency(origPrice)}</span>
                              {savings && (
                                <span
                                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                  style={{ background: "rgba(31,140,158,0.08)", color: "#1F8C9E" }}
                                >
                                  Save {formatCurrency(savings)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); router.push(`/packages/${hero.slug}`); }}
                          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all hover:opacity-80 active:scale-95"
                          style={{ backgroundColor: "transparent", color: "#1F8C9E", border: "1.5px solid #1F8C9E" }}
                        >
                          Enquire
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── DESKTOP (≥ lg): full dark-overlay image style ── */}
                  <div
                    onClick={() => router.push(`/packages/${hero.slug}`)}
                    className="hidden lg:block relative lg:col-span-1 lg:row-span-2 group cursor-pointer rounded-3xl overflow-hidden"
                    style={{
                      minHeight: 520,
                      boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 24px 56px -12px rgba(0,0,0,0.22)",
                    }}
                  >
                    <Image
                      src={hero.coverImage} alt={hero.title} fill priority
                      className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                      sizes="(max-width:1024px) 100vw, 52vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 35%,rgba(0,0,0,0.65) 65%,rgba(2,8,22,0.97) 100%)" }}
                    />

                    {/* Top */}
                    <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
                      <div className="flex flex-col gap-2">
                        {hero.badge && (
                          <span
                            className="self-start text-[11px] font-black px-3 py-1.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.92)", color: "#1F8C9E", border: "1px solid rgba(31,140,158,0.22)" }}
                          >
                            ★ {hero.badge}
                          </span>
                        )}
                        {hero.discount && (
                          <span
                            className="self-start inline-flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.92)", color: "#B45309", border: "1px solid rgba(242,169,59,0.35)" }}
                          >
                            <Tag className="w-3 h-3" />{hero.discount}% OFF
                          </span>
                        )}
                      </div>
                      <div
                        className="inline-flex items-center gap-1.5 text-white text-[12px] font-semibold px-3 py-1.5 rounded-full shrink-0"
                        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}
                      >
                        <Clock className="w-3.5 h-3.5 opacity-75" />
                        {hero.duration}
                      </div>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
                        style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)" }}>
                        <MapPin className="w-3 h-3" style={{ color: "#1F8C9E" }} />
                        <span className="text-[11px] font-semibold text-white/75">{hero.destination}, {hero.country}</span>
                      </div>
                      <h3
                        className="text-white font-extrabold leading-tight mb-4"
                        style={{ fontSize: "clamp(20px,2.2vw,30px)", letterSpacing: "-0.028em", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
                      >
                        {hero.title}
                      </h3>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>Starting from</p>
                          <div className="flex items-baseline gap-2">
                            <span className="font-black text-white" style={{ fontSize: "clamp(22px,2vw,28px)", letterSpacing: "-0.025em" }}>
                              {formatCurrency(hero.priceFrom)}
                            </span>
                            {origPrice && (
                              <span className="text-[13px] line-through" style={{ color: "rgba(255,255,255,0.25)" }}>{formatCurrency(origPrice)}</span>
                            )}
                            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>/ person</span>
                          </div>
                          {savings && (
                            <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full"
                              style={{ background: "rgba(110,231,183,0.12)", border: "1px solid rgba(110,231,183,0.20)" }}>
                              <span className="text-[10px] font-bold" style={{ color: "#6EE7B7" }}>✓ Save {formatCurrency(savings)}</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); router.push(`/packages/${hero.slug}`); }}
                          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all hover:opacity-80 active:scale-95"
                          style={{ backgroundColor: "transparent", color: "#1F8C9E", border: "1.5px solid #1F8C9E" }}
                        >
                          Enquire
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* ── 4 CLEAN WHITE CARDS ── */}
            {rest.map((pkg) => {
              const origPrice = pkg.discount
                ? Math.round(pkg.priceFrom / (1 - pkg.discount / 100))
                : null;
              const savings = origPrice ? origPrice - pkg.priceFrom : null;

              return (
                <div
                  key={pkg.id}
                  className="bg-white group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                  style={{
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 28px -6px rgba(0,0,0,0.12)",
                    border: "1px solid #F1F5F9",
                  }}
                >
                  {/* ── Image ── */}
                  <div className="relative overflow-hidden h-[196px] lg:h-[168px]">
                    <Image
                      src={pkg.coverImage} alt={pkg.title} fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                      sizes="(max-width:1024px) 100vw, 28vw"
                    />

                    {/* Gradient overlay — mobile/tablet only */}
                    <div
                      className="lg:hidden absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 40%, transparent 55%, rgba(0,0,0,0.50) 100%)" }}
                    />

                    {/* Discount badge — top right (all sizes) */}
                    {pkg.discount && (
                      <div
                        className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full z-10"
                        style={{
                          background: "rgba(255,255,255,0.92)",
                          color: "#B45309",
                          border: "1px solid rgba(242,169,59,0.35)",
                        }}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {pkg.discount}% OFF
                      </div>
                    )}

                    {/* Badge — top left: light teal (mobile/tablet only) */}
                    {pkg.badge && (
                      <div
                        className="lg:hidden absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide z-10"
                        style={{ background: "rgba(255,255,255,0.92)", color: "#1F8C9E", border: "1px solid rgba(31,140,158,0.22)" }}
                      >
                        {pkg.badge}
                      </div>
                    )}

                    {/* Category pill — top left (desktop only) */}
                    <div
                      className="hidden lg:inline-flex absolute top-3 left-3 items-center text-[10px] font-bold px-2.5 py-1 rounded-full z-10"
                      style={{ background: "rgba(255,255,255,0.92)", color: "#1F8C9E", border: "1px solid rgba(31,140,158,0.22)" }}
                    >
                      {pkg.category === "international" ? "International" : "National"}
                    </div>

                    {/* Duration — bottom gradient overlay (mobile/tablet only) */}
                    <div
                      className="lg:hidden absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-1.5 z-10"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 100%)" }}
                    >
                      <Clock className="w-3 h-3 text-white/70" />
                      <span className="text-white text-[11px] font-semibold">{pkg.duration}</span>
                    </div>

                    {/* Duration pill — bottom left (desktop only) */}
                    <div
                      className="hidden lg:inline-flex absolute bottom-3 left-3 items-center gap-1 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full z-10"
                      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
                    >
                      <Clock className="w-3 h-3" />
                      {pkg.duration}
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div className="flex flex-col flex-1 px-4 py-3.5">
                    <h3
                      className="font-bold line-clamp-1 mb-1"
                      style={{ fontSize: "14px", color: "#0F172A", letterSpacing: "-0.01em", lineHeight: 1.4 }}
                    >
                      {pkg.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 mb-2.5">
                      <MapPin className="w-3 h-3 shrink-0 text-gray-300" />
                      <span className="text-[11px] text-gray-400 truncate">{pkg.destination}, {pkg.country}</span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 mb-3" />

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">From</p>
                        <span className="font-black text-[17px] leading-none" style={{ color: "#1F8C9E" }}>
                          {formatCurrency(pkg.priceFrom)}
                        </span>
                        {origPrice && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] line-through text-gray-300">{formatCurrency(origPrice)}</span>
                            {savings && (
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{ background: "rgba(31,140,158,0.08)", color: "#1F8C9E" }}
                              >
                                Save {formatCurrency(savings)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push(`/packages/${pkg.slug}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all hover:opacity-80 active:scale-95"
                        style={{ backgroundColor: "transparent", color: "#1F8C9E", border: "1.5px solid #1F8C9E" }}
                      >
                        Enquire
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="mt-14 text-center">
            <Link
              href="/packages"
              className="group inline-flex items-center gap-2.5 text-[15px] font-semibold px-9 py-3.5 rounded-full transition-opacity duration-150 hover:opacity-85 active:scale-[0.97]"
              style={{
                backgroundColor: "#1F8C9E",
                color: "#fff",
                boxShadow: "0 2px 10px rgba(31,140,158,0.25)",
              }}
            >
              Browse All Packages
            </Link>
            <p className="mt-3 text-[13px] text-gray-400">
              50+ destinations &nbsp;·&nbsp; Customisable itineraries &nbsp;·&nbsp; 24/7 support
            </p>
          </div>

        </div>
      </section>

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
