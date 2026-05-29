"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star, MessageSquare, ArrowUpRight } from "lucide-react";
import { TravelPackage } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { getWhatsAppUrl, packageEnquiryMessage } from "@/lib/whatsapp";
import EnquiryModal from "@/components/ui/EnquiryModal";

/* ── Unified white-pill badge style across all card tags ────────────────── */
const BADGE_BG   = "#FFFFFF";
const BADGE_TEXT = "#1A1A1A";
const badgeColors: Record<string, { bg: string; text: string }> = {
  "Best Seller":       { bg: BADGE_BG, text: BADGE_TEXT },
  "Top Rated":         { bg: BADGE_BG, text: BADGE_TEXT },
  "Luxury Pick":       { bg: BADGE_BG, text: BADGE_TEXT },
  "Honeymoon Special": { bg: BADGE_BG, text: BADGE_TEXT },
  "Heritage Special":  { bg: BADGE_BG, text: BADGE_TEXT },
  "Adventure Pick":    { bg: BADGE_BG, text: BADGE_TEXT },
  "Premium Luxury":    { bg: BADGE_BG, text: BADGE_TEXT },
  "Trending":          { bg: BADGE_BG, text: BADGE_TEXT },
};

export default function PackageCard({ pkg }: { pkg: TravelPackage }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const originalPrice = pkg.discount
    ? Math.round(pkg.priceFrom / (1 - pkg.discount / 100))
    : null;
  const saving = originalPrice ? originalPrice - pkg.priceFrom : 0;
  const badge = badgeColors[pkg.badge ?? ""] ?? { bg: BADGE_BG, text: BADGE_TEXT };

  return (
    <>
      <div
        className="bg-white flex flex-col group transition-all duration-300 hover:-translate-y-1.5"
        style={{ borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="px-3 pt-3">
          <div className="relative overflow-hidden" style={{ borderRadius: "14px", height: "clamp(160px, 26vw, 200px)" }}>
            <Image src={pkg.coverImage} alt={pkg.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 480px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, transparent 38%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
            {pkg.badge && (
              <div className="absolute top-3 left-3">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: "rgba(255,255,255,0.92)", color: "#1F8C9E", border: "1px solid rgba(31,140,158,0.22)" }}>{pkg.badge}</span>
              </div>
            )}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
              {pkg.discount && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: "rgba(255,255,255,0.92)", color: "#B45309", border: "1px solid rgba(242,169,59,0.35)" }}>{pkg.discount}% OFF</span>
              )}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                style={{ background: "rgba(255,255,255,0.92)", color: "#1F8C9E", border: "1px solid rgba(31,140,158,0.22)" }}
              >{pkg.category === "international" ? "International" : "National"}</span>
            </div>
            {/* Duration — bottom-left of image */}
            <div className="absolute bottom-2.5 left-3">
              <span
                className="inline-flex items-center gap-1.5 text-[12px] font-bold whitespace-nowrap tracking-tight"
                style={{
                  color: "#ffffff",
                  textShadow: "0 1px 2px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.55), 0 0 14px rgba(0,0,0,0.40)",
                }}
              >
                <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
                {pkg.duration}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 pt-3 pb-3.5 flex flex-col flex-1">

          {/* Location */}
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3 shrink-0" style={{ color: "#9ca3af" }} />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.06em] leading-none truncate"
              style={{ color: "#9ca3af" }}
            >
              {pkg.destination}, {pkg.country}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-bold text-[15px] leading-[1.3] mb-1.5 line-clamp-1"
            style={{ color: "#111827", letterSpacing: "-0.01em" }}
          >
            {pkg.title}
          </h3>

          {/* Highlights */}
          <p
            className="text-[12px] leading-[1.5] line-clamp-1 mb-2.5"
            style={{ color: "#9ca3af" }}
          >
            {pkg.highlights.slice(0, 2).join(" · ")}
          </p>

          {/* Price · Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-1 min-w-0">
              <span
                className="text-[18px] font-extrabold leading-none shrink-0"
                style={{ color: "#1F8C9E", letterSpacing: "-0.02em" }}
              >
                {formatCurrency(pkg.priceFrom)}
              </span>
              <span className="text-[11px] font-medium leading-none shrink-0" style={{ color: "#9ca3af" }}>
                / person
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5" style={{ color: "#F2A93B", fill: "#F2A93B", strokeWidth: 1.5 }} />
              <span className="text-[13px] font-bold leading-none tabular-nums" style={{ color: "#111827" }}>
                {(pkg.rating ?? 0).toFixed(1)}
              </span>
              <span className="text-[11px] leading-none tabular-nums" style={{ color: "#9ca3af" }}>
                ({pkg.reviewCount})
              </span>
            </div>
          </div>

          {/* Savings */}
          {pkg.discount && saving > 0 && (
            <p className="text-[12px] font-semibold mb-2 leading-none" style={{ color: "#059669", letterSpacing: "0.005em" }}>
              Save {formatCurrency(saving)}
            </p>
          )}

          {/* Action buttons */}
          <div className="mt-auto pt-2.5 flex items-center gap-1.5 lg:gap-2" style={{ borderTop: "1px solid #f3f4f6" }}>
            <Link href={`/packages/${pkg.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-semibold py-2.5 rounded-full transition-all text-[#1F8C9E] hover:bg-[#1F8C9E] hover:text-white active:scale-95 whitespace-nowrap"
              style={{ border: "1.5px solid #1F8C9E", letterSpacing: "-0.005em" }}
            >
              View Details
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
            <button onClick={() => setEnquiryOpen(true)}
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all text-[#1F8C9E] hover:bg-[#1F8C9E] hover:text-white active:scale-95 shrink-0"
              style={{ border: "1.5px solid #1F8C9E" }} aria-label="Enquire"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <a href={getWhatsAppUrl(packageEnquiryMessage(pkg.title, pkg.destination))} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all hover:opacity-90 active:scale-95 shrink-0"
              style={{ backgroundColor: "rgba(37,211,102,0.12)", color: "#16a34a" }} aria-label="WhatsApp Enquiry"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)}
        prefillDestination={pkg.destination} prefillPackageOrFlight={pkg.title}
        enquiryType="package" title={`Enquire: ${pkg.title}`}
      />
    </>
  );
}
