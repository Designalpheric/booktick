"use client";

import { useState } from "react";
import EnquiryModal from "@/components/ui/EnquiryModal";

export default function EnquiryCTA() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  return (
    <>
      <section className="py-12 xs:py-14 sm:py-20 2xl:py-24" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">

          {/* ── Teal gradient card — same visual as About page CTA ── */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0f5f6e 0%, #1F8C9E 50%, #27a3b8 100%)",
            }}
          >
            {/* Diagonal grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 64px)",
              }}
            />
            {/* Top-right circle */}
            <div
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            {/* Bottom-left circle */}
            <div
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
            {/* Skewed light band */}
            <div
              className="absolute top-0 left-1/3 w-64 h-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 60%)",
                transform: "skewX(-20deg)",
              }}
            />

            {/* ── Content ── */}
            <div className="relative px-8 sm:px-12 pt-10 sm:pt-12 pb-10">

              {/* Badge pill */}
              <div
                className="inline-flex items-center px-4 py-1.5 rounded-full mb-5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.22)",
                }}
              >
                <span className="text-sm font-medium text-white">Free Consultation</span>
              </div>

              {/* Heading */}
              <h2
                className="font-extrabold text-white leading-tight mb-3"
                style={{ fontSize: "clamp(26px, 4vw, 48px)", letterSpacing: "-0.025em" }}
              >
                Plan Your{" "}
                <span className="font-serif italic" style={{ fontWeight: 400 }}>
                  Dream Holiday?
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                Our travel experts are here to create a personalised itinerary just for you.
                Enquire now — it&apos;s completely free!
              </p>

              {/* Divider */}
              <div className="border-t mb-8" style={{ borderColor: "rgba(255,255,255,0.18)" }} />

              {/* Bottom row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">

                {/* Left — icon + label */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-base sm:text-lg leading-snug">
                      Start your trip today
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.60)" }}>
                      — Get a personalised itinerary from our experts within 24 hours
                    </p>
                  </div>
                </div>

                {/* Right — buttons */}
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">

                  {/* Primary — Start your trip */}
                  <button
                    onClick={() => setEnquiryOpen(true)}
                    className="px-6 py-3 rounded-full font-bold text-sm text-center transition-all hover:opacity-80 active:scale-95"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  >
                    Start your trip
                  </button>

                  {/* Secondary — Contact Us / reveal phone */}
                  {!showPhone ? (
                    <button
                      onClick={() => setShowPhone(true)}
                      className="px-6 py-3 rounded-full font-bold text-sm text-center bg-white transition-all hover:bg-white/90 active:scale-95"
                      style={{ color: "#0d6677" }}
                    >
                      Contact Us
                    </button>
                  ) : (
                    <a
                      href="tel:+919876543210"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-center bg-white transition-all hover:bg-white/90 active:scale-95"
                      style={{ color: "#0d6677" }}
                    >
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      +91 98765 43210
                    </a>
                  )}
                </div>
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
