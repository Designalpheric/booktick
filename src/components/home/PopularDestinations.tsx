import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { destinations } from "@/data/destinations";

export default function PopularDestinations() {
  const popular = destinations.filter((d) => d.popular).slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header: heading left · description + CTA right ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">

          {/* Left — heading */}
          <div className="flex-1">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#43C6D9" }}
            >
              Explore
            </p>
            <h2
              className="text-4xl sm:text-5xl font-extrabold leading-tight"
              style={{ color: "#12004D" }}
            >
              Popular Destinations
            </h2>
          </div>

          {/* Right — description + CTA */}
          <div className="flex flex-col items-start lg:items-end gap-4 lg:max-w-sm">
            <p className="text-gray-400 text-base leading-relaxed lg:text-right">
              Handpicked destinations loved by thousands of travellers
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-3 rounded-full transition-all hover:opacity-90 active:scale-95 shadow-md"
              style={{ backgroundColor: "#12004D" }}
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Three-column card grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popular.map((dest, i) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group block"
            >
              {/* Image */}
              <div
                className="relative overflow-hidden rounded-3xl mb-4"
                style={{ height: 260 }}
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* "Most Popular" badge */}
                {i === 0 && (
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-white text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "#43C6D9" }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Package count pill — bottom right on image */}
                <div
                  className="absolute bottom-4 right-4 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(18,0,77,0.65)" }}
                >
                  {dest.packageCount} packages
                </div>
              </div>

              {/* ── Card content ── */}
              <div className="px-1">

                {/* Title row: name left · country right */}
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className="font-extrabold text-xl leading-snug group-hover:opacity-80 transition-opacity"
                    style={{ color: "#12004D" }}
                  >
                    {dest.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm shrink-0 ml-2">
                    <MapPin className="w-3.5 h-3.5" style={{ color: "#43C6D9" }} />
                    <span>{dest.country}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  {dest.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-10 lg:hidden">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-white text-sm font-bold px-8 py-3 rounded-full transition-all hover:opacity-90"
            style={{ backgroundColor: "#12004D" }}
          >
            View all destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
