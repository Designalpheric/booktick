"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star, MessageSquare } from "lucide-react";
import { TravelPackage } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { getWhatsAppUrl, packageEnquiryMessage } from "@/lib/whatsapp";
import EnquiryModal from "@/components/ui/EnquiryModal";

const badgeColors: Record<string, { bg: string; text: string }> = {
  "Best Seller":       { bg: "rgba(255,255,255,0.82)", text: "#343434" },
  "Top Rated":         { bg: "rgba(255,255,255,0.82)", text: "#343434" },
  "Luxury Pick":       { bg: "rgba(255,255,255,0.82)", text: "#343434" },
  "Honeymoon Special": { bg: "rgba(255,255,255,0.82)", text: "#343434" },
  "Heritage Special":  { bg: "rgba(255,255,255,0.82)", text: "#343434" },
  "Adventure Pick":    { bg: "rgba(255,255,255,0.82)", text: "#343434" },
  "Premium Luxury":    { bg: "rgba(255,255,255,0.82)", text: "#343434" },
  "Trending":          { bg: "rgba(255,255,255,0.82)", text: "#343434" },
};

export default function PackageCard({ pkg }: { pkg: TravelPackage }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const originalPrice = pkg.discount
    ? Math.round(pkg.priceFrom / (1 - pkg.discount / 100))
    : null;
  const saving = originalPrice ? originalPrice - pkg.priceFrom : 0;
  const badge = badgeColors[pkg.badge ?? ""] ?? { bg: "#1F8C9E", text: "#fff" };

  return (
    <>
      <div
        className="bg-white flex flex-col group transition-all duration-300 hover:-translate-y-1.5"
        style={{ borderRadius: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="px-3 pt-3">
          <div className="relative overflow-hidden" style={{ borderRadius: "14px", height: "200px" }}>
            <Image src={pkg.coverImage} alt={pkg.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 50%)" }} />
            {pkg.badge && (
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap" style={{ backgroundColor: badge.bg, color: badge.text }}>{pkg.badge}</span>
              </div>
            )}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
              {pkg.discount && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap" style={{ backgroundColor: "rgba(255,255,255,0.82)", color: "#343434" }}>{pkg.discount}% OFF</span>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap"
                style={{ backgroundColor: "rgba(255,255,255,0.82)", color: "#343434" }}
              >{pkg.category === "international" ? "International" : "National"}</span>
            </div>
          </div>
        </div>

        <div className="px-4 pt-3 pb-4 flex flex-col flex-1">
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
            <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
            {pkg.destination}, {pkg.country}
          </div>
          <h3 className="font-extrabold text-lg leading-snug mb-1 line-clamp-1" style={{ color: "#1a1a1a" }}>{pkg.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-1 mb-3">{pkg.highlights.slice(0, 2).join(" · ")}</p>

          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div>
              <span className="text-2xl font-extrabold leading-none" style={{ color: "#1a1a1a" }}>{formatCurrency(pkg.priceFrom)}</span>
              <span className="text-xs text-gray-400 ml-1">/ person</span>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5" style={{ color: "#F2A93B", fill: s <= Math.round(pkg.rating) ? "#F2A93B" : "none", strokeWidth: 1.5 }} />
              ))}
              <span className="text-xs text-gray-400 ml-1">({pkg.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "#f3f4f6", color: "#374151" }}>
              <Clock className="w-3 h-3" />{pkg.duration}
            </span>
          </div>

          {pkg.discount && saving > 0 && (
            <p className="text-xs font-semibold text-green-600 mb-3">Save {formatCurrency(saving)}</p>
          )}

          <div className="mt-auto pt-3 flex items-center gap-2" style={{ borderTop: "1px solid #f3f4f6" }}>
            <Link href={`/packages/${pkg.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl transition-all hover:bg-gray-50 active:scale-95"
              style={{ border: "1.5px solid #e5e7eb", color: "#1a1a1a" }}
            >
              View Details
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <button onClick={() => setEnquiryOpen(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100 active:scale-95 shrink-0"
              style={{ border: "1.5px solid #e5e7eb", color: "#343434" }} aria-label="Enquire"
            ><MessageSquare className="w-4 h-4" /></button>
            <a href={getWhatsAppUrl(packageEnquiryMessage(pkg.title, pkg.destination))} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 active:scale-95 shrink-0"
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
