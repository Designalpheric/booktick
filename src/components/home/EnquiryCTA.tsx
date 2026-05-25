"use client";

import { useState } from "react";
import Image from "next/image";
import EnquiryModal from "@/components/ui/EnquiryModal";

export default function EnquiryCTA() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  return (
    <>
      <section className="py-14 sm:py-20" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

            {/* ── Left: text + CTAs ─────────────────────────────────── */}
            <div>

              {/* Badge pill */}
              <div
                className="inline-flex items-center px-4 py-1.5 rounded-full mb-6"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(20,20,20,0.12)",
                }}
              >
                <span className="text-sm font-medium" style={{ color: "#343434" }}>
                  Free Consultation
                </span>
              </div>

              {/* Heading */}
              <h2
                className="font-heading font-extrabold leading-[1.05] mb-5"
                style={{
                  color: "#111827",
                  letterSpacing: "-0.03em",
                  fontSize: "clamp(36px, 5vw, 64px)",
                }}
              >
                Ready to Plan Your
                <br />
                <span className="font-serif italic" style={{ fontWeight: 400, color: "#1F8C9E" }}>
                  Dream Holiday?
                </span>
              </h2>

              {/* Description */}
              <p
                className="leading-relaxed mb-10 max-w-sm"
                style={{ color: "rgba(17,24,39,0.52)", fontSize: "clamp(15px, 1.2vw, 17px)" }}
              >
                Our travel experts are here to create a personalised itinerary just for you.
                Enquire now — it&apos;s completely free!
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3">
                {/* Primary — Start your trip */}
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                  style={{
                    backgroundColor: "#111827",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Start your trip
                </button>

                {/* Contact Us — reveals phone on click */}
                {!showPhone ? (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                    style={{
                      backgroundColor: "#fff",
                      color: "#343434",
                      border: "1.5px solid rgba(20,20,20,0.14)",
                    }}
                  >
                    Contact Us
                  </button>
                ) : (
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                    style={{
                      backgroundColor: "#fff",
                      color: "#1F8C9E",
                      border: "1.5px solid rgba(31,140,158,0.30)",
                    }}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +91 98765 43210
                  </a>
                )}
              </div>
            </div>

            {/* ── Right: 3-image grid ────────────────────────────────── */}
            <div
              className="grid grid-cols-2 gap-3"
              style={{ gridTemplateRows: "1fr 1fr", aspectRatio: "1.3 / 1", maxHeight: "420px" }}
            >
              {/* Tall image — Maldives, spans both rows */}
              <div
                className="relative row-span-2 overflow-hidden"
                style={{ borderRadius: "20px" }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&h=950&fit=crop"
                  alt="Maldives Overwater Villas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 28vw"
                />
              </div>

              {/* Top-right image */}
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: "20px" }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&h=480&fit=crop"
                  alt="Goa Beach"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 14vw"
                />
              </div>

              {/* Bottom-right image */}
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: "20px" }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&h=480&fit=crop"
                  alt="Kerala Backwaters"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 14vw"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        enquiryType="general"
        title="Plan Your Dream Holiday"
      />
    </>
  );
}
