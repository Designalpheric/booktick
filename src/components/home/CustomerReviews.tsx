"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Solo Traveller",
    destination: "Goa, India",
    rating: 5,
    comment:
      "BookTick made our Goa trip absolutely perfect! The team was incredibly responsive and the hotel they arranged was stunning. Every single detail was handled seamlessly.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
    cover:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=700&fit=crop",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Family Traveller",
    destination: "Kerala, India",
    rating: 5,
    comment:
      "The Kerala backwaters houseboat experience was truly magical. Everything from airport pickup to the final drop-off was handled with incredible care. Will book again!",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
    cover:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=700&fit=crop",
  },
  {
    id: 3,
    name: "Ananya Gupta",
    role: "Honeymoon Traveller",
    destination: "Dubai, UAE",
    rating: 5,
    comment:
      "Dubai with BookTick was a dream! Desert safari, Burj Khalifa, fountain show — they covered everything and even helped with our visa. Simply outstanding service.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face",
    cover:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=700&fit=crop",
  },
  {
    id: 4,
    name: "Vikram Nair",
    role: "Adventure Seeker",
    destination: "Ladakh, India",
    rating: 5,
    comment:
      "Our Ladakh trip was the adventure of a lifetime. Pangong Tso at sunrise — those moments will stay forever. Great value for money and superb execution throughout.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
    cover:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=700&fit=crop",
  },
  {
    id: 5,
    name: "Neha Patel",
    role: "Honeymoon Traveller",
    destination: "Bali, Indonesia",
    rating: 5,
    comment:
      "Bali honeymoon was beyond perfect! BookTick arranged a special candlelit dinner surprise for us. The villa and experiences were curated with so much love and care.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=face",
    cover:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=700&fit=crop",
  },
  {
    id: 6,
    name: "Arjun Kapoor",
    role: "Group Traveller",
    destination: "Bangkok, Thailand",
    rating: 5,
    comment:
      "Thailand was incredible! From Bangkok's temples to Phi Phi islands — BookTick's itinerary covered it all. The WhatsApp support was instant and super helpful throughout.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=face",
    cover:
      "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&h=700&fit=crop",
  },
];

