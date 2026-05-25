import Image from "next/image";
import Link from "next/link";

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

const pad = (n: number) => String(n).padStart(2, "0");

export default function PopularDestinations() {
  return (
    <section className="py-16 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Centered heading ──────────────────────────────────────── */}
        <div className="text-center mb-10">
          <h2
            className="font-heading text-4xl sm:text-5xl lg:text-6xl mb-3"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05, fontWeight: 700, color: "#343434" }}
          >
            Top Destinations
          </h2>

          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Explore our most loved travel spots and curated experiences.
          </p>
        </div>

        {/* ── Single-row destination grid (5 uniform cards) ────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {topDestinations.map((dest, i) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className={`group relative overflow-hidden rounded-2xl block transition-all duration-500 ease-out hover:-translate-y-1.5${i === topDestinations.length - 1 && topDestinations.length % 2 !== 0 ? " col-span-2 lg:col-span-1 max-w-[calc(50%-8px)] lg:max-w-none mx-auto lg:mx-0 w-full" : ""}`}
              style={{
                boxShadow:
                  "0 1px 2px rgba(20,20,20,0.04), 0 18px 32px -16px rgba(20,20,20,0.22)",
                aspectRatio: "3 / 4",
              }}
            >
              {/* Image — smooth zoom on hover */}
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />

              {/* Base bottom gradient — always visible */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(8,28,30,0.55) 75%, rgba(6,20,28,0.92) 100%)",
                }}
              />

              {/* Hover darken layer */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(15,40,50,0.10) 0%, rgba(15,40,55,0.45) 100%)",
                }}
              />

              {/* Bottom text */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <h3
                  className="text-white text-xl sm:text-[22px] font-bold mb-1 tracking-tight leading-tight"
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
