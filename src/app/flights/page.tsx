"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plane, ArrowLeftRight, Search, SlidersHorizontal, X } from "lucide-react";
import { flights, popularRoutes } from "@/data/flights";
import FlightCard from "@/components/flights/FlightCard";

function FlightsContent() {
  const searchParams = useSearchParams();
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [flightClass, setFlightClass] = useState("all");
  const [stops, setStops] = useState("all");
  const [airline, setAirline] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");

  const airlines = [...new Set(flights.map((f) => f.airline))];

  const swapRoutes = () => {
    setFrom(to);
    setTo(from);
  };

  const filtered = useMemo(() => {
    let result = [...flights];

    if (from) {
      result = result.filter(
        (f) =>
          f.from.toLowerCase().includes(from.toLowerCase()) ||
          f.fromCode.toLowerCase().includes(from.toLowerCase())
      );
    }
    if (to) {
      result = result.filter(
        (f) =>
          f.to.toLowerCase().includes(to.toLowerCase()) ||
          f.toCode.toLowerCase().includes(to.toLowerCase())
      );
    }
    if (flightClass !== "all") {
      result = result.filter((f) => f.class === flightClass);
    }
    if (stops !== "all") {
      result = result.filter((f) => (stops === "nonstop" ? f.stops === 0 : f.stops > 0));
    }
    if (airline !== "all") {
      result = result.filter((f) => f.airline === airline);
    }

    if (sortBy === "price-asc") result.sort((a, b) => a.estimatedFare - b.estimatedFare);
    else if (sortBy === "price-desc") result.sort((a, b) => b.estimatedFare - a.estimatedFare);
    else if (sortBy === "duration") {
      result.sort((a, b) => {
        const parseDuration = (d: string) => {
          const [h, m] = d.replace("h ", ":").replace("m", "").split(":");
          return parseInt(h) * 60 + parseInt(m);
        };
        return parseDuration(a.duration) - parseDuration(b.duration);
      });
    }

    return result;
  }, [from, to, flightClass, stops, airline, sortBy]);

  const clearFilters = () => {
    setFrom("");
    setTo("");
    setFlightClass("all");
    setStops("all");
    setAirline("all");
    setSortBy("price-asc");
  };

  const hasFilters = from || to || flightClass !== "all" || stops !== "all" || airline !== "all";

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full mb-3">
              <Plane className="w-4 h-4" />
              Enquiry-Only Flight Explorer
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Explore Available Flights</h1>
            <p className="text-blue-200">Browse flight options and enquire via WhatsApp or our form — no direct booking</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="From — City or Code"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                />
              </div>
              <button
                onClick={swapRoutes}
                className="mx-auto sm:mx-0 w-9 h-9 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 transition-colors shrink-0 self-center"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
              <div className="flex-1 relative">
                <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                <input
                  type="text"
                  placeholder="To — City or Code"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                />
              </div>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shrink-0"
                onClick={() => {/* search already reactive */}}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-blue-200 text-xs">Popular routes:</span>
            {popularRoutes.map((route) => (
              <button
                key={`${route.fromCode}-${route.toCode}`}
                onClick={() => { setFrom(route.from); setTo(route.to); }}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors border border-white/20"
              >
                {route.fromCode} → {route.toCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
              <SlidersHorizontal className="w-4 h-4" />
              Filter:
            </div>
            <select
              value={flightClass}
              onChange={(e) => setFlightClass(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-300"
            >
              <option value="all">All Classes</option>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First">First Class</option>
            </select>
            <select
              value={stops}
              onChange={(e) => setStops(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-300"
            >
              <option value="all">All Stops</option>
              <option value="nonstop">Non-stop</option>
              <option value="stops">1+ Stop</option>
            </select>
            <select
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-300"
            >
              <option value="all">All Airlines</option>
              {airlines.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-300"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration">Shortest Duration</option>
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                Clear filters
              </button>
            )}
            <span className="ml-auto text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{filtered.length}</span> flights found
            </span>
          </div>
        </div>

        {/* Flight disclaimer */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-sm text-blue-800 flex items-start gap-2">
          <Plane className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
          <p>
            <strong>Important:</strong> This platform is for enquiry purposes only. Fares shown are estimates and may vary. To get confirmed pricing and availability, use the <strong>Send Enquiry</strong> or <strong>WhatsApp</strong> button on each flight card. Our team will respond within 2 hours.
          </p>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No flights found</h3>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your search filters or clearing them</p>
            <button onClick={clearFilters} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center"><div className="text-gray-500">Loading flights...</div></div>}>
      <FlightsContent />
    </Suspense>
  );
}
