"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { packages } from "@/data/packages";
import PackageCard from "@/components/packages/PackageCard";
import { Suspense } from "react";

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
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Travel Packages</h1>
          <p className="text-orange-100">Discover {packages.length}+ handcrafted packages for every budget and style</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
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
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-orange-300"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium hover:border-orange-400 hover:text-orange-600 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors px-2"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {filtersOpen && (
            <aside className="w-60 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24 space-y-6">
                {/* Category */}
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-3">Category</h3>
                  <div className="flex flex-col gap-1.5">
                    {["all", "national", "international"].map((c) => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={category === c}
                          onChange={() => setCategory(c)}
                          className="accent-orange-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{c === "all" ? "All Packages" : c}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-3">Budget</h3>
                  <div className="flex flex-col gap-1.5">
                    {BUDGET_RANGES.map((range, i) => (
                      <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="budget"
                          checked={selectedBudget === i}
                          onChange={() => setSelectedBudget(selectedBudget === i ? null : i)}
                          className="accent-orange-500"
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-3">Duration</h3>
                  <div className="flex flex-col gap-1.5">
                    {DURATION_OPTIONS.map((d) => (
                      <label key={d} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="duration"
                          checked={selectedDuration === d}
                          onChange={() => setSelectedDuration(selectedDuration === d ? null : d)}
                          className="accent-orange-500"
                        />
                        <span className="text-sm text-gray-700">{d}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-3">Travel Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selectedTypes.includes(type)
                            ? "bg-orange-500 border-orange-500 text-white"
                            : "border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-600"
                        }`}
                      >
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
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No packages found</h3>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold text-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
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
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center"><div className="text-gray-500">Loading packages...</div></div>}>
      <PackagesContent />
    </Suspense>
  );
}
