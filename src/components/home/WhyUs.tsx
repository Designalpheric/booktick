"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

const stats = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" stroke="#1F8C9E" strokeWidth="1.6">
        <rect x="6" y="10" width="28" height="22" rx="3" />
        <path d="M6 16h28M14 10v6M26 10v6" />
        <circle cx="14" cy="24" r="1.5" fill="#1F8C9E" />
        <circle cx="20" cy="24" r="1.5" fill="#1F8C9E" />
        <circle cx="26" cy="24" r="1.5" fill="#1F8C9E" />
      </svg>
    ),
    value: "250+",
    label: "Tour Packages",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" stroke="#1F8C9E" strokeWidth="1.6">
        <circle cx="20" cy="13" r="5" />
        <path d="M10 32c0-5.523 4.477-10 10-10s10 4.477 10 10" />
        <path d="M28 14l2 2-2 2M12 14l-2 2 2 2" />
      </svg>
    ),
    value: "10+",
    label: "Years of Experience",
  },
];


export default function WhyUs() {
  return (
    <section className="bg-white">

      {/* ── Top: About / What Makes Us Different ─────────────────────── */}
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-14 xs:py-16 sm:py-20 lg:py-28 2xl:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-24 items-center">

          {/* Left — stacked images */}
          <div className="relative h-[300px] xs:h-[360px] sm:h-[420px] md:h-[460px] xl:h-[520px] select-none">
            {/* Back image */}
            <div
              className="absolute top-0 left-0 w-[68%] h-[75%] rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.14)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=450&fit=crop"
                alt="Mountain travel"
                fill
                className="object-cover"
              />
            </div>

            {/* Front image */}
            <div
              className="absolute bottom-0 right-0 w-[68%] h-[75%] rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 20px 56px rgba(0,0,0,0.18)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=450&fit=crop"
                alt="Travel adventure"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right — content */}
          <div>
            <h2
              className="font-extrabold mb-5 leading-tight"
              style={{ fontSize: "clamp(28px,3.5vw,44px)", color: "#0F172A", letterSpacing: "-0.025em" }}
            >
              What Makes Us{" "}
              <span className="font-serif italic font-normal" style={{ color: "#1F8C9E" }}>Different</span>
            </h2>

            <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#475569" }}>
              We combine expert guidance, top-quality experiences, and unmatched customer support to deliver safe, unforgettable travel adventures. Join us to explore breathtaking destinations with confidence and ease.
            </p>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: "#475569" }}>
              With professional travel experts, handpicked packages, and reliable support, we make every trip both safe and memorable. Travel with us and discover stunning locations comfortably and confidently.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-5 xs:gap-6 sm:gap-8 mb-8">
              {stats.map(({ icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(31,140,158,0.08)" }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-[26px] font-extrabold leading-none" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>
                      {value}
                    </p>
                    <p className="text-[13px] mt-0.5" style={{ color: "#64748B" }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px mb-7" style={{ backgroundColor: "rgba(0,0,0,0.07)" }} />

            {/* CTA row — mobile: unified card | xs+: side-by-side */}

            {/* ── Mobile card (< xs) ── */}
            <div
              className="xs:hidden rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(31,140,158,0.15)", boxShadow: "0 2px 16px rgba(31,140,158,0.08)" }}
            >
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3.5 px-4 py-3.5 group"
                style={{ borderBottom: "1px solid rgba(31,140,158,0.12)", background: "rgba(31,140,158,0.03)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                  style={{ backgroundColor: "#1F8C9E", boxShadow: "0 4px 12px rgba(31,140,158,0.30)" }}
                >
                  <Phone className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>Call Us 24/7</p>
                  <p className="text-[15px] font-bold" style={{ color: "#0F172A" }}>+91 98765 43210</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto shrink-0" style={{ color: "#1F8C9E" }} />
              </a>
              <Link
                href="/packages"
                className="flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold text-white transition-all active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#1F8C9E 0%,#0E6F7F 100%)" }}
              >
                Explore Packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* ── xs+ side-by-side ── */}
            <div className="hidden xs:flex xs:items-center xs:justify-between gap-4">
              <a href="tel:+919876543210" className="flex items-center gap-3 group">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                  style={{ backgroundColor: "#1F8C9E" }}
                >
                  <Phone className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>Call Us 24/7</p>
                  <p className="text-[15px] font-bold" style={{ color: "#0F172A" }}>+91 98765 43210</p>
                </div>
              </a>
              <Link
                href="/packages"
                className="inline-flex items-center justify-center gap-2 font-bold px-7 py-3.5 rounded-full text-[14px] text-white transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#1F8C9E 0%,#0E6F7F 100%)",
                  boxShadow: "0 4px 20px rgba(31,140,158,0.35)",
                }}
              >
                Explore Packages
              </Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
