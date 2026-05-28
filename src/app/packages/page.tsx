"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search, ArrowUpRight, MapPin, Phone, Compass, Sparkles, RotateCcw } from "lucide-react";
import Link from "next/link";
import { packages } from "@/data/packages";
import PackageCard from "@/components/packages/PackageCard";
import { Suspense } from "react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const BUDGET_RANGES = [
  { label: "Under ₹20,000", min: 0, max: 20000 },
  { label: "₹20,000 – ₹40,000", min: 20000, max: 40000 },
  { label: "₹40,000 – ₹80,000", min: 40000, max: 80000 },
  { label: "₹80,000+", min: 80000, max: Infinity },
];

const DURATION_OPTIONS = ["1-3 days", "4-6 days", "7-10 days", "10+ days"];
const TYPES = ["Beach", "Adventure", "Luxury", "Culture", "Honeymoon", "Heritage", "Nature", "Mountain"];

function PackagesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";
  const typeParam = searchParams.get("type") || "";

  const [search, setSearch] = useState(searchParam);
  const [category, setCategory] = useState(categoryParam === "all" ? "all" : categoryParam);
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(typeParam ? [typeParam] : []);
  const [sortBy, setSortBy] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filtered = useMemo(() => {
    let result = [...packages];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.destination.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (selectedBudget !== null) {
      const range = BUDGET_RANGES[selectedBudget];
      result = result.filter((p) => p.priceFrom >= range.min && p.priceFrom <= range.max);
    }

    if (selectedDuration) {
      result = result.filter((p) => {
        const d = p.durationDays;
        if (selectedDuration === "1-3 days") return d <= 3;
        if (selectedDuration === "4-6 days") return d >= 4 && d <= 6;
        if (selectedDuration === "7-10 days") return d >= 7 && d <= 10;
        if (selectedDuration === "10+ days") return d > 10;
        return true;
      });
    }

    if (selectedTypes.length > 0) {
      result = result.filter((p) => selectedTypes.some((t) => p.type.includes(t)));
    }

    if (sortBy === "price-asc") result.sort((a, b) => a.priceFrom - b.priceFrom);
    else if (sortBy === "price-desc") result.sort((a, b) => b.priceFrom - a.priceFrom);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));

    return result;
  }, [search, category, selectedBudget, selectedDuration, selectedTypes, sortBy]);

  const activeFilterCount =
    (selectedBudget !== null ? 1 : 0) +
    (selectedDuration ? 1 : 0) +
    selectedTypes.length +
    (category !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSelectedBudget(null);
    setSelectedDuration(null);
    setSelectedTypes([]);
    setSortBy("popular");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[70px] xs:pt-[72px] sm:pt-[82px] lg:pt-[84px]">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-7 xs:py-9 sm:py-12 lg:py-14">
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 text-center">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2">Travel Packages</h1>
          <p className="text-orange-100 text-sm xs:text-base">Discover {packages.length}+ handcrafted packages for every budget and style</p>
        </div>
      </div>

      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 xs:py-7 sm:py-8">
        {/* Top Bar */}
        <div className="flex flex-col xs:flex-row gap-3 mb-5 xs:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages, destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors"
            />
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 xs:flex-none min-w-0 px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-orange-300"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium hover:border-orange-400 hover:text-orange-600 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline">Filters</span>
              <span className="xs:hidden">Filter</span>
              {activeFilterCount > 0 && (
                <span className="bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="shrink-0 flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors px-2 py-2.5"
              >
                <X className="w-4 h-4 shrink-0" />
                <span className="hidden xs:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile + Tablet filter bottom-sheet (hidden on lg+) ─────────────────── */}
        {filtersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end px-3 pb-3">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              style={{ backdropFilter: "blur(3px)" }}
              onClick={() => setFiltersOpen(false)}
            />
            {/* Sheet */}
            <div className="relative bg-white rounded-[24px] flex flex-col" style={{ maxHeight: "86vh" }}>

              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-0 shrink-0">
                <div className="w-9 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Sheet header */}
              <div className="flex items-center justify-between px-5 pt-3 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-extrabold text-gray-900 text-lg">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {activeFilterCount} active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm font-semibold text-orange-500"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* divider */}
              <div className="h-px bg-gray-100 shrink-0 mx-5" />

              {/* Scrollable filter content */}
              <div className="overflow-y-auto px-5 pt-5 pb-3 flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-6">

                {/* ── Category ── */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Category</p>
                  <div className="flex gap-2">
                    {[
                      { value: "all",           label: "All" },
                      { value: "national",      label: "🇮🇳 National" },
                      { value: "international", label: "✈️ International" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setCategory(value)}
                        className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-all active:scale-95 ${
                          category === value
                            ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                            : "border-gray-200 text-gray-600 bg-gray-50/80"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Budget ── */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Budget</p>
                  <div className="grid grid-cols-2 gap-2">
                    {BUDGET_RANGES.map((range, i) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedBudget(selectedBudget === i ? null : i)}
                        className={`py-3 px-3 text-xs font-semibold rounded-xl border transition-all active:scale-95 text-left leading-tight ${
                          selectedBudget === i
                            ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                            : "border-gray-200 text-gray-600 bg-gray-50/80"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Duration ── */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Duration</p>
                  <div className="grid grid-cols-2 gap-2">
                    {DURATION_OPTIONS.map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDuration(selectedDuration === d ? null : d)}
                        className={`py-3 px-3 text-xs font-semibold rounded-xl border transition-all active:scale-95 ${
                          selectedDuration === d
                            ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                            : "border-gray-200 text-gray-600 bg-gray-50/80"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Travel Type ── */}
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Travel Type</p>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all active:scale-95 ${
                          selectedTypes.includes(type)
                            ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                            : "border-gray-200 text-gray-600 bg-gray-50/80"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Apply CTA */}
              <div className="px-5 pt-3 pb-6 shrink-0">
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full py-4 rounded-2xl bg-orange-500 active:bg-orange-600 text-white font-bold text-sm transition-colors shadow-lg shadow-orange-500/25"
                >
                  Show {filtered.length} {filtered.length === 1 ? "Package" : "Packages"}
                </button>
              </div>

            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* ── Desktop sidebar (lg+ only) ──────────────────────── */}
          {filtersOpen && (
            <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-gray-900 text-base">Filters</h3>
                    {activeFilterCount > 0 && (
                      <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
                    )}
                  </div>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs font-semibold text-orange-500 hover:text-orange-600">Reset</button>
                  )}
                </div>
                <div className="h-px bg-gray-100" />

                {/* Category */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Category</p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { value: "all",           label: "All Packages" },
                      { value: "national",      label: "🇮🇳 National" },
                      { value: "international", label: "✈️ International" },
                    ].map(({ value, label }) => (
                      <button key={value} onClick={() => setCategory(value)}
                        className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all text-left ${
                          category === value
                            ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                            : "border-gray-200 text-gray-600 bg-gray-50/80 hover:border-gray-300"
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Budget</p>
                  <div className="flex flex-col gap-1.5">
                    {BUDGET_RANGES.map((range, i) => (
                      <button key={range.label} onClick={() => setSelectedBudget(selectedBudget === i ? null : i)}
                        className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all text-left ${
                          selectedBudget === i
                            ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                            : "border-gray-200 text-gray-600 bg-gray-50/80 hover:border-gray-300"
                        }`}>
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Duration</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DURATION_OPTIONS.map((d) => (
                      <button key={d} onClick={() => setSelectedDuration(selectedDuration === d ? null : d)}
                        className={`text-xs font-semibold px-2 py-2 rounded-xl border transition-all ${
                          selectedDuration === d
                            ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                            : "border-gray-200 text-gray-600 bg-gray-50/80 hover:border-gray-300"
                        }`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travel Type */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Travel Type</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TYPES.map((type) => (
                      <button key={type} onClick={() => toggleType(type)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                          selectedTypes.includes(type)
                            ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                            : "border-gray-200 text-gray-600 bg-gray-50/80 hover:border-gray-300"
                        }`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Package Grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-4">
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> packages
            </p>

            {filtered.length === 0 ? (
              <div className="flex justify-center py-10 sm:py-14 px-2">
                <div
                  className="relative w-full max-w-xl overflow-hidden"
                  style={{
                    borderRadius: 28,
                    background: "linear-gradient(180deg, #FFFFFF 0%, #FAFCFD 100%)",
                    border: "1px solid #EEF2F4",
                    boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 24px 56px -16px rgba(15,23,42,0.10)",
                  }}
                >
                  {/* Decorative blob */}
                  <div
                    aria-hidden
                    className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(31,140,158,0.10), transparent 70%)" }}
                  />
                  <div
                    aria-hidden
                    className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(242,169,59,0.08), transparent 70%)" }}
                  />

                  {/* ── Top section ── */}
                  <div className="relative px-6 sm:px-10 pt-10 sm:pt-12 pb-7 text-center">
                    {/* Stacked icon illustration */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div
                        className="absolute inset-0 rounded-3xl rotate-6"
                        style={{ background: "linear-gradient(135deg, rgba(31,140,158,0.18), rgba(31,140,158,0.06))" }}
                      />
                      <div
                        className="absolute inset-0 rounded-3xl -rotate-3 flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #1F8C9E 0%, #0E6F7F 100%)",
                          boxShadow: "0 8px 20px -6px rgba(31,140,158,0.55)",
                        }}
                      >
                        <Compass className="w-9 h-9 text-white" strokeWidth={1.75} />
                      </div>
                      <Sparkles
                        className="absolute -top-1 -right-1 w-5 h-5"
                        style={{ color: "#F2A93B" }}
                        strokeWidth={2.25}
                      />
                    </div>

                    <h3
                      className="font-extrabold text-gray-900 mb-2"
                      style={{ fontSize: "clamp(20px, 2.4vw, 26px)", letterSpacing: "-0.02em" }}
                    >
                      {search
                        ? <>No matches for &ldquo;<span style={{ color: "#1F8C9E" }}>{search}</span>&rdquo;</>
                        : "Nothing matches those filters"}
                    </h3>
                    <p className="text-[14px] text-gray-500 leading-relaxed max-w-sm mx-auto mb-6">
                      Try a different keyword, broaden your filters, or browse one of our most-loved destinations below.
                    </p>

                    {/* Popular destinations chips */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-widest w-full mb-1 text-gray-400">
                        Popular searches
                      </span>
                      {["Goa", "Kerala", "Dubai", "Bali", "Maldives", "Thailand"].map((dest) => (
                        <button
                          key={dest}
                          onClick={() => { clearFilters(); setSearch(dest); }}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all hover:-translate-y-0.5 active:scale-95"
                          style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            color: "#374151",
                            boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                          }}
                        >
                          <MapPin className="w-3 h-3" style={{ color: "#1F8C9E" }} />
                          {dest}
                        </button>
                      ))}
                    </div>

                    {/* Reset filters */}
                    {(search || category !== "all" || selectedBudget !== null || selectedDuration || selectedTypes.length > 0) && (
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors hover:text-gray-800"
                        style={{ color: "#6B7280" }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset all filters
                      </button>
                    )}
                  </div>

                  {/* Divider with "OR" pill */}
                  <div className="relative flex items-center px-6 sm:px-10">
                    <div className="flex-1 h-px" style={{ background: "#EEF2F4" }} />
                    <span
                      className="px-3 py-1 text-[10px] font-bold tracking-widest text-gray-400 rounded-full"
                      style={{ background: "#fff", border: "1px solid #EEF2F4" }}
                    >
                      OR
                    </span>
                    <div className="flex-1 h-px" style={{ background: "#EEF2F4" }} />
                  </div>

                  {/* ── Concierge CTA ── */}
                  <div className="relative px-6 sm:px-10 py-8">
                    <div className="text-center mb-5">
                      <p className="text-[15px] font-bold text-gray-900 mb-1">
                        Let our travel experts plan it for you
                      </p>
                      <p className="text-[13px] text-gray-500 leading-relaxed max-w-sm mx-auto">
                        Free 24-hour personalised itinerary tailored to your style and budget.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                      {/* Contact Us */}
                      <Link
                        href="/contact"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-full font-bold text-[13px] transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-95"
                        style={{
                          background: "linear-gradient(135deg, #1F8C9E 0%, #0E6F7F 100%)",
                          color: "#fff",
                          boxShadow: "0 6px 18px -4px rgba(31,140,158,0.45)",
                        }}
                      >
                        Plan My Trip
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>

                      {/* WhatsApp */}
                      <a
                        href={getWhatsAppUrl("Hi! I'm looking for a travel package and couldn't find what I need. Can you help me plan a custom trip?")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-full font-bold text-[13px] transition-all hover:bg-gray-50 hover:-translate-y-0.5 active:scale-95"
                        style={{ border: "1.5px solid #E5E7EB", color: "#1F2937", background: "#fff" }}
                      >
                        <svg className="w-4 h-4" fill="#16a34a" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>

                    {/* Trust microcopy */}
                    <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-gray-400 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#16a34a" }} />
                        Replies in &lt; 2 hrs
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-200" />
                      <span>No booking fee</span>
                      <span className="w-1 h-1 rounded-full bg-gray-200" />
                      <span>10,000+ travellers</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-2 xs:px-0">
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">
                  {filtered.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-[70px] xs:pt-[72px] sm:pt-[82px] flex items-center justify-center"><div className="text-gray-500">Loading packages...</div></div>}>
      <PackagesContent />
    </Suspense>
  );
}
