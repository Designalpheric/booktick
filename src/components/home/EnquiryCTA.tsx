"use client";

import { useState } from "react";
import Image from "next/image";
import EnquiryModal from "@/components/ui/EnquiryModal";

export default function EnquiryCTA() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Left: text + CTAs ─────────────────────────────────── */}
            <div>
              {/* Free Consultation pill — top */}
              <div
                className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-8"
                style={{
                  border: "1px solid rgba(20,20,20,0.08)",
                  boxShadow: "0 1px 2px rgba(20,20,20,0.04)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "#1F8C9E" }}
                />
                <span className="text-sm font-semibold" style={{ color: "#343434" }}>
                  Free Consultation
                </span>
              </div>

              {/* Heading */}
              <h2
                className="font-heading font-extrabold mb-6 leading-[1.05]"
                style={{
                  color: "#343434",
                  letterSpacing: "-0.028em",
                  fontSize: "clamp(36px, 4.8vw, 60px)",
                }}
              >
                Ready to Plan Your
                <br />
                <span
                  className="font-serif italic"
                  style={{ fontWeight: 400, letterSpacing: "-0.02em" }}
                >
                  Dream Holiday?
                </span>
              </h2>

              {/* Subtitle */}
              <p
                className="text-base sm:text-lg mb-6 sm:mb-10 max-w-md leading-relaxed"
                style={{ color: "rgba(20,20,20,0.55)" }}
              >
                Our travel experts are here to create a personalised itinerary just for you.
                Enquire now — it&apos;s completely free!
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-3">
                {/* Pill — Send Free Enquiry */}
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-white text-[15px] font-semibold text-center transition-all hover:shadow-md"
                  style={{
                    color: "#343434",
                    border: "1.5px solid rgba(20,20,20,0.10)",
                  }}
                >
                  Send Free Enquiry
                </button>

                {/* WhatsApp — secondary pill */}
                <a
                  href="https://wa.me/919876543210?text=Hi%20BookTick!%20I%20want%20to%20plan%20a%20trip."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-[15px] font-semibold text-white transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: "#22c55e" }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* ── Right: 3-image grid ────────────────────────────────── */}
            <div
              className="grid grid-cols-2 gap-3 sm:gap-4"
              style={{ gridTemplateRows: "1fr 1fr", aspectRatio: "1 / 1" }}
            >
              {/* Tall image — Maldives, spans both rows */}
              <div
                className="relative row-span-2 rounded-[28px] overflow-hidden"
                style={{
                  boxShadow:
                    "0 2px 4px rgba(20,20,20,0.05), 0 30px 50px -22px rgba(20,20,20,0.22)",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&h=950&fit=crop"
                  alt="Maldives Overwater Villas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 28vw"
                />
              </div>

              {/* Top-right image — Goa */}
              <div
                className="relative rounded-[28px] overflow-hidden"
                style={{
                  boxShadow:
                    "0 2px 4px rgba(20,20,20,0.05), 0 30px 50px -22px rgba(20,20,20,0.22)",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&h=480&fit=crop"
                  alt="Goa Beach Bliss"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 14vw"
                />
              </div>

              {/* Bottom-right image — Kerala */}
              <div
                className="relative rounded-[28px] overflow-hidden"
                style={{
                  boxShadow:
                    "0 2px 4px rgba(20,20,20,0.05), 0 30px 50px -22px rgba(20,20,20,0.22)",
                }}
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