export default function CustomerReviews() {
  const total = reviews.length;
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (idx: number, dir: number) => { setDirection(dir); setActive(idx); },
    []
  );
  const next = useCallback(() => goTo((active + 1) % total, 1), [active, total, goTo]);
  const prev = useCallback(() => goTo((active - 1 + total) % total, -1), [active, total, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [paused, next]);

  const review = reviews[active];

  return (
    <section className="py-14 sm:py-20 lg:py-28 overflow-hidden" style={{ background: "#F4F1EC" }}>
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="font-extrabold leading-tight"
              style={{ fontSize: "clamp(24px,3.8vw,52px)", color: "#0F172A", letterSpacing: "-0.028em" }}
            >
              What Our{" "}
              <span className="font-serif italic font-normal" style={{ color: "#1F8C9E" }}>
                Travellers Say
              </span>
            </h2>
            <p className="mt-2 max-w-md" style={{ color: "#94A3B8", fontSize: 15 }}>
              Real experiences from real people who trusted BookTick for their dream journeys.
            </p>
          </motion.div>

          {/* Trust pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-3 rounded-2xl self-start lg:self-auto"
            style={{ background: "#fff", border: "1px solid #EEF0F3", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          >
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" style={{ color: "#F59E0B" }} />
              ))}
            </div>
            <span className="font-black text-[12px] sm:text-[15px]" style={{ color: "#0F172A" }}>4.9</span>
            <span className="w-px h-3 sm:h-4 block" style={{ background: "#E2E8F0" }} />
            <span className="text-[10px] sm:text-[13px] font-medium" style={{ color: "#64748B" }}>500+ happy travellers</span>
            <span className="w-px h-3 sm:h-4 block" style={{ background: "#E2E8F0" }} />
            <span className="text-[10px] sm:text-[13px] font-bold" style={{ color: "#1F8C9E" }}>Google Verified</span>
          </motion.div>
        </div>

        {/* ── Thumbnail strip — above card ── */}
        <motion.div
          className="mb-6 lg:hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 py-1.5">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                onClick={() => goTo(i, i > active ? 1 : -1)}
                className="relative rounded-lg overflow-hidden shrink-0 group transition-all duration-200 active:scale-95 focus:outline-none"
                style={{
                  width: "calc(25% - 6px)",
                  minWidth: 72,
                  height: 52,
                  boxShadow:
                    i === active
                      ? "0 0 0 2px #1F8C9E, 0 0 0 5px rgba(31,140,158,0.15), 0 4px 12px rgba(0,0,0,0.12)"
                      : "0 0 0 1.5px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.08)",
                }}
              >
                <Image
                  src={r.cover}
                  alt={r.destination}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="80px"
                />
                <div
                  className="absolute inset-0 flex items-end px-1.5 pb-1"
                  style={{ background: "linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 65%)" }}
                >
                  <span className="text-white text-[9px] font-semibold leading-tight truncate w-full">
                    {r.destination.split(",")[0]}
                  </span>
                </div>
                {i === active && (
                  <div className="absolute top-1 right-1">
                    <span
                      className="block w-1.5 h-1.5 rounded-full"
                      style={{ background: "#1F8C9E", boxShadow: "0 0 0 2px rgba(31,140,158,0.3)" }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Immersive Hero Card ── */}
        <motion.div
          className="relative rounded-[24px] overflow-hidden"
          style={{ height: "clamp(400px, 48vw, 560px)", boxShadow: "0 40px 100px rgba(0,0,0,0.18)" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Background image ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${active}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
            >
              <Image
                src={review.cover}
                alt={review.destination}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* ── Dark gradient — heavy left, fades to transparent right ── */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(4,14,20,0.97) 0%, rgba(4,14,20,0.90) 32%, rgba(4,14,20,0.60) 55%, rgba(4,14,20,0.12) 78%, transparent 100%)",
            }}
          />
          {/* Bottom dark fade for badges */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(4,14,20,0.55) 0%, transparent 35%)" }}
          />
          {/* Mobile: extra overlay so full-width text stays readable */}
          <div
            className="absolute inset-0 sm:hidden"
            style={{ background: "rgba(4,14,20,0.38)" }}
          />

          {/* ── Quote content ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`quote-${active}`}
              className="absolute inset-0 flex flex-col justify-center max-w-full sm:max-w-[62%] pb-14 sm:pb-0"
              style={{ paddingLeft: "clamp(20px, 5vw, 64px)", paddingRight: "clamp(20px, 5vw, 48px)" }}
              initial={{ opacity: 0, x: direction * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -32 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Destination pill */}
              <div className="mb-4 sm:mb-6">
                <span
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-1.5 rounded-full"
                  style={{ background: "rgba(31,140,158,0.28)", color: "#7ED8E8", border: "1px solid rgba(31,140,158,0.40)" }}
                >
                  📍 {review.destination}
                </span>
              </div>

              {/* Giant quote icon */}
              <Quote
                className="mb-3 shrink-0"
                style={{ width: 36, height: 36, color: "#1F8C9E", opacity: 0.55 }}
                strokeWidth={2.5}
              />

              {/* Quote text */}
              <blockquote
                className="font-light leading-[1.72] mb-5 sm:mb-7 text-white"
                style={{ fontSize: "clamp(15px, 1.55vw, 21px)" }}
              >
                &ldquo;{review.comment}&rdquo;
              </blockquote>

              {/* Thin divider */}
              <div
                className="mb-4 sm:mb-6"
                style={{ width: 48, height: 2, borderRadius: 99, background: "rgba(31,140,158,0.70)" }}
              />

              {/* Profile row */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative shrink-0">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    style={{
                      width: 48, height: 48,
                      border: "2.5px solid rgba(255,255,255,0.25)",
                      boxShadow: "0 0 0 2px rgba(31,140,158,0.45)",
                    }}
                  />
                  <span
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#040e14]"
                    style={{ background: "#22C55E" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-[14px] leading-snug">{review.name}</p>
                  <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.50)" }}>{review.role}</p>
                  {/* Stars on mobile — tucked under the role */}
                  <div className="flex gap-0.5 mt-1.5 sm:hidden">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-current" style={{ color: s <= review.rating ? "#F59E0B" : "rgba(255,255,255,0.18)" }} />
                    ))}
                  </div>
                </div>
                {/* Stars on desktop — to the right */}
                <div className="hidden sm:flex gap-0.5 sm:ml-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" style={{ color: s <= review.rating ? "#F59E0B" : "rgba(255,255,255,0.18)" }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Counter top-right ── */}
          <div
            className="absolute top-5 right-6 text-[12px] font-bold text-white/80 px-3 py-1 rounded-full backdrop-blur-sm z-10"
            style={{ background: "rgba(0,0,0,0.30)", border: "1px solid rgba(255,255,255,0.14)" }}
          >
            {active + 1} / {total}
          </div>

          {/* ── Navigation — bottom right ── */}
          <div className="absolute bottom-5 right-6 z-10 flex items-center gap-2.5">
            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 mr-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > active ? 1 : -1)}
                  aria-label={`Go to review ${i + 1}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 20 : 7,
                    height: 7,
                    background: i === active ? "#fff" : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={prev}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", backdropFilter: "blur(8px)" }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg,#1F8C9E,#0E6F7F)", boxShadow: "0 4px 14px rgba(31,140,158,0.50)", color: "#fff" }}
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* ── Thumbnail strip ── */}
        <motion.div
          className="mt-8 hidden lg:block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-center text-[10px] font-bold uppercase tracking-[0.14em] mb-4"
            style={{ color: "#C4C9D4" }}
          >
            Destinations Our Travellers Loved
          </p>
          <div className="flex gap-4 lg:gap-5 justify-center flex-nowrap">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                onClick={() => goTo(i, i > active ? 1 : -1)}
                className="relative rounded-xl overflow-hidden shrink-0 group transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
                style={{
                  width: 152,
                  height: 96,
                  outline: i === active ? "2.5px solid #1F8C9E" : "1.5px solid rgba(0,0,0,0.10)",
                  outlineOffset: 3,
                  boxShadow:
                    i === active
                      ? "0 0 0 5px rgba(31,140,158,0.18), 0 8px 24px rgba(0,0,0,0.16)"
                      : "0 2px 10px rgba(0,0,0,0.12)",
                }}
              >
                <Image
                  src={r.cover}
                  alt={r.destination}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="152px"
                />
                {/* Name overlay */}
                <div
                  className="absolute inset-0 flex items-end p-2"
                  style={{ background: "linear-gradient(to top,rgba(0,0,0,0.68) 0%,transparent 55%)" }}
                >
                  <span className="text-white text-[11px] font-bold leading-tight">
                    {r.destination.split(",")[0]}
                  </span>
                </div>
                {/* Active glow dot */}
                {i === active && (
                  <div className="absolute top-2 right-2">
                    <span
                      className="block w-2 h-2 rounded-full"
                      style={{ background: "#1F8C9E", boxShadow: "0 0 0 2px rgba(31,140,158,0.35)" }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
