import Image from "next/image";
import Link from "next/link";
import { Tag, Clock, ArrowRight } from "lucide-react";
import { packages } from "@/data/packages";
import { formatCurrency } from "@/lib/utils";

export default function DealsSection() {
  const deals = packages.filter((p) => p.discount).slice(0, 4);

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-5" style={{ border: "1px solid rgba(20,20,20,0.07)", boxShadow: "0 1px 2px rgba(20,20,20,0.04)" }}>
              <Tag className="w-3.5 h-3.5" style={{ color: "#F2A93B" }} />
              <span className="text-sm font-semibold" style={{ color: "#343434" }}>Limited Time Offers</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold leading-[1.05] mb-3" style={{ color: "#343434", letterSpacing: "-0.028em" }}>Hot Deals & Offers</h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-xl">Grab these exclusive deals before they expire</p>
          </div>
          <Link href="/packages" className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70 shrink-0" style={{ color: "#1F8C9E" }}>
            View all deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((deal) => {
            const originalPrice = Math.round(deal.priceFrom / (1 - (deal.discount ?? 0) / 100));
            return (
              <Link key={deal.id} href={`/packages/${deal.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-xl group block transition-transform duration-300 hover:-translate-y-1">
                <div className="relative h-40">
                  <Image src={deal.coverImage} alt={deal.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 font-bold text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(242,169,59,0.18)", color: "#92600a", backdropFilter: "blur(6px)" }}>
                    {deal.discount}% OFF
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-[11px]">
                    <Clock className="w-3 h-3" /><span>{deal.duration}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{deal.title}</h3>
                  <p className="text-gray-500 text-xs mb-3">{deal.destination}, {deal.country}</p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(deal.priceFrom)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
                  </div>
                  <p className="text-green-600 text-xs font-medium mt-0.5">Save {formatCurrency(originalPrice - deal.priceFrom)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
