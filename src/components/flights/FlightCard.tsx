"use client";

import { useState } from "react";
import { Plane, Clock, ChevronDown, ChevronUp, MessageSquare, Wifi, Coffee } from "lucide-react";
import { Flight } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { getWhatsAppUrl, flightEnquiryMessage } from "@/lib/whatsapp";
import EnquiryModal from "@/components/ui/EnquiryModal";

export default function FlightCard({ flight }: { flight: Flight }) {
  const [expanded, setExpanded] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const classColors = {
    Economy: "bg-green-100 text-green-700",
    Business: "bg-blue-100 text-blue-700",
    First: "bg-purple-100 text-purple-700",
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-5">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Airline */}
            <div className="flex items-center gap-3 sm:w-36">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm leading-tight">{flight.airline}</p>
                <p className="text-xs text-gray-400">{flight.aircraft}</p>
              </div>
            </div>

            {/* Route & times */}
            <div className="flex-1 flex items-center justify-between sm:justify-center gap-4">
              {/* Departure */}
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{flight.departure}</p>
                <p className="text-xs font-semibold text-gray-600">{flight.fromCode}</p>
                <p className="text-xs text-gray-400">{flight.from}</p>
              </div>

              {/* Route visual */}
              <div className="flex-1 max-w-40 flex flex-col items-center">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {flight.duration}
                </p>
                <div className="w-full flex items-center gap-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <Plane className="w-4 h-4 text-orange-500 rotate-90" />
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <p className="text-xs mt-1 text-center">
                  {flight.stops === 0 ? (
                    <span className="text-green-600 font-medium">Non-stop</span>
                  ) : (
                    <span className="text-amber-600 font-medium">{flight.stops} stop</span>
                  )}
                </p>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{flight.arrival}</p>
                <p className="text-xs font-semibold text-gray-600">{flight.toCode}</p>
                <p className="text-xs text-gray-400">{flight.to}</p>
              </div>
            </div>

            {/* Price & class */}
            <div className="sm:text-right flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
              <div>
                <p className="text-xs text-gray-400">Est. fare from</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(flight.estimatedFare)}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${classColors[flight.class]}`}>
                {flight.class}
              </span>
            </div>
          </div>

          {/* Stop details */}
          {flight.stopDetails && (
            <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 text-xs text-amber-700">
              {flight.stopDetails}
            </div>
          )}

          {/* Amenities */}
          <div className="mt-3 flex flex-wrap gap-2">
            {flight.amenities.map((a) => (
              <span key={a} className="bg-gray-50 border border-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                {a.toLowerCase().includes("wi-fi") ? <Wifi className="w-3 h-3" /> : <Coffee className="w-3 h-3" />}
                {a}
              </span>
            ))}
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? "Hide details" : "Flight details"}
          </button>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Airline</p>
                <p className="font-medium text-gray-800">{flight.airline}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Aircraft</p>
                <p className="font-medium text-gray-800">{flight.aircraft}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Class</p>
                <p className="font-medium text-gray-800">{flight.class}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Stops</p>
                <p className="font-medium text-gray-800">{flight.stops === 0 ? "Direct" : `${flight.stops} stop`}</p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
              ⚠️ <strong>Enquiry only</strong> — Fares shown are estimates. Actual pricing will be confirmed by our travel experts after your enquiry.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Send Enquiry
              </button>
              <a
                href={getWhatsAppUrl(flightEnquiryMessage(flight.from, flight.to, flight.airline, flight.departure))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        prefillDestination={flight.to}
        prefillPackageOrFlight={`${flight.airline} | ${flight.from} → ${flight.to} | ${flight.departure}`}
        enquiryType="flight"
        title="Flight Enquiry"
      />
    </>
  );
}
