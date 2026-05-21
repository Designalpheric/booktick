import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { destinations } from "@/data/destinations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Destinations — BookTick Travel",
  description: "Explore 50+ destinations across India and the world. Find travel packages for beaches, mountains, heritage sites, and more.",
};

export default function DestinationsPage() {
  const popular = destinations.filter((d) => d.popular);
  const others = destinations.filter((d) => !d.popular);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Explore Destinations</h1>
          <p className="text-teal-100">From pristine beaches to snow-capped peaks — discover your next adventure</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-orange-500">⭐</span> Most Popular Destinations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {popular.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100"
            >
              <div className="relative h-48">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                  <p className="text-white/70 text-xs">{dest.country}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">{dest.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-orange-500 font-semibold text-sm">
                    <Package className="w-4 h-4" />
                    {dest.packageCount} packages
                  </div>
                  <span className="text-orange-500 text-sm font-medium group-hover:underline">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">More Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {others.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100"
            >
              <div className="relative h-40">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-bold">{dest.name}</h3>
                  <p className="text-white/70 text-xs">{dest.country}</p>
                </div>
              </div>
              <div className="p-3">
                <p className="text-orange-500 font-semibold text-sm flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  {dest.packageCount} packages
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
