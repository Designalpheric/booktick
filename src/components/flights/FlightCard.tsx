"use client";

import { useState } from "react";
import Image from "next/image";
import { PlaneTakeoff, PlaneLanding, ArrowLeftRight, MessageSquare, Wifi, Coffee, Utensils, Luggage, Heart } from "lucide-react";
import { Flight } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { getWhatsAppUrl, flightEnquiryMessage } from "@/lib/whatsapp";
import EnquiryModal from "@/components/ui/EnquiryModal";

/* ── helpers ──────────────────────────────────────────────────────────────── */
function AmenityIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes("wi-fi") || l.includes("wifi"))                   return <Wifi className="w-3 h-3 shrink-0" />;
  if (l.includes("meal") || l.includes("food") || l.includes("dining")) return <Utensils className="w-3 h-3 shrink-0" />;
  if (l.includes("baggage") || l.includes("luggage"))              return <Luggage className="w-3 h-3 shrink-0" />;
  return <Coffee className="w-3 h-3 shrink-0" />;
}

const classBadge: Record<string, { bg: string; color: string }> = {
  Economy:  { bg: "#F2A93B", color: "#fff" },
  Business: { bg: "#7c3aed", color: "#fff" },
  First:    { bg: "#1F8C9E", color: "#fff" },
};

const stopBadge = (stops: number) =>
  stops === 0
    ? { label: "Non-stop", bg: "rgba(22,163,74,0.90)", color: "#fff" }
    : { label: `${stops} Stop`,   bg: "rgba(217,119,6,0.90)",  color: "#fff" };

function flightDescription(flight: Flight): string {
  const stopText = flight.stops === 0 ? "direct, non-stop" : `${flight.stops}-stop`;
  const classText = flight.class === "First" ? "first-class" : flight.class.toLowerCase();
  return `Enjoy a comfortable ${stopText} ${classText} flight from ${flight.from} to ${flight.to} with ${flight.airline}. Enquire for confirmed pricing.`;
}

const WaIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ── component ────────────────────────────────────────────────────────────── */
export default function FlightCard({
  flight,
  isCheapest,
}: {
  flight: Flight;
  isCheapest?: boolean;
}) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [liked,       setLiked]       = useState(false);

  const cBadge = classBadge[flight.class]  ?? classBadge.Economy;
  const sBadge = stopBadge(flight.stops);

  return (
    <>
      <div
        className="bg-white flex flex-col sm:flex-row overflow-hidden transition-all duration-200 hover:shadow-lg"
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        {/* ── Left image ─────────────────────────────────────────────────── */}
        <div className="relative sm:w-[42%] shrink-0 h-56 sm:h-auto overflow-hidden">
          <Image
            src={flight.airlineLogo}
            alt={`${flight.airline} — ${flight.from} to ${flight.to}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 42vw"
          />
          {/* dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.35) 100%)" }}
          />

          {/* Heart */}
          <button
            onClick={() => setLiked(!liked)}
            className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ backgroundColor: "rgba(255,255,255,0.20)", backdropFilter: "blur(8px)" }}
          >
            <Heart
              className="w-4 h-4"
              style={{ color: liked ? "#ef4444" : "#fff", fill: liked ? "#ef4444" : "none" }}
            />
          </button>

          {/* Cheapest badge */}
          {isCheapest && (
            <div className="absolute top-3 left-12">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: "#1F8C9E" }}
              >
                Cheapest
              </span>
            </div>
          )}

          {/* Class badge — top right, amber box like reference */}
          <div className="absolute top-3 right-3">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-lg"
              style={{ backgroundColor: cBadge.bg, color: cBadge.color }}
            >
              {flight.class}
            </span>
          </div>

          {/* Stops badge — bottom left */}
          <div className="absolute bottom-3 left-3">
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: sBadge.bg, color: sBadge.color }}
            >
              {sBadge.label}
            </span>
          </div>

          {/* Dot indicators (decorative) */}
          <div className="absolute bottom-3 right-3 flex gap-1">
            {[0,1,2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: i === 0 ? "#fff" : "rgba(255,255,255,0.40)" }}
              />
            ))}
          </div>
        </div>

        {/* ── Right content ──────────────────────────────────────────────── */}
        <div className="flex-1 p-5 flex flex-col min-w-0">

          {/* Title + stop badge */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className="font-extrabold text-base leading-snug"
              style={{ color: "#1a1a1a", letterSpacing: "-0.01em" }}
            >
              {flight.airline} · {flight.fromCode} → {flight.toCode}
            </h3>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
              style={{ backgroundColor: sBadge.bg, color: sBadge.color }}
            >
              {sBadge.label}
            </span>
          </div>

          {/* Airline + aircraft */}
          <div className="flex items-center gap-2 mb-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-extrabold text-white"
              style={{ backgroundColor: "#1F8C9E" }}
            >
              {flight.airline.charAt(0)}
            </div>
            <p className="text-xs font-medium text-gray-500">
              {flight.airline} &bull; {flight.aircraft}
              {flight.stopDetails && (
                <span className="ml-1 text-amber-600"> · {flight.stopDetails}</span>
              )}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
            {flightDescription(flight)}
          </p>

          {/* Route row */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
            style={{ border: "1px solid rgba(0,0,0,0.08)", backgroundColor: "#fafafa" }}
          >
            <PlaneTakeoff className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <span className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>{flight.from}</span>
            <div className="flex-1 flex items-center gap-1">
              <div className="flex-1 h-px bg-gray-200" />
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <ArrowLeftRight className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <span className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>{flight.to}</span>
            <PlaneLanding className="w-3.5 h-3.5 shrink-0 text-gray-400" />
          </div>

          {/* Amenities */}
          {flight.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {flight.amenities.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                >
                  <AmenityIcon label={a} />
                  {a}
                </span>
              ))}
            </div>
          )}

          {/* ── Footer: price + CTA ──────────────────────────────────────── */}
          <div
            className="mt-auto pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
          >
            {/* Price */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">Est. fare from</p>
              <p className="text-xl font-extrabold leading-tight" style={{ color: "#1a1a1a" }}>
                {formatCurrency(flight.estimatedFare)}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <a
                href={getWhatsAppUrl(flightEnquiryMessage(flight.from, flight.to, flight.airline, ""))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Enquiry"
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:opacity-90 active:scale-95 shrink-0"
                style={{ backgroundColor: "rgba(37,211,102,0.12)", color: "#16a34a" }}
              >
                <WaIcon />
              </a>
              <button
                onClick={() => setEnquiryOpen(true)}
                aria-label="Send Enquiry"
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:bg-gray-50 active:scale-95 shrink-0"
                style={{ border: "1.5px solid #e5e7eb", color: "#1a1a1a" }}
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        prefillDestination={flight.to}
        prefillPackageOrFlight={`${flight.airline} · ${flight.fromCode} → ${flight.toCode}`}
        enquiryType="flight"
        title="Flight Enquiry"
      />
    </>
  );
}
