"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Plane, Globe, Star, Shield, Clock,
  ChevronDown, ArrowRight, Users, Calendar, Search,
} from "lucide-react";

/* ── Static data ──────────────────────────────────────────────────────────── */
const tabs = [
  { id: "packages",     label: "Packages"     },
  { id: "flights",      label: "Flights"      },
  { id: "destinations", label: "Destinations" },
] as const;
type TabId = typeof tabs[number]["id"];

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const travellerOptions = ["Solo (1 Person)","2 People","3–4 People","5–8 People","Group (9+)"];
const categoryOptions  = ["Beaches","Mountains","Heritage","Adventure","Wildlife","Luxury","Pilgrimage"];

const popularFilters: Record<TabId, string[]> = {
  packages:     ["Goa","Kerala","Bali","Rajasthan","Maldives","Ladakh","Thailand"],
  flights:      ["Delhi → Dubai","Mumbai → Bali","Delhi → Bangkok","Chennai → Singapore"],
  destinations: ["Beaches","Mountains","Heritage","Adventure","Luxury"],
};

/* ── Search-panel sub-components ──────────────────────────────────────────── */
function FieldWrap({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3.5 flex-1 min-w-0">
      <Icon className="w-5 h-5 shrink-0" style={{ color: "#43C6D9" }} />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide mb-1 text-gray-400">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

function TextField({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm font-medium text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
    />
  );
}

function SelectField({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full text-sm font-medium bg-transparent focus:outline-none appearance-none cursor-pointer pr-5 ${
          value ? "text-gray-800" : "text-gray-400"
        }`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-gray-800">{o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function HeroBanner() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("packages");

  const [pkgDest,   setPkgDest]   = useState("");
  const [pkgMonth,  setPkgMonth]  = useState("");
  const [pkgPeople, setPkgPeople] = useState("");
  const [fltFrom,   setFltFrom]   = useState("");
  const [fltTo,     setFltTo]     = useState("");
  const [fltMonth,  setFltMonth]  = useState("");
  const [dstSearch, setDstSearch] = useState("");
  const [dstCat,    setDstCat]    = useState("");
  const [dstStyle,  setDstStyle]  = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "packages") {
      const q = pkgDest.trim();
      router.push(`/packages${q ? `?search=${encodeURIComponent(q)}` : ""}`);
    } else if (activeTab === "flights") {
      const q = [fltFrom, fltTo].filter(Boolean).join(" ");
      router.push(`/flights${q ? `?search=${encodeURIComponent(q)}` : ""}`);
    } else {
      const q = dstSearch.trim() || dstCat;
      router.push(`/destinations${q ? `?search=${encodeURIComponent(q)}` : ""}`);
    }
  };

  const handleFilter = (f: string) => {
    const toggled = f === activeFilter;
    setActiveFilter(toggled ? null : f);
    if (activeTab === "packages") {
      setPkgDest(toggled ? "" : f);
    } else if (activeTab === "flights") {
      if (toggled) { setFltFrom(""); setFltTo(""); }
      else if (f.includes("→")) {
        const [from, to] = f.split("→").map((s) => s.trim());
        setFltFrom(from); setFltTo(to);
      }
    } else {
      setDstSearch(toggled ? "" : f);
      setDstCat(toggled ? "" : f);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=1080&fit=crop')`,
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 hero-gradient" />
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-24 text-center w-full">

        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          Trusted by 10,000+ happy travellers across India
        </div>

        {/* Headline — two lines, gold accent on "Your Way!" */}
        <h1 className="font-extrabold leading-tight mb-4">
          <span className="block text-4xl sm:text-5xl lg:text-6xl text-white">
            Explore the World,
          </span>
          <span className="block text-4xl sm:text-5xl lg:text-6xl" style={{ color: "#F5B61A" }}>
            Your Way!
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Discover handcrafted travel packages and flight options. Enquire instantly —{" "}
          our experts handle the rest.
        </p>

        {/* ── Search Panel ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-4xl mx-auto text-left">

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setActiveFilter(null); }}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={
                  activeTab === tab.id
                    ? { backgroundColor: "#12004D", color: "#ffffff" }
                    : { color: "#6b7280" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch}>
            {/* Input row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">

              {activeTab === "packages" && (
                <>
                  <FieldWrap icon={MapPin} label="Destination">
                    <TextField placeholder="Goa, Kerala, Dubai…" value={pkgDest} onChange={setPkgDest} />
                  </FieldWrap>
                  <FieldWrap icon={Calendar} label="Travel Month">
                    <SelectField placeholder="Select month" options={months} value={pkgMonth} onChange={setPkgMonth} />
                  </FieldWrap>
                  <FieldWrap icon={Users} label="Travellers">
                    <SelectField placeholder="Select travellers" options={travellerOptions} value={pkgPeople} onChange={setPkgPeople} />
                  </FieldWrap>
                </>
              )}

              {activeTab === "flights" && (
                <>
                  <FieldWrap icon={Plane} label="From">
                    <TextField placeholder="Departure city" value={fltFrom} onChange={setFltFrom} />
                  </FieldWrap>
                  <FieldWrap icon={MapPin} label="To">
                    <TextField placeholder="Destination city" value={fltTo} onChange={setFltTo} />
                  </FieldWrap>
                  <FieldWrap icon={Calendar} label="Travel Month">
                    <SelectField placeholder="Select month" options={months} value={fltMonth} onChange={setFltMonth} />
                  </FieldWrap>
                </>
              )}

              {activeTab === "destinations" && (
                <>
                  <FieldWrap icon={Search} label="Search">
                    <TextField placeholder="Mountains, Beaches, Heritage…" value={dstSearch} onChange={setDstSearch} />
                  </FieldWrap>
                  <FieldWrap icon={Globe} label="Category">
                    <SelectField placeholder="Select category" options={categoryOptions} value={dstCat} onChange={setDstCat} />
                  </FieldWrap>
                  <FieldWrap icon={Users} label="Travel Style">
                    <SelectField
                      placeholder="Solo, Couple, Family…"
                      options={["Solo","Couple","Family","Group","Honeymoon"]}
                      value={dstStyle}
                      onChange={setDstStyle}
                    />
                  </FieldWrap>
                </>
              )}
            </div>

            {/* Filters + Search button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 shrink-0">
                  Filters:
                </span>
                {popularFilters[activeTab].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleFilter(f)}
                    className="text-xs px-4 py-1.5 rounded-full border font-semibold transition-all"
                    style={
                      activeFilter === f
                        ? { backgroundColor: "#12004D", color: "#fff", borderColor: "#12004D" }
                        : { color: "#374151", borderColor: "#e5e7eb", backgroundColor: "transparent" }
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 text-white text-sm font-bold px-7 py-3.5 rounded-2xl transition-all hover:opacity-90 active:scale-95 shadow-lg w-full sm:w-auto shrink-0 whitespace-nowrap"
                style={{ backgroundColor: "#12004D" }}
              >
                Search Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
          {[
            { icon: Shield, text: "100% Secure Enquiry" },
            { icon: Clock,  text: "Response in 2 Hours"  },
            { icon: Star,   text: "4.8★ Rated Service"   },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-orange-300" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
        <span className="text-xs">Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
