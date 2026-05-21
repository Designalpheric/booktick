"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, Clock, ArrowRight } from "lucide-react";
import { packages } from "@/data/packages";
import { formatCurrency } from "@/lib/utils";
import EnquiryModal from "@/components/ui/EnquiryModal";

export default function DealsSection() {
  const deals = packages.filter((p) => p.discount).slice(0, 3);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<{ destination: string; title: string } | null>(null);

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-3">
              <Tag className="w-3.5 h-3.5" />
              Limited Time Offers
            </div>
            <h2 className="text-3xl font-extrabold text-white">Hot Deals & Offers</h2>
            <p className="text-orange-100 mt-2">Grab these exclusive deals before they expire</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deals.map((deal) => {
              const originalPrice = Math.round(deal.priceFrom / (1 - deal.discount! / 100));
              return (
                <div key={deal.id} className="bg-white rounded-2xl overflow-hidden shadow-xl group">
                  <div className="relative h-44">
                    <Image
                      src={deal.coverImage}
                      alt={deal.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {/* Discount badge */}
                    <div className="absolute top-3 right-3 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full">
                      {deal.discount}% OFF
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{deal.duration}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-base mb-1">{deal.title}</h3>
                    <p className="text-gray-500 text-xs mb-3">{deal.destination}, {deal.country}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(deal.priceFrom)}</span>
                        <span className="text-sm text-gray-400 line-through ml-2">{formatCurrency(originalPrice)}</span>
                        <p className="text-green-600 text-xs font-medium">
                          Save {formatCurrency(originalPrice - deal.priceFrom)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedDeal({ destination: deal.destination, title: deal.title });
                          setEnquiryOpen(true);
                        }}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                      >
                        Grab Deal
                      </button>
                      <Link
                        href={`/packages/${deal.slug}`}
                        className="flex-1 border border-orange-500 text-orange-600 hover:bg-orange-50 text-sm font-semibold py-2 rounded-xl text-center transition-colors flex items-center justify-center gap-1"
                      >
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        prefillDestination={selectedDeal?.destination}
        prefillPackageOrFlight={selectedDeal?.title}
        enquiryType="package"
        title="Enquire About This Deal"
      />
    </>
  );
}
