"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Clock, ShieldCheck, Users, Wallet } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Layout constants
   ───────────────────────────────────────────────────────────────────────────── */
const CARD_H     = 290;              // px — each card's fixed height
const CARD_GAP   = 20;               // px — gap between cards in the visible column
const OFFSET     = CARD_H + CARD_GAP; // 310 px — one stack step
/* SECTION_VH = 200 → scroll distance = (200-100) = 100 vh.
   Animation ends at exactly 1.0 so the sticky releases the very moment
   Card 03 finishes — zero dead scroll.                                  */
const SECTION_VH = 200;

/* ─────────────────────────────────────────────────────────────────────────────
   Scroll windows — end at 1.0 so sticky releases exactly when last card stacks.
   Phase 1 [0.05 → 0.45]: Card 02 slides up  (~40 vh of scroll)
   Pause   [0.45 → 0.55]: brief hold          (~10 vh)
   Phase 2 [0.55 → 1.00]: Card 03 slides up  (~45 vh)
   ───────────────────────────────────────────────────────────────────────────── */
const SLIDE_WINDOWS: [number, number][] = [
  [0,    0   ],   // Card 01 — fixed base, never moves
  [0.05, 0.45],   // Card 02
  [0.55, 1.00],   // Card 03 — ends exactly at scroll end → zero dead space
];

/* ─────────────────────────────────────────────────────────────────────────────
   Feature cards — white → light-teal → brand-teal
   ───────────────────────────────────────────────────────────────────────────── */
