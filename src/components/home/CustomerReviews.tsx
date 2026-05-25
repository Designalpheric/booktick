"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ArrowUp } from "lucide-react";

/* ── Review data ─────────────────────────────────────────────────────────── */
const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Traveller",
    rating: 5,
    comment:
      "BookTick made our Goa trip absolutely perfect! The team was incredibly responsive and the hotel they arranged was stunning. Every detail handled.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Traveller",
    rating: 5,
    comment:
      "The Kerala backwaters houseboat experience was truly magical. Everything from airport pickup to the final drop-off was seamlessly handled.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Ananya Gupta",
    role: "Traveller",
    rating: 5,
    comment:
      "Dubai with BookTick was a dream! Desert safari, Burj Khalifa, fountain show — they covered everything and even helped with our visa. Simply outstanding service.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Vikram Nair",
    role: "Traveller",
    rating: 5,
    comment:
      "Our Ladakh trip was the adventure of a lifetime. Pangong Tso at sunrise — those moments will stay forever. Great value for money and superb execution.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Neha Patel",
    role: "Traveller",
    rating: 5,
    comment:
      "Bali honeymoon was beyond perfect! BookTick arranged a special candlelit dinner surprise for us. The villa and experiences were curated with so much care.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Arjun Kapoor",
    role: "Traveller",
    rating: 5,
    comment:
      "Thailand was incredible! From Bangkok's temples to Phi Phi islands — BookTick's itinerary covered it all. The WhatsApp support was instant and super helpful.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face",
  },
];

type Review = (typeof reviews)[number];

/* ── Card ────────────────────────────────────────────────────────────────── */
function ReviewCard({
  review,
  prominent,
}: {
  review: Review;
  prominent: boolean;
}) {
  return (
    <div
      className="relative rounded-2xl p-6 sm:p-7 flex flex-col h-full"
      style={{
        backgroundColor: prominent
          ? "rgba(31,140,158,0.13)"
          : "rgba(31,140,158,0.07)",
        minHeight: prominent ? 340 : 320,
        boxShadow: prominent
          ? "0 18px 40px -22px rgba(31,140,158,0.45)"
          : "none",
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <Image
            src={review.avatar}
            alt={review.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="font-bold text-base leading-tight" style={{ color: "#343434" }}>
              {review.name}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{review.role}</p>
          </div>
        </div>
        <div className="flex gap-0.5 shrink-0 pt-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className="w-3.5 h-3.5 fill-current"
              style={{ color: s <= review.rating ? "#F2A93B" : "rgba(0,0,0,0.12)" }}
            />
          ))}
        </div>
      </div>

      <p
        className="text-sm sm:text-[15px] leading-relaxed mb-6 flex-1"
        style={{ color: "#343434" }}
      >
        &ldquo;{review.comment}&rdquo;
      </p>

      <div className="flex justify-center">
        {prominent ? (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#1F8C9E" }}
          >
            <Quote className="w-5 h-5 text-white fill-current" />
          </div>
        ) : (
          <Quote className="w-6 h-6 fill-current" style={{ color: "#1F8C9E" }} />
        )}
      </div>
    </div>
  );
}

/* ── Animated slot — fades + slides between reviews ──────────────────────── */
function AnimatedSlot({
  review,
  prominent,
}: {
  review: Review;
  prominent: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={review.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="h-full"
      >
        <ReviewCard review={review} prominent={prominent} />
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */
export default function CustomerReviews() {
  const total = reviews.length;
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);

  const get = useCallback(
    (offset: number) => reviews[(active + offset + total) % total],
    [active, total]
  );

  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);
  const prev = useCallback(
    () => setActive((a) => (a - 1 + total) % total),
    [total]
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section className="py-20 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header — fade-in-up on scroll */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
            style={{ color: "#343434" }}
          >
            What Our Travellers Say
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Real experiences from real people who trusted BookTick
          </p>
        </motion.div>

        {/* 3-card layout — middle elevated, sides offset down */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="md:mt-12">
            <AnimatedSlot review={get(-1)} prominent={false} />
          </div>
          <div className="md:-mt-2">
            <AnimatedSlot review={get(0)} prominent={true} />
          </div>
          <div className="md:mt-12">
            <AnimatedSlot review={get(1)} prominent={false} />
          </div>
        </motion.div>

        {/* Dots + up arrow */}
        <div className="relative mt-12 flex items-center justify-center">
          <div className="flex gap-3">
            {reviews.map((_, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show review ${i + 1}`}
                  className="w-3 h-3 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: isActive ? "#1F8C9E" : "transparent",
                    border: `1.5px solid ${isActive ? "#1F8C9E" : "rgba(31,140,158,0.55)"}`,
                  }}
                />
              );
            })}
          </div>

          <button
            onClick={prev}
            aria-label="Previous review"
            className="absolute right-0 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{
              border: "1.5px solid #1F8C9E",
              backgroundColor: "transparent",
            }}
          >
            <ArrowUp className="w-5 h-5" style={{ color: "#1F8C9E" }} />
          </button>
        </div>
      </div>
    </section>
  );
}
