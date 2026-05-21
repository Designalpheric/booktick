"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Package, ArrowLeft } from "lucide-react";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import PackageCard from "@/components/packages/PackageCard";

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const dest = destinations.find((d) => d.slug === slug);
  if (!dest) notFound();

  const destPackages = packages.filter(
    (p) => p.destination.toLowerCase() === dest.name.toLowerCase() ||
           p.country.toLowerCase() === dest.country.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative h-72 sm:h-96">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Link href="/destinations" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            All Destinations
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">{dest.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <MapPin className="w-4 h-4" />
              {dest.country}
            </div>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Package className="w-4 h-4" />
              {dest.packageCount} packages available
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Description */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About {dest.name}</h2>
          <p className="text-gray-600 leading-relaxed">{dest.description}</p>
          <p className="text-gray-600 leading-relaxed mt-3">
            {dest.name} is a premier travel destination offering extraordinary experiences for every kind of traveller.
            Whether you&apos;re looking for adventure, relaxation, culture, or romance — our curated packages ensure you
            get the best of {dest.name} without any hassle. Enquire now and our travel experts will create a
            personalised itinerary just for you.
          </p>
        </div>

        {/* Packages */}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
          Packages to {dest.name}
          <span className="text-sm font-normal text-gray-500 ml-2">({destPackages.length} available)</span>
        </h2>

        {destPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-gray-700 font-semibold">No packages currently listed for {dest.name}</p>
            <p className="text-gray-500 text-sm mt-2 mb-4">Contact us directly and we&apos;ll create a custom package for you!</p>
            <Link href="/contact" className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors">
              Enquire for Custom Package
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
