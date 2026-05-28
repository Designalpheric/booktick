import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, ArrowUpRight, MapPin, Star, Tag, Flame } from "lucide-react";
import { packages } from "@/data/packages";
import { formatCurrency } from "@/lib/utils";

export default function DealsSection() {
  const deals = packages.filter((p) => p.discount).slice(0, 4);

  return (
    <section
      className="relative overflow-hidden py-14 xs:py-16 sm:py-20 lg:py-24 2xl:py-28"
      style={{ background: "linear-gradient(160deg,#0B0E14 0%,#0E1219 55%,#090C11 100%)" }}
    >
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Teal glow — top center */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-72 pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(31,140,158,0.10) 0%,transparent 70%)" }}
      />
      {/* Amber glow — bottom right */}
      <div
        className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(242,169,59,0.07) 0%,transparent 65%)" }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg,transparent 0%,#1F8C9E 30%,#F2A93B 70%,transparent 100%)" }}
      />

      <div className="relative max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">

        {/* ── Section header ── */}
        {/* Mobile: centered column. xs+: left/right split row. Desktop: unchanged. */}
        <div className="flex flex-col items-center xs:flex-row xs:items-end justify-between gap-5 xs:gap-5 sm:gap-6 mb-8 xs:mb-10 sm:mb-12">

          {/* Left block — center on mobile, left-align xs+ */}
          <div className="w-full xs:w-auto text-center xs:text-left">
            {/* Eyebrow badge — desktop only */}
            <div className="hidden lg:flex items-center gap-2.5 mb-5">
              <div
                className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full"
                style={{
                  background: "linear-gradient(135deg,#F59E0B 0%,#D97706 100%)",
                  boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
                }}
              >
                <Flame className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-white fill-white" />
                <span className="text-[10px] xs:text-[12px] font-black tracking-[0.12em] uppercase text-white">
                  Limited Time Offers
                </span>
              </div>
              {/* Live indicator */}
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inset-0 rounded-full opacity-60"
                    style={{ background: "#F59E0B" }} />
                  <span className="relative rounded-full h-2 w-2" style={{ background: "#F59E0B" }} />
                </span>
                <span className="text-[11px] xs:text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.40)" }}>
                  Ends soon
                </span>
              </div>
            </div>

            <h2
              className="font-heading font-extrabold text-white mb-2 text-[28px] xs:text-[32px] sm:text-[38px] lg:text-[44px] xl:text-[48px]"
              style={{ lineHeight: 1.06, letterSpacing: "-0.026em" }}
            >
              Hot Deals &amp;{" "}
              <span className="font-serif italic font-normal" style={{ color: "#F2A93B" }}>
                Offers
              </span>
            </h2>

            <p
              className="text-[13px] xs:text-[14px] sm:text-[15px] max-w-[270px] xs:max-w-none mx-auto xs:mx-0 xs:mt-2"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              Exclusive prices on handpicked destinations — book before they&apos;re gone.
            </p>
          </div>

          {/* "View All Deals" — desktop only (mobile/tablet use the bottom button) */}
          <Link
            href="/packages"
            className="group hidden sm:inline-flex items-center gap-2.5 text-[13px] font-bold text-white transition-all duration-200 self-auto whitespace-nowrap shrink-0 hover:opacity-80"
          >
            View All Deals
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 2xl:gap-6">
          {deals.map((deal, idx) => {
            const originalPrice = Math.round(
              deal.priceFrom / (1 - (deal.discount ?? 0) / 100)
            );
            const savings = originalPrice - deal.priceFrom;

            return (
              <Link
                key={deal.id}
                href={`/packages/${deal.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: "#FFFFFF",
                  boxShadow:
                    idx === 0
                      ? "0 0 0 2px #1F8C9E, 0 12px 40px rgba(0,0,0,0.40)"
                      : "0 4px 20px rgba(0,0,0,0.30)",
                }}
              >
                {/* ── Photo ── */}
                <div className="relative overflow-hidden" style={{ height: 196 }}>
                  <Image
                    src={deal.coverImage}
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
                  />

                  {/* Badge (Best Seller etc.) */}
                  {deal.badge && (
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black text-white tracking-wide uppercase"
                      style={{ background: "linear-gradient(135deg,#1F8C9E,#0E6F7F)" }}
                    >
                      {deal.badge}
                    </div>
                  )}

                  {/* Discount pill */}
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black text-white"
                    style={{
                      background: "linear-gradient(135deg,#F2A93B,#C97C14)",
                      boxShadow: "0 2px 10px rgba(242,169,59,0.45)",
                    }}
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {deal.discount}% OFF
                  </div>

                  {/* Duration overlay — bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-1.5"
                    style={{
                      background:
                        "linear-gradient(to top,rgba(0,0,0,0.60) 0%,transparent 100%)",
                    }}
                  >
                    <Clock className="w-3 h-3 text-white/70" />
                    <span className="text-white text-[11px] font-semibold">
                      {deal.duration}
                    </span>
                  </div>
                </div>

                {/* ── Card body (white) ── */}
                <div className="flex flex-col flex-1 p-4">
                  {/* Title */}
                  <h3
                    className="font-bold leading-snug mb-1 line-clamp-1"
                    style={{ fontSize: 15, color: "#111827" }}
                  >
                    {deal.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 shrink-0" style={{ color: "#9CA3AF" }} />
                    <span className="text-[12px]" style={{ color: "#6B7280" }}>
                      {deal.destination}, {deal.country}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="w-3 h-3 fill-current"
                          style={{
                            color:
                              s <= Math.round(deal.rating ?? 0)
                                ? "#F2A93B"
                                : "#E5E7EB",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: "#374151" }}>
                      {deal.rating?.toFixed(1)}
                    </span>
                    <span className="text-[11px]" style={{ color: "#9CA3AF" }}>
                      ({deal.reviewCount?.toLocaleString()} reviews)
                    </span>
                  </div>

                  {/* Separator */}
                  <div className="h-px mb-3" style={{ background: "#F3F4F6" }} />

                  {/* Pricing */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className="font-black leading-none"
                        style={{ fontSize: 20, color: "#111827" }}
                      >
                        {formatCurrency(deal.priceFrom)}
                      </span>
                      <span
                        className="text-[12px] line-through"
                        style={{ color: "#D1D5DB" }}
                      >
                        {formatCurrency(originalPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                        style={{
                          background: "rgba(31,140,158,0.08)",
                          color: "#1F8C9E",
                          border: "1px solid rgba(31,140,158,0.18)",
                        }}
                      >
                        ✓ Save {formatCurrency(savings)}
                      </div>
                      <span className="text-[11px]" style={{ color: "#9CA3AF" }}>
                        / person
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div
                    className="mt-auto w-full py-2.5 rounded-full inline-flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all duration-200 group-hover:bg-[#1F8C9E] group-hover:text-white"
                    style={{
                      border: "1.5px solid #1F8C9E",
                      color: "#1F8C9E",
                      background: "transparent",
                    }}
                  >
                    Enquire Now <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Bottom CTA — mobile/tablet only ── */}
        <div className="flex justify-center mt-8 sm:hidden">
          <Link
            href="/packages"
            className="group inline-flex items-center gap-2 text-[13px] font-bold text-white transition-all duration-200 border border-white/30 px-5 py-2.5 rounded-full hover:border-white/60 hover:bg-white/[0.07] active:scale-95"
          >
            View All Deals
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
