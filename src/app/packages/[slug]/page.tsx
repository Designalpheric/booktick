"use client";

import { useState } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Clock, Users, Star, Check, X, ChevronDown, ChevronUp,
  MessageSquare, Phone, Share2, Heart, ArrowLeft
} from "lucide-react";
import { packages } from "@/data/packages";
import { formatCurrency } from "@/lib/utils";
import { getWhatsAppUrl, packageEnquiryMessage } from "@/lib/whatsapp";
import EnquiryModal from "@/components/ui/EnquiryModal";
import PackageCard from "@/components/packages/PackageCard";

export default function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const pkg = packages.find((p) => p.slug === slug);
  if (!pkg) notFound();

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [openDay, setOpenDay] = useState<number | null>(0);

  const related = packages.filter((p) => p.id !== pkg.id && p.destination === pkg.destination).slice(0, 3);
  const moreRelated = related.length < 3
    ? packages.filter((p) => p.id !== pkg.id && p.category === pkg.category).slice(0, 3 - related.length)
    : [];

  const allRelated = [...related, ...moreRelated].slice(0, 3);

  const tabs = ["itinerary", "inclusions", "reviews", "faqs"];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-500">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-orange-500">Packages</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{pkg.title}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-72 sm:h-96">
                  <Image
                    src={pkg.gallery[activeImage]}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {pkg.badge && (
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        {pkg.badge}
                      </span>
                    )}
                    {pkg.discount && (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        {pkg.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
                {/* Thumbnails */}
                <div className="p-3 flex gap-2 overflow-x-auto">
                  {pkg.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                        activeImage === i ? "border-orange-500" : "border-transparent"
                      }`}
                    >
                      <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{pkg.destination}, {pkg.country}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pkg.category === "international" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                        {pkg.category === "international" ? "International" : "National"}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{pkg.title}</h1>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="p-2 border border-gray-200 rounded-xl hover:border-red-300 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-xl hover:border-blue-300 hover:text-blue-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100 mb-4">
                  <div className="text-center">
                    <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-800 text-sm">{pkg.duration}</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Group Size</p>
                    <p className="font-semibold text-gray-800 text-sm">{pkg.minTravellers}–{pkg.maxTravellers} pax</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="font-semibold text-gray-800 text-sm">{pkg.rating} ({pkg.reviewCount} reviews)</p>
                  </div>
                </div>

                {/* Highlights */}
                <h3 className="font-bold text-gray-900 mb-3">Package Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-orange-600" />
                      </div>
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-4 text-sm font-semibold capitalize transition-colors shrink-0 ${
                        activeTab === tab
                          ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {/* Itinerary */}
                  {activeTab === "itinerary" && (
                    <div className="space-y-3">
                      {pkg.itinerary.map((day, i) => (
                        <div key={day.day} className="border border-gray-100 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenDay(openDay === i ? null : i)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 text-left">
                              <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                <span className="text-orange-600 font-bold text-sm">{day.day}</span>
                              </div>
                              <div>
                                <p className="text-xs text-orange-500 font-medium">Day {day.day}</p>
                                <p className="font-semibold text-gray-900 text-sm">{day.title}</p>
                              </div>
                            </div>
                            {openDay === i ? (
                              <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                            )}
                          </button>
                          {openDay === i && (
                            <div className="px-4 pb-4 border-t border-gray-50">
                              <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-3">{day.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {day.meals.map((meal) => (
                                  <span key={meal} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-100">
                                    🍽️ {meal}
                                  </span>
                                ))}
                                {day.accommodation && (
                                  <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-100">
                                    🏨 {day.accommodation}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inclusions */}
                  {activeTab === "inclusions" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-green-700 text-base mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          </div>
                          Inclusions
                        </h3>
                        <ul className="space-y-2">
                          {pkg.inclusions.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-red-700 text-base mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <X className="w-3.5 h-3.5 text-red-600" />
                          </div>
                          Exclusions
                        </h3>
                        <ul className="space-y-2">
                          {pkg.exclusions.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                              <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Reviews */}
                  {activeTab === "reviews" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="text-center">
                          <p className="text-4xl font-extrabold text-gray-900">{pkg.rating}</p>
                          <div className="flex gap-0.5 justify-center my-1">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`w-4 h-4 ${s <= pkg.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">{pkg.reviewCount} reviews</p>
                        </div>
                      </div>
                      {pkg.reviews.map((rev) => (
                        <div key={rev.id} className="border border-gray-100 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Image src={rev.avatar} alt={rev.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{rev.name}</p>
                              <p className="text-xs text-gray-400">{rev.location} · {rev.date}</p>
                            </div>
                            <div className="ml-auto flex gap-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* FAQs */}
                  {activeTab === "faqs" && (
                    <div className="space-y-3">
                      {pkg.faqs.map((faq, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium text-gray-900 text-sm pr-4">{faq.question}</span>
                            {openFaq === i ? (
                              <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                            )}
                          </button>
                          {openFaq === i && (
                            <div className="px-4 pb-4 border-t border-gray-50">
                              <p className="text-gray-600 text-sm leading-relaxed mt-3">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Enquiry Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="mb-4">
                  <p className="text-xs text-gray-400">Starting from</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900">{formatCurrency(pkg.priceFrom)}</span>
                    <span className="text-gray-400 text-sm">/ person</span>
                  </div>
                  {pkg.discount && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-400 text-sm line-through">
                        {formatCurrency(Math.round(pkg.priceFrom / (1 - pkg.discount / 100)))}
                      </span>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {pkg.discount}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Enquiry buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setEnquiryOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Submit Enquiry
                  </button>
                  <a
                    href={getWhatsAppUrl(packageEnquiryMessage(pkg.title, pkg.destination))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contact on WhatsApp
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-orange-400 text-gray-700 hover:text-orange-600 font-semibold py-3 rounded-xl transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call for Details
                  </a>
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                  <p className="text-amber-800 text-xs font-medium">⚠️ No direct booking — all reservations are handled by our travel experts after enquiry.</p>
                </div>

                {/* Quick info */}
                <div className="mt-5 space-y-2.5 pt-5 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Duration</span>
                    <span className="font-medium text-gray-800">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Min Travellers</span>
                    <span className="font-medium text-gray-800">{pkg.minTravellers} person(s)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Destination</span>
                    <span className="font-medium text-gray-800">{pkg.destination}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/packages"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all packages
              </Link>
            </div>
          </div>

          {/* Related Packages */}
          {allRelated.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allRelated.map((p) => (
                  <PackageCard key={p.id} pkg={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        prefillDestination={pkg.destination}
        prefillPackageOrFlight={pkg.title}
        enquiryType="package"
        title={`Enquire: ${pkg.title}`}
      />
    </>
  );
}
