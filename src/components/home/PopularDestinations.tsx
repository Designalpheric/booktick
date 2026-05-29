"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";

/* ── Top Destinations data ────────────────────────────────────────────────── */
const topDestinations = [
  {
    slug: "goa",
    name: "Goa",
    trips: 12,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700&h=950&fit=crop",
  },
  {
    slug: "kerala",
    name: "Kerala",
    trips: 10,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&h=950&fit=crop",
  },
  {
    slug: "dubai",
    name: "Dubai",
    trips: 15,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&h=950&fit=crop",
  },
  {
    slug: "bali",
    name: "Bali",
    trips: 9,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&h=950&fit=crop",
  },
  {
    slug: "maldives",
    name: "Maldives",
    trips: 11,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&h=950&fit=crop",
  },
];

const N = topDestinations.length; // 5
const looped = [...topDestinations, ...topDestinations, ...topDestinations]; // 15 items

const pad = (n: number) => String(n).padStart(2, "0");

export default function PopularDestinations() {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── Scroll to middle copy on mount so looping works both ways ─── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const jump = () => {
      const firstMiddle = el.children[N] as HTMLElement | undefined;
      if (!firstMiddle) return;
      const left =
        firstMiddle.offsetLeft +
        firstMiddle.offsetWidth / 2 -
        el.clientWidth / 2;
      el.scrollTo({ left, behavior: "instant" as ScrollBehavior });
    };

    // rAF to ensure layout has completed
    const raf = requestAnimationFrame(jump);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Loop: after each snap settles, jump silently to middle copy ─ */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkAndJump = () => {
      const scrollCenter = el.scrollLeft + el.clientWidth / 2;
      const children = Array.from(el.children) as HTMLElement[];

      // Find which card is currently centred
      let centeredIdx = 0;
      let minDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(
          child.offsetLeft + child.offsetWidth / 2 - scrollCenter
        );
        if (dist < minDist) {
          minDist = dist;
          centeredIdx = i;
        }
      });

      // If in first copy → jump to same card in middle copy
      if (centeredIdx < N) {
        const target = children[centeredIdx + N];
        el.scrollTo({
          left: target.offsetLeft + target.offsetWidth / 2 - el.clientWidth / 2,
          behavior: "instant" as ScrollBehavior,
        });
      }
      // If in last copy → jump to same card in middle copy
      else if (centeredIdx >= N * 2) {
        const target = children[centeredIdx - N];
        el.scrollTo({
          left: target.offsetLeft + target.offsetWidth / 2 - el.clientWidth / 2,
          behavior: "instant" as ScrollBehavior,
        });
      }
    };

    // Use scrollend (modern) with debounced scroll fallback
    const supportsScrollEnd = "onscrollend" in window;
    if (supportsScrollEnd) {
      el.addEventListener("scrollend", checkAndJump);
      return () => el.removeEventListener("scrollend", checkAndJump);
    } else {
      let timer: ReturnType<typeof setTimeout>;
      const onScroll = () => {
        clearTimeout(timer);
        timer = setTimeout(checkAndJump, 200);
      };
      el.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        el.removeEventListener("scroll", onScroll);
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <section className="py-12 xs:py-14 sm:py-16 lg:py-20 2xl:py-24 bg-cream">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">

        {/* ── Centered heading ──────────────────────────────────────── */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2
            className="font-heading text-3xl xs:text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl mb-3"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05, fontWeight: 700, color: "#343434" }}
          >
            Top Destinations
          </h2>
          <p className="text-gray-500 text-sm xs:text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Explore our most loved travel spots and curated experiences.
          </p>
        </div>

        {/* ── Mobile / tablet: looping centered peek carousel (< lg) ── */}
        <div className="lg:hidden overflow-hidden -mx-4 sm:-mx-6">
          <div
            ref={scrollRef}
            className="flex gap-3 xs:gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-[15vw] xs:px-[18vw] sm:px-[14vw] pb-2"
          >
            {looped.map((dest, i) => (
              <Link
                key={`${dest.slug}-${i}`}
                href={`/destinations/${dest.slug}`}
                className="group relative overflow-hidden rounded-2xl block shrink-0 snap-center transition-all duration-500 ease-out active:scale-[0.98] w-[70vw] xs:w-[64vw] sm:w-[72vw]"
                style={{
                  boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 18px 32px -16px rgba(20,20,20,0.22)",
                  aspectRatio: "3 / 4",
                }}
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, transparent 40%, rgba(8,28,30,0.55) 75%, rgba(6,20,28,0.92) 100%)" }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 xs:p-5">
                  <h3
                    className="text-white text-base xs:text-lg font-bold mb-1 tracking-tight leading-tight"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
                  >
                    {dest.name}
                  </h3>
                  <p className="text-white/85 text-xs font-medium tracking-wide">
                    {pad(dest.trips)} Trips
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Desktop: grid (lg+) ──────────────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-5 2xl:gap-6">
          {topDestinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group relative overflow-hidden rounded-2xl block transition-all duration-500 ease-out hover:-translate-y-1.5"
              style={{
                boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 18px 32px -16px rgba(20,20,20,0.22)",
                aspectRatio: "3 / 4",
              }}
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                sizes="(max-width: 1024px) 33vw, 16vw"
              />
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{ background: "linear-gradient(180deg, transparent 40%, rgba(8,28,30,0.55) 75%, rgba(6,20,28,0.92) 100%)" }}
              />
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: "linear-gradient(180deg, rgba(15,40,50,0.10) 0%, rgba(15,40,55,0.45) 100%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <h3
                  className="text-white text-base xs:text-lg sm:text-xl xl:text-[22px] font-bold mb-1 tracking-tight leading-tight"
                  style={{ textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
                >
                  {dest.name}
                </h3>
                <p className="text-white/85 text-xs sm:text-sm font-medium tracking-wide">
                  {pad(dest.trips)} Trips
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
