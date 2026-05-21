"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Review data with destination images ─────────────────────────────────── */
const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Delhi · Dec 2024",
    rating: 5,
    comment: "BookTick made our Goa trip absolutely perfect! The team was incredibly responsive and the hotel was stunning.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=420&fit=crop",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    location: "Mumbai · Nov 2024",
    rating: 5,
    comment: "The Kerala backwaters houseboat was truly magical. Everything from pickup to drop-off was seamlessly handled.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=420&fit=crop",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Ananya Gupta",
    location: "Bangalore · Dec 2024",
    rating: 5,
    comment: "Dubai with BookTick was a dream! Desert safari, Burj Khalifa — they covered everything and even helped with our visa.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=420&fit=crop",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Vikram Nair",
    location: "Chennai · Oct 2024",
    rating: 5,
    comment: "Ladakh at sunrise — those moments will stay forever. Pangong Tso was breathtaking. Great value for money!",
    image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600&h=420&fit=crop",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Neha Patel",
    location: "Ahmedabad · Dec 2024",
    rating: 5,
    comment: "Bali honeymoon was beyond perfect! The candlelit dinner surprise was so thoughtful. Everything felt magical.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=420&fit=crop",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Arjun Kapoor",
    location: "Pune · Nov 2024",
    rating: 5,
    comment: "Thailand was incredible! Bangkok temples to Phi Phi islands — BookTick's itinerary was absolutely spot on.",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=420&fit=crop",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
  },
];

const CARD_W = 280;   // card width in px
const STEP   = 292;   // center-to-center distance (creates ~20px gap at adjacent scale)

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function getOffset(idx: number, active: number, total: number) {
  let o = idx - active;
  if (o >  total / 2) o -= total;
  if (o < -total / 2) o += total;
  return o;
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function CustomerReviews() {
  const [active, setPrev] = useState(2);        // start at index 2
  const [paused, setPaused] = useState(false);
  const total = reviews.length;

  const setActive = setPrev; // alias for clarity

  const next = useCallback(() => setActive((a) => (a + 1) % total), [total, setActive]);
  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total, setActive]);

  /* Auto-advance */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section className="py-20 bg-white">

      {/* ── Header ── */}
      <div className="max-w-2xl mx-auto px-4 text-center mb-14">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "#43C6D9" }}
        >
          Testimonials
        </p>
        <h2
          className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
          style={{ color: "#12004D" }}
        >
          What Our Travellers Say
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          Real experiences from real people who trusted BookTick
        </p>

        {/* Rating badge */}
        <div className="mt-6 inline-flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-3">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-gray-900">4.8</p>
            <div className="flex justify-center gap-0.5 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gray-500">Average rating</p>
          </div>
          <div className="w-px h-10 bg-amber-200" />
          <div className="text-left">
            <p className="font-bold text-gray-900">10,000+ Reviews</p>
            <p className="text-xs text-gray-500">Across all platforms</p>
          </div>
        </div>
      </div>

      {/* ── Carousel ── */}
      <div
        className="relative overflow-hidden select-none"
        style={{ height: 440 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {reviews.map((review, idx) => {
          const offset = getOffset(idx, active, total);
          const absO   = Math.abs(offset);

          // only render cards within ±2 positions
          if (absO > 2.4) return null;

          const x       = offset * STEP;
          const scale   = absO === 0 ? 1 : absO <= 1 ? 0.88 : 0.76;
          const opacity = absO === 0 ? 1 : absO <= 1 ? 0.82 : 0.45;
          const zIndex  = Math.round(10 - absO * 3);

          return (
            <div
              key={review.id}
              onClick={() => setActive(idx)}
              className="absolute top-1/2 left-1/2 cursor-pointer"
              style={{
                width: `${CARD_W}px`,
                transform: `translate(calc(-50% + ${x}px), -50%) scale(${scale})`,
                opacity,
                zIndex,
                transition:
                  "transform 0.55s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.5s ease",
              }}
            >
              {/* Card */}
              <div
                className="rounded-3xl overflow-hidden bg-white"
                style={{
                  boxShadow:
                    absO === 0
                      ? "0 24px 60px rgba(18,0,77,0.18)"
                      : "0 8px 24px rgba(0,0,0,0.10)",
                }}
              >
                {/* Destination photo */}
                <div className="relative overflow-hidden" style={{ height: 230 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  {/* Bottom gradient */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,0,40,0.55) 0%, transparent 100%)",
                    }}
                  />
                </div>

                {/* Review info */}
                <div className="px-5 py-4">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-2.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200 fill-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Name + location */}
                  <p className="font-bold text-gray-900 text-base leading-snug">
                    {review.name}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 mb-2.5">{review.location}</p>

                  {/* Quote */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Left arrow ── */}
        <button
          onClick={prev}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
          style={{ border: "1px solid #e5e7eb" }}
          aria-label="Previous review"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* ── Right arrow ── */}
        <button
          onClick={next}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
          style={{ border: "1px solid #e5e7eb" }}
          aria-label="Next review"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* ── Dot indicators ── */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            aria-label={`Go to review ${idx + 1}`}
            style={{
              width:           idx === active ? "28px" : "8px",
              height:          "8px",
              borderRadius:    "4px",
              backgroundColor: idx === active ? "#12004D" : "#d1d5db",
              border:          "none",
              padding:         0,
              cursor:          "pointer",
              transition:      "all 0.35s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
