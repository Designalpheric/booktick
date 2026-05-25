"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Star, Shield, BadgeCheck,
  Calendar, Search, Compass, ChevronDown,
  PlaneTakeoff, PlaneLanding, Users,
} from "lucide-react";

/* ── Data ─────────────────────────────────────────────────────────────────── */
const dateRanges = [
  "This Month", "Next Month", "In 1–3 Months", "In 3–6 Months", "Flexible Dates",
];
const activityTypes = [
  "Hiking & Trekking", "Wildlife & Safari", "Cultural & Heritage",
  "Beach & Islands", "Snow & Mountains", "Food & Local Life",
  "Photography Tours", "Wellness Retreats",
];
const cabinClasses = ["Economy", "Premium Economy", "Business", "First Class"];
// const passengerOptions = ["1 Adult", "2 Adults", "3 Adults", "4 Adults", "Family (2A+2C)"];

type Tab = "packages" | "flights";

/* ── Shared field wrapper ─────────────────────────────────────────────────── */
function Field({
  icon: Icon, label, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 flex-1 min-w-0 px-5 py-4 bg-white rounded-xl">
      <Icon className="w-[18px] h-[18px] shrink-0 text-gray-400" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">{label}</p>
        {children}
      </div>
    </div>
  );
}

function SelectInput({ value, onChange, placeholder, options }: {
  value: string; onChange: (v: string) => void;
  placeholder: string; options: string[];
}) {
  return (
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[15px] font-semibold bg-transparent focus:outline-none appearance-none cursor-pointer leading-tight pr-5"
        style={{ color: value ? "#343434" : "#9ca3af" }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o} style={{ color: "#343434" }}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-0 w-4 h-4 text-gray-400 pointer-events-none shrink-0" />
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-[15px] font-semibold bg-transparent focus:outline-none placeholder-gray-300 leading-tight"
      style={{ color: "#343434" }}
    />
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function HeroBanner() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("packages");

  /* Packages state */
  const [pkgWhere,    setPkgWhere]    = useState("");
  const [pkgWhen,     setPkgWhen]     = useState("");
  const [pkgActivity, setPkgActivity] = useState("");

  /* Flights state */
  const [flFrom,    setFlFrom]    = useState("");
  const [flTo,      setFlTo]      = useState("");
  const [flDate,    setFlDate]    = useState("");
  const [flCabin,   setFlCabin]   = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "packages") {
      const p = new URLSearchParams();
      if (pkgWhere) p.set("search", pkgWhere);
      router.push(`/packages${p.toString() ? `?${p}` : ""}`);
    } else {
      const p = new URLSearchParams();
      if (flFrom) p.set("from", flFrom);
      if (flTo)   p.set("to",   flTo);
      router.push(`/flights${p.toString() ? `?${p}` : ""}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1280&fit=crop')` }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 35%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.78) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.40) 100%)" }} />

      <div
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center"
        style={{ paddingTop: "clamp(80px, 14vh, 140px)", paddingBottom: "clamp(48px, 8vh, 80px)" }}
      >

        {/* Glass pill badge */}
        <div
          className="inline-flex items-center gap-2 text-white text-xs sm:text-sm font-semibold tracking-wide px-5 py-2 rounded-full mb-8"
          style={{ backgroundColor: "rgba(255,255,255,0.10)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.18)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#F2A93B" }} />
          Curated Tours
        </div>

        {/* Headline */}
        <h1
          className="text-white mb-6 w-full"
          style={{ lineHeight: 1.04, letterSpacing: "-0.03em", textShadow: "0 2px 24px rgba(0,0,0,0.30)" }}
        >
          <span className="block font-extrabold" style={{ fontSize: "clamp(28px, 8vw, 64px)" }}>
            Unforgettable{" "}
            <span className="font-heading font-extrabold not-italic" style={{ color: "#F2A93B" }}>
              Experiences
            </span>
          </span>
          <span className="block font-extrabold" style={{ fontSize: "clamp(28px, 8vw, 64px)" }}>
            Await You
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 mb-10 mx-auto leading-relaxed" style={{ fontSize: "clamp(15px, 1.5vw, 18px)", maxWidth: "560px" }}>
          Skip the tourist traps. Book extraordinary, expert-led tours and immersive activities designed for the modern explorer.
        </p>

        {/* ── Search card ───────────────────────────────────────────────── */}
        <div
          className="w-full rounded-3xl text-left"
          style={{
            backgroundColor: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            boxShadow: "0 24px 56px -16px rgba(0,0,0,0.50), 0 2px 6px rgba(0,0,0,0.06)",
            border: "1px solid rgba(255,255,255,0.70)",
            padding: "20px",
          }}
        >
          {/* ── Tabs ── */}
          <div
            className="inline-flex gap-1 p-1 mb-5 rounded-full"
            style={{ backgroundColor: "#f3f4f6" }}
          >
            {([
              { id: "packages" as Tab, label: "Packages",  icon: <Compass className="w-3.5 h-3.5" /> },
              { id: "flights"  as Tab, label: "Flights",   icon: <PlaneTakeoff className="w-3.5 h-3.5" /> },
            ]).map(({ id, label, icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                  style={
                    active
                      ? { backgroundColor: "rgba(31,140,158,0.13)", color: "#1F8C9E", boxShadow: "0 1px 3px rgba(31,140,158,0.12)" }
                      : { color: "#6b7280" }
                  }
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── Fields ── */}
          <form onSubmit={handleSearch}>
            <div
              className="flex flex-col sm:flex-row items-stretch gap-2"
              style={{ backgroundColor: "#f3f4f6", borderRadius: "14px", padding: "6px" }}
            >

              {activeTab === "packages" ? (
                <>
                  <Field icon={MapPin} label="Where to?">
                    <TextInput value={pkgWhere} onChange={setPkgWhere} placeholder="Bali, Alps, Kyoto…" />
                  </Field>

                  <Field icon={Calendar} label="When?">
                    <SelectInput value={pkgWhen} onChange={setPkgWhen} placeholder="Select dates" options={dateRanges} />
                  </Field>

                  <Field icon={Compass} label="Experience">
                    <SelectInput value={pkgActivity} onChange={setPkgActivity} placeholder="Activity type" options={activityTypes} />
                  </Field>
                </>
              ) : (
                <>
                  <Field icon={PlaneTakeoff} label="From">
                    <TextInput value={flFrom} onChange={setFlFrom} placeholder="Delhi, Mumbai…" />
                  </Field>

                  <Field icon={PlaneLanding} label="To">
                    <TextInput value={flTo} onChange={setFlTo} placeholder="Dubai, Bangkok…" />
                  </Field>

                  <Field icon={Calendar} label="Departure">
                    <SelectInput value={flDate} onChange={setFlDate} placeholder="Select dates" options={dateRanges} />
                  </Field>

                  <Field icon={Users} label="Cabin class">
                    <SelectInput value={flCabin} onChange={setFlCabin} placeholder="Economy" options={cabinClasses} />
                  </Field>
                </>
              )}

              {/* Search button */}
              <button
                type="submit"
                aria-label="Search"
                className="flex items-center justify-center rounded-xl transition-all hover:opacity-90 active:scale-95 shrink-0 py-4 sm:py-0 sm:px-7"
                style={{ backgroundColor: "#1F8C9E", minWidth: "64px" }}
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-x-10 gap-y-3 text-white/85 text-sm">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-[17px] h-[17px]" style={{ color: "#F2A93B" }} />
            <span className="font-medium">Expert Local Guides</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-[17px] h-[17px]" style={{ color: "#F2A93B" }} />
            <span className="font-medium">Flexible Cancellation</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-[17px] h-[17px] fill-current" style={{ color: "#F2A93B" }} />
            <span className="font-medium">4.9/5 Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