const features = [
  {
    number: "01",
    title: "Meet our travel experts",
    desc: "We're more than just a travel service — we're your trusted companion on every journey and every booking, from local tips to full handcrafted itineraries.",
    href: "/packages",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=600&fit=crop",
    bg: "#FFFFFF",
    border: "1.5px solid rgba(31,140,158,0.20)",
    numColor: "rgba(31,140,158,0.14)",
    dark: false,
    shadow: "0 4px 28px rgba(31,140,158,0.10)",
  },
  {
    number: "02",
    title: "Handpicked destinations",
    desc: "Every destination is curated by our experts for safety, unique experiences, and memories that truly last a lifetime.",
    href: "/packages",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    bg: "#D6EEF3",
    border: "none",
    numColor: "rgba(21,95,107,0.22)",
    dark: false,
    shadow: "0 8px 36px rgba(31,140,158,0.18)",
  },
  {
    number: "03",
    title: "24/7 support, always",
    desc: "From the moment you book to your safe return home, our dedicated team is always just a call or message away.",
    href: "/contact",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    bg: "#1F8C9E",
    border: "none",
    numColor: "rgba(255,255,255,0.16)",
    dark: true,
    shadow: "0 12px 44px rgba(31,140,158,0.42)",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Bottom strip
   ───────────────────────────────────────────────────────────────────────────── */
const strip = [
  { Icon: Clock,       title: "24/7 Emergency Support",   desc: "We're here for you anytime, anywhere — day or night." },
  { Icon: ShieldCheck, title: "Safety-First Expeditions", desc: "Trained staff, emergency kits and real-time monitoring." },
  { Icon: Users,       title: "Certified Local Guides",   desc: "Certified guides who know every destination inside out." },
  { Icon: Wallet,      title: "All-Inclusive Adventures", desc: "No hidden fees or last-minute surprises. Just travel." },
];

/* ─────────────────────────────────────────────────────────────────────────────
   StackCard
   ─────────────────────────────────────────────────────────────────────────────
   All 3 cards are position:absolute inside an overflow:hidden deck window.
   They start in a visible column [0, OFFSET, 2×OFFSET] and collapse in
   two phases so there is never an empty gap between them:

   Phase 1 [0.08 → 0.38]  — the whole column compresses by OFFSET:
     Card 01: stays at 0
     Card 02: 310 → 0   (slides to Card 01's position)
     Card 03: 620 → 310  (follows Card 02, stays one OFFSET below it)

   Phase 2 [0.48 → 0.78]  — Card 03 completes its journey:
     Card 03: 310 → 0   (slides to Card 01's position)

   The deck wrapper height mirrors these phases exactly, so its bottom edge
   always tracks Card 03's bottom — zero empty space at every scroll point.
   ───────────────────────────────────────────────────────────────────────────── */
function StackCard({
  feature,
  index,
  total,
  scrollRef,
}: {
  feature: (typeof features)[0];
  index: number;
  total: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isMiddle = index > 0 && index < total - 1;

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  /* ── Y ──────────────────────────────────────────────────────────────────────
     Shared 6-keyframe timeline drives all three cards.
     Card i's y values:
       t=0 / 0.08            → i × OFFSET       (visible column, no movement)
       t=0.38 / 0.48         → max(0, (i−1)×OFFSET)  (after phase 1 compresses)
       t=0.78 / 1            → 0                (fully stacked at Card 01)
  ─────────────────────────────────────────────────────────────────────────── */
  const rawY = useTransform(
    scrollYProgress,
    [0,             0.05,           0.45,                          0.55,                          1.0],
    [index * OFFSET, index * OFFSET, Math.max(0, (index-1)*OFFSET), Math.max(0, (index-1)*OFFSET), 0  ],
    { clamp: true },
  );
  const y = useSpring(rawY, { stiffness: 140, damping: 28, mass: 0.7, restDelta: 0.5 });

  /* ── Scale + Opacity: Card 02 dims when Card 03 slides over it ───────────── */
  const burialWindow: [number, number] = SLIDE_WINDOWS[index + 1] ?? [0.99, 1];
  const rawScale = useTransform(
    scrollYProgress,
    isMiddle ? burialWindow : ([0.99, 1] as [number, number]),
    isMiddle ? [1, 0.94]    : [1, 1],
  );
  const scale = useSpring(rawScale, { stiffness: 140, damping: 28, mass: 0.7, restDelta: 0.001 });

  const rawOpacity = useTransform(
    scrollYProgress,
    isMiddle ? burialWindow : ([0.99, 1] as [number, number]),
    isMiddle ? [1, 0.65]    : [1, 1],
  );
  const opacity = useSpring(rawOpacity, { stiffness: 140, damping: 28, mass: 0.7, restDelta: 0.001 });

  const textColor = feature.dark ? "#FFFFFF"                : "#0F172A";
  const subColor  = feature.dark ? "rgba(255,255,255,0.78)" : "#64748B";
  const linkColor = feature.dark ? "#FFFFFF"                : "#1F8C9E";

  return (
    <motion.div
      style={{
        position: "absolute",         /* no layout height — no blank space   */
        top: 0, left: 0, right: 0,
        zIndex: index + 1,            /* later cards land on top             */
        y,
        scale,
        opacity,
        transformOrigin: "top center",
        willChange: "transform, opacity",
      }}
    >
      <div
        className="group flex overflow-hidden"
        style={{
          background: feature.bg,
          border: feature.border,
          borderRadius: 22,
          height: CARD_H,
          boxShadow: feature.shadow,
        }}
      >
        {/* Text ──────────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col justify-between px-8 py-7">
          <div>
            <p
              className="font-black leading-none select-none mb-3"
              style={{
                fontSize: "clamp(56px,6vw,86px)",
                color: feature.numColor,
                letterSpacing: "-0.04em",
                lineHeight: 0.85,
              }}
            >
              {feature.number}
            </p>
            <h3
              className="font-bold mb-2"
              style={{
                fontSize: "clamp(15px,1.4vw,18px)",
                color: textColor,
                letterSpacing: "-0.018em",
              }}
            >
              {feature.title}
            </h3>
            <p className="text-[13px] leading-relaxed" style={{ color: subColor, maxWidth: 310 }}>
              {feature.desc}
            </p>
          </div>
          <Link
            href={feature.href}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold mt-4 transition-all duration-200 group-hover:gap-3"
            style={{ color: linkColor }}
          >
            Learn more <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Image ──────────────────────────────────────────────────────────── */}
        <div className="relative shrink-0 overflow-hidden" style={{ width: "43%" }}>
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width:1024px) 50vw, 26vw"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main section
   ───────────────────────────────────────────────────────────────────────────── */
export default function ReasonsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Heights used by the deck wrapper */
  const TOTAL_H = CARD_H * 3 + CARD_GAP * 2;   // 910 px — all 3 cards visible
  const TWO_H   = CARD_H * 2 + CARD_GAP;        // 600 px — 2 cards visible

  /*
   * deckH mirrors the two-phase card animation exactly:
   *
   * Phase 1 [0.08 → 0.38]:  Column compresses (Card 02 stacks, Card 03 follows).
   *   wrapper: 910 → 600  (Card 03 bottom tracks from 910 to 600)
   *
   * Phase 2 [0.48 → 0.78]:  Card 03 slides the final OFFSET to y = 0.
   *   wrapper: 600 → 290  (Card 03 bottom tracks from 600 to 290)
   *
   * The wrapper bottom and Card 03's bottom move by the same amount in each
   * phase — no empty gap ever appears below the visible cards.
   */
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  /* rawDeckH tracks Card 03's bottom exactly (same keyframes, same magnitude).
     Wrapping it in the same spring as the card-y springs means the wrapper
     bottom lags in lockstep with Card 03 — no clipping ever occurs.
     The final useTransform clamps so the wrapper never shrinks below CARD_H. */
  const rawDeckH = useTransform(
    scrollYProgress,
    [0,       0.05,    0.45,  0.55,  1.0   ],
    [TOTAL_H, TOTAL_H, TWO_H, TWO_H, CARD_H],
    { clamp: true },
  );
  const deckHSpring = useSpring(rawDeckH, { stiffness: 140, damping: 28, mass: 0.7, restDelta: 0.5 });
  const deckH = useTransform(deckHSpring, (v) => Math.max(CARD_H, v));

  return (
    <section className="bg-white">

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP ≥ 1024 px
         ════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block">
        {/* Top spacer — sits outside scrollRef so it doesn't affect scroll timing */}
        <div className="h-24" />

        <div
          ref={scrollRef}
          className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-6 lg:px-8 2xl:px-12"
          style={{ minHeight: `${SECTION_VH}vh` }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "38% 1fr",
              columnGap: "5rem",
              alignItems: "start",
              minHeight: `${SECTION_VH}vh`,
            }}
          >
            {/* ── Left: sticky intro panel ─────────────────────────────── */}
            <div
              style={{
                position: "sticky",
                top: "92px",
                paddingTop: "4rem",
                zIndex: 40,
              }}
            >
              <span
                className="inline-flex items-center text-[11px] font-black uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(31,140,158,0.10)", color: "#1F8C9E" }}
              >
                Why Choose Us
              </span>

              <h2
                className="font-extrabold leading-tight mb-5"
                style={{
                  fontSize: "clamp(28px,3.4vw,46px)",
                  color: "#0F172A",
                  letterSpacing: "-0.028em",
                }}
              >
                Reasons people love{" "}
                <span className="font-serif italic font-normal" style={{ color: "#1F8C9E" }}>
                  travelling with us
                </span>
              </h2>

              <p
                className="text-[15px] leading-relaxed mb-8"
                style={{ color: "#64748B", maxWidth: 340 }}
              >
                We're more than just a travel service — we're your trusted
                companion on every journey and every booking, from local tips
                to full itineraries.
              </p>

              <Link
                href="/packages"
                className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full text-[14px] text-white transition-all hover:brightness-110 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg,#1F8C9E 0%,#0E6F7F 100%)",
                  boxShadow: "0 4px 20px rgba(31,140,158,0.35)",
                }}
              >
                Explore Packages
                <ArrowRight className="w-4 h-4" />
              </Link>


            </div>

            {/* ── Right: all 3 cards visible, collapse on scroll ───────── */}
            <div
              style={{
                paddingTop: "6rem",
                minHeight: `${SECTION_VH}vh`,
              }}
            >
              {/*
               * Sticky window — starts tall enough to show all 3 cards,
               * then shrinks to CARD_H as Card 03 slides up.
               * overflow:hidden ensures no blank space ever appears below.
               */}
              <motion.div
                style={{
                  position: "sticky",
                  top: "calc(92px + 6rem)",
                  height: deckH,           /* animated: TOTAL_H → CARD_H     */
                  overflow: "hidden",
                  /* No borderRadius here — each card has its own rounded corners.
                     A radius on the wrapper makes all 3 cards look like one big
                     blue container because cards 02/03 fill the 910px inner div. */
                }}
              >
                {/* Relative container sized to full column height so absolute
                    cards can start at their natural stacked positions */}
                <div style={{ position: "relative", height: TOTAL_H }}>
                  {features.map((f, i) => (
                    <StackCard
                      key={f.number}
                      feature={f}
                      index={i}
                      total={features.length}
                      scrollRef={scrollRef}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
        {/* Bottom spacer — mirrors the top h-24, separates scroll section from strip */}
        <div className="h-20" />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE / TABLET < 1024 px — static vertical list
         ════════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 2xl:px-12 py-10 xs:py-12 sm:py-16">

        {/* ── Intro header ─────────────────────────────────────────────── */}
        <div className="mb-7 sm:mb-10">
          <span
            className="inline-flex items-center text-[11px] font-black uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full mb-4 sm:mb-5"
            style={{ background: "rgba(31,140,158,0.10)", color: "#1F8C9E" }}
          >
            Why Choose Us
          </span>
          <h2
            className="font-extrabold leading-tight mb-3 sm:mb-4"
            style={{
              fontSize: "clamp(24px,6vw,38px)",
              color: "#0F172A",
              letterSpacing: "-0.028em",
            }}
          >
            Reasons people love{" "}
            <span className="font-serif italic font-normal" style={{ color: "#1F8C9E" }}>
              travelling with us
            </span>
          </h2>
          <p className="text-[14px] sm:text-[15px] leading-relaxed mb-5 sm:mb-6" style={{ color: "#64748B" }}>
            We're more than just a travel service — we're your trusted companion
            on every journey.
          </p>
          <Link
            href="/packages"
            className="flex sm:inline-flex items-center justify-center gap-2 font-bold px-7 py-3 sm:py-3.5 rounded-full text-[14px] text-white"
            style={{
              background: "linear-gradient(135deg,#1F8C9E 0%,#0E6F7F 100%)",
              boxShadow: "0 4px 20px rgba(31,140,158,0.35)",
            }}
          >
            Explore Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Feature cards ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {features.map((feature) => {
            const textColor = feature.dark ? "#FFFFFF"                : "#0F172A";
            const subColor  = feature.dark ? "rgba(255,255,255,0.78)" : "#64748B";
            const linkColor = feature.dark ? "#FFFFFF"                : "#1F8C9E";
            return (
              <div
                key={feature.number}
                className="group flex flex-col sm:flex-row overflow-hidden"
                style={{
                  background: feature.bg,
                  border: feature.border,
                  borderRadius: 20,
                  boxShadow: feature.shadow,
                }}
              >
                {/* Image — top (mobile) / right (sm+) */}
                <div
                  className="relative shrink-0 overflow-hidden w-full sm:w-[42%] sm:order-last"
                  style={{ height: "168px", borderRadius: "20px 20px 0 0" }}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 100vw, 42vw"
                  />
                  {/* Number overlay on image — mobile only */}
                  <span
                    className="sm:hidden absolute bottom-3 left-4 font-black leading-none select-none"
                    style={{
                      fontSize: "52px",
                      color: "rgba(255,255,255,0.55)",
                      letterSpacing: "-0.04em",
                      lineHeight: 0.85,
                      textShadow: "0 2px 8px rgba(0,0,0,0.30)",
                    }}
                  >
                    {feature.number}
                  </span>
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between px-5 py-4 sm:py-5">
                  <div>
                    {/* Number in text area — sm+ only */}
                    <p
                      className="hidden sm:block font-black leading-none select-none mb-2"
                      style={{
                        fontSize: "clamp(52px,12vw,70px)",
                        color: feature.numColor,
                        letterSpacing: "-0.04em",
                        lineHeight: 0.85,
                      }}
                    >
                      {feature.number}
                    </p>
                    <h3 className="font-bold text-[15px] mb-1.5" style={{ color: textColor }}>
                      {feature.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: subColor }}>
                      {feature.desc}
                    </p>
                  </div>
                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold mt-3 sm:mt-4 transition-all duration-200 hover:gap-2.5"
                    style={{ color: linkColor }}
                  >
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom strip ───────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "rgba(31,140,158,0.06)" }}>
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8 xs:py-10 sm:py-12 2xl:py-16">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
            {strip.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className={`flex flex-row xs:flex-col gap-3 xs:gap-4 px-4 xs:px-5 sm:px-7 py-4 xs:py-5 sm:py-8${
                  i < strip.length - 1
                    ? " border-b xs:border-b-0 xs:border-r border-[rgba(31,140,158,0.15)] last:border-0"
                    : ""
                }`}
              >
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0"
                  style={{ backgroundColor: "rgba(31,140,158,0.12)" }}
                >
                  <Icon className="w-5 h-5 text-[#1F8C9E]" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] mb-1.5" style={{ color: "#0F172A" }}>
                    {title}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#64748B" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
