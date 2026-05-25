"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PlaneTakeoff, ArrowLeftRight, Search, X, SlidersHorizontal } from "lucide-react";
import { flights, popularRoutes } from "@/data/flights";
import FlightCard from "@/components/flights/FlightCard";

/* ── Sidebar filter section ───────────────────────────────────────────────── */
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pb-5 mb-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-extrabold uppercase tracking-[0.12em]" style={{ color: "#1a1a1a" }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-1">
      <div
        onClick={onChange}
        className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
        style={{
          border: checked ? "none" : "1.5px solid #d1d5db",
          backgroundColor: checked ? "#1F8C9E" : "transparent",
        }}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
    </label>
  );
}

/* ── Main content ─────────────────────────────────────────────────────────── */
function FlightsContent() {
  const searchParams = useSearchParams();
  const [from,        setFrom]        = useState(searchParams.get("from") || "");
  const [to,          setTo]          = useState(searchParams.get("to")   || "");
  const [sortBy,      setSortBy]      = useState("price-asc");
  const [airlineSearch, setAirlineSearch] = useState("");

  /* Sidebar filter state */
  const [filterDirect,   setFilterDirect]   = useState(false);
  const [filterBusiness, setFilterBusiness] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);

  const allAirlines = [...new Set(flights.map((f) => f.airline))].sort();
  const minFare     = Math.min(...flights.map((f) => f.estimatedFare));
  const maxFare     = Math.max(...flights.map((f) => f.estimatedFare));

  const toggleAirline = (a: string) =>
    setSelectedAirlines((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const swapRoutes = () => { setFrom(to); setTo(from); };

  const filtered = useMemo(() => {
    let result = [...flights];
    if (from) result = result.filter((f) =>
      f.from.toLowerCase().includes(from.toLowerCase()) ||
      f.fromCode.toLowerCase().includes(from.toLowerCase())
    );
    if (to) result = result.filter((f) =>
      f.to.toLowerCase().includes(to.toLowerCase()) ||
      f.toCode.toLowerCase().includes(to.toLowerCase())
    );
    if (filterDirect)   result = result.filter((f) => f.stops === 0);
    if (filterBusiness) result = result.filter((f) => f.class === "Business" || f.class === "First");
    if (selectedAirlines.length > 0) result = result.filter((f) => selectedAirlines.includes(f.airline));

    if (sortBy === "price-asc")  result.sort((a, b) => a.estimatedFare - b.estimatedFare);
    if (sortBy === "price-desc") result.sort((a, b) => b.estimatedFare - a.estimatedFare);
    return result;
  }, [from, to, filterDirect, filterBusiness, selectedAirlines, sortBy]);

  const cheapestFare = filtered.length > 0 ? Math.min(...filtered.map(f => f.estimatedFare)) : 0;

  const resetFilters = () => {
    setFrom(""); setTo(""); setFilterDirect(false);
    setFilterBusiness(false); setSelectedAirlines([]); setSortBy("price-asc");
  };

  const hasFilters = from || to || filterDirect || filterBusiness || selectedAirlines.length > 0;

  const visibleAirlines = allAirlines.filter((a) =>
    a.toLowerCase().includes(airlineSearch.toLowerCase())
  );

  const inputCls = "w-full pl-10 pr-4 py-3 text-sm font-medium rounded-xl focus:outline-none transition-all";
  const inputStyle = { border: "1px solid rgba(0,0,0,0.10)", backgroundColor: "#fafafa", color: "#1a1a1a" };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "#f4f6f8" }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        className="py-12"
        style={{ background: "linear-gradient(135deg, #0e5f6e 0%, #1F8C9E 55%, #2ba8bd 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <div
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: "rgba(255,255,255,0.13)", border: "1px solid rgba(255,255,255,0.22)" }}
            >
              <PlaneTakeoff className="w-4 h-4" />
              Enquiry-Only Flight Explorer
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
              Explore Available Flights
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
              Browse options and enquire via WhatsApp or our form — no direct booking
            </p>
          </div>

          {/* Search card */}
          <div
            className="max-w-3xl mx-auto p-4 sm:p-5"
            style={{ backgroundColor: "#fff", borderRadius: "20px", boxShadow: "0 20px 48px rgba(0,0,0,0.18)" }}
          >
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex-1 relative">
                <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#1F8C9E" }} />
                <input type="text" placeholder="From — City or Code" value={from}
                  onChange={(e) => setFrom(e.target.value)} className={inputCls} style={inputStyle} />
              </div>
              <button onClick={swapRoutes}
                className="mx-auto sm:mx-0 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 self-center transition-all hover:opacity-80"
                style={{ backgroundColor: "rgba(31,140,158,0.10)", color: "#1F8C9E" }}>
                <ArrowLeftRight className="w-4 h-4" />
              </button>
              <div className="flex-1 relative">
                <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90" style={{ color: "#1F8C9E" }} />
                <input type="text" placeholder="To — City or Code" value={to}
                  onChange={(e) => setTo(e.target.value)} className={inputCls} style={inputStyle} />
              </div>
              <button className="flex items-center justify-center gap-2 text-white text-sm font-bold px-7 py-3 rounded-xl transition-all hover:opacity-90 active:scale-95 shrink-0"
                style={{ backgroundColor: "#1F8C9E" }}>
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Popular routes */}
          <div className="mt-5 flex flex-wrap justify-center items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>Popular routes:</span>
            {popularRoutes.map((route) => (
              <button key={`${route.fromCode}-${route.toCode}`}
                onClick={() => { setFrom(route.from); setTo(route.to); }}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all hover:bg-white/25"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.20)" }}>
                {route.fromCode} → {route.toCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: sidebar + results ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 items-start">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <div
              className="bg-white p-5"
              style={{ borderRadius: "16px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" style={{ color: "#1F8C9E" }} />
                  <span className="font-extrabold text-sm" style={{ color: "#1a1a1a" }}>Filters</span>
                </div>
                {hasFilters && (
                  <button onClick={resetFilters}
                    className="text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: "#ef4444" }}>
                    Reset
                  </button>
                )}
              </div>

              {/* Search by airline */}
              <FilterSection title="Search by Airline">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text" placeholder="Search airline…"
                    value={airlineSearch} onChange={(e) => setAirlineSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg focus:outline-none"
                    style={{ border: "1px solid rgba(0,0,0,0.10)", backgroundColor: "#fafafa", color: "#1a1a1a" }}
                  />
                </div>
              </FilterSection>

              {/* Popular */}
              <FilterSection title="Popular">
                <CheckboxRow label="Direct Flight" checked={filterDirect} onChange={() => setFilterDirect(!filterDirect)} />
                <CheckboxRow label="Business / First Class" checked={filterBusiness} onChange={() => setFilterBusiness(!filterBusiness)} />
              </FilterSection>

              {/* Price range */}
              <FilterSection title="Price Range">
                <div className="flex items-center justify-between text-xs font-semibold mb-2" style={{ color: "#374151" }}>
                  <span style={{ backgroundColor: "rgba(31,140,158,0.10)", color: "#1F8C9E", padding: "2px 10px", borderRadius: "6px" }}>
                    ₹{(minFare / 1000).toFixed(0)}K
                  </span>
                  <span style={{ backgroundColor: "rgba(31,140,158,0.10)", color: "#1F8C9E", padding: "2px 10px", borderRadius: "6px" }}>
                    ₹{(maxFare / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="relative h-1.5 rounded-full" style={{ backgroundColor: "#e5e7eb" }}>
                  <div className="absolute inset-y-0 left-0 right-[20%] rounded-full" style={{ backgroundColor: "#1F8C9E" }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 shadow" style={{ borderColor: "#1F8C9E", left: "0%" }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 shadow" style={{ borderColor: "#1F8C9E", right: "20%" }} />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>₹{minFare.toLocaleString("en-IN")}</span>
                  <span>₹{maxFare.toLocaleString("en-IN")}</span>
                </div>
              </FilterSection>

              {/* Airline names */}
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.12em] block mb-3" style={{ color: "#1a1a1a" }}>
                  Airline Names
                </span>
                <div className="space-y-0.5">
                  {visibleAirlines.map((a) => (
                    <CheckboxRow
                      key={a} label={a}
                      checked={selectedAirlines.includes(a)}
                      onChange={() => toggleAirline(a)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Results ──────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Result header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-extrabold" style={{ color: "#1a1a1a" }}>
                <span style={{ color: "#1F8C9E" }}>{filtered.length}</span> Flights Found
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Sort By:</span>
                <select
                  value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm font-semibold border rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                  style={{ borderColor: "rgba(0,0,0,0.10)", color: "#1a1a1a", backgroundColor: "#fff" }}
                >
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
                {hasFilters && (
                  <button onClick={resetFilters}
                    className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: "#ef4444" }}>
                    <X className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Disclaimer banner */}
            <div
              className="flex items-start gap-3 px-4 py-3.5 mb-5 text-sm rounded-xl"
              style={{ backgroundColor: "rgba(31,140,158,0.07)", border: "1px solid rgba(31,140,158,0.15)", color: "#176D7B" }}
            >
              <PlaneTakeoff className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#1F8C9E" }} />
              <p>
                <strong>Enquiry only</strong> — Fares shown are estimates. Use the <strong>WhatsApp</strong> or <strong>Enquiry</strong> button on each card. Our team responds within 2 hours.
              </p>
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div
                className="text-center py-16 bg-white"
                style={{ borderRadius: "16px", border: "1px solid rgba(0,0,0,0.07)" }}
              >
                <div className="text-5xl mb-4">✈️</div>
                <h3 className="text-lg font-extrabold mb-2" style={{ color: "#1a1a1a" }}>No flights found</h3>
                <p className="text-sm mb-5 text-gray-500">Try adjusting your search or clearing filters</p>
                <button onClick={resetFilters}
                  className="px-7 py-2.5 rounded-2xl text-white text-sm font-bold hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#1F8C9E" }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    isCheapest={flight.estimatedFare === cheapestFare}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ backgroundColor: "#f4f6f8" }}>
        <div className="text-gray-400 text-sm">Loading flights…</div>
      </div>
    }>
      <FlightsContent />
    </Suspense>
  );
}
