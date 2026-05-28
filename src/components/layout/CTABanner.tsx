import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0E1424" }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(31,140,158,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 xs:py-14 sm:py-16 lg:py-20 2xl:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          {/* ── Left: headline + subtext ── */}
          <div className="max-w-2xl">
            <h2
              className="font-extrabold leading-[1.05] mb-5"
              style={{
                fontSize: "clamp(36px, 5.5vw, 72px)",
                letterSpacing: "-0.03em",
                color: "#ffffff",
              }}
            >
              Let&apos;s plan your{" "}
              <span
                className="font-serif italic"
                style={{ fontWeight: 400, color: "#F2A93B" }}
              >
                Dream
              </span>
              <br />
              <span
                className="font-serif italic"
                style={{ fontWeight: 400, color: "#F2A93B" }}
              >
                Holiday
              </span>
            </h2>

            <p
              className="leading-relaxed max-w-md"
              style={{ color: "rgba(255,255,255,0.50)", fontSize: "clamp(14px, 1.2vw, 16px)" }}
            >
              Tell us your travel dreams. Our experts reply with a
              personalised itinerary in under 24 hours, Mon–Sat.
            </p>
          </div>

          {/* ── Right: CTA button ── */}
          <div className="shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 font-bold text-[15px] transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: "#1F8C9E",
                color: "#ffffff",
                padding: "18px 32px",
                borderRadius: "999px",
              }}
            >
              Send a Free Enquiry
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
