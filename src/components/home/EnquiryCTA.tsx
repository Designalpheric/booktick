"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import EnquiryModal from "@/components/ui/EnquiryModal";

export default function EnquiryCTA() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* ── Full-bleed cinematic banner card ── */}
          <div className="relative rounded-[32px] overflow-hidden" style={{ minHeight: 380 }}>

            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[8s] hover:scale-100"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1920&h=900&fit=crop')`,
              }}
            />

            {/* Layered dark gradient overlay — deeper on left, lighter on right */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(12,0,55,0.80) 0%, rgba(18,0,77,0.65) 45%, rgba(0,0,30,0.45) 100%)",
              }}
            />

            {/* Subtle noise/grain overlay for depth */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              }}
            />

            {/* ── Content ── */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-12 py-14 sm:py-16">

              {/* Badge */}
              <span
                className="inline-flex items-center gap-1.5 text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5 border"
                style={{
                  backgroundColor: "rgba(67,198,217,0.20)",
                  borderColor:     "rgba(67,198,217,0.45)",
                  backdropFilter:  "blur(12px)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "#43C6D9" }}
                />
                Free Consultation
              </span>

              {/* Heading */}
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-5 max-w-3xl"
              >
                Ready to Plan Your
                <br />
                <span style={{ color: "#F5B61A" }}>Dream Holiday?</span>
              </h2>

              {/* Subtitle */}
              <p className="text-white/70 text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
                Our travel experts are here to create a personalised itinerary just for you.
                Enquire now — it&apos;s completely free!
              </p>

              {/* ── CTA Buttons ── */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">

                {/* Primary — Send Free Enquiry */}
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="group flex items-center gap-0 font-bold text-white rounded-full transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    backdropFilter:  "blur(16px)",
                    border:          "1px solid rgba(255,255,255,0.30)",
                  }}
                >
                  <span className="pl-7 pr-5 py-4 text-sm sm:text-base whitespace-nowrap">
                    Send Free Enquiry
                  </span>
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-1 flex-shrink-0 transition-colors group-hover:bg-opacity-90"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <ArrowRight className="w-4 h-4" style={{ color: "#12004D" }} />
                  </span>
                </button>

                {/* Secondary — WhatsApp */}
                <a
                  href="https://wa.me/919876543210?text=Hi%20BookTick!%20I%20want%20to%20plan%20a%20trip."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-0 font-bold text-white rounded-full transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                  style={{ backgroundColor: "#22c55e", border: "1px solid #16a34a" }}
                >
                  <span className="pl-7 pr-5 py-4 text-sm sm:text-base whitespace-nowrap">
                    Chat on WhatsApp
                  </span>
                  <span className="w-12 h-12 rounded-full flex items-center justify-center mr-1 flex-shrink-0 bg-white/20 group-hover:bg-white/30 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                </a>

              </div>

              {/* Trust footer line */}
              <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/45 text-sm">
                <span>📞 Responds within 2 hours</span>
                <span className="hidden sm:inline">·</span>
                <span>✅ No booking fees</span>
                <span className="hidden sm:inline">·</span>
                <span>🎯 Personalised service</span>
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
