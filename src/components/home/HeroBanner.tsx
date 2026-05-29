"use client";

import { useState, useRef, useEffect, forwardRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Star, Shield, BadgeCheck,
  Calendar, ArrowRight, ArrowUpRight, Compass, ChevronDown,
  PlaneTakeoff, PlaneLanding,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { destinations } from "@/data/destinations";

/* ── Data ─────────────────────────────────────────────────────────────────── */
const QUICK_DATES = ["This Month", "Next Month", "In 1–3 Months", "In 3–6 Months", "Flexible Dates"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WDAYS  = ["Su","Mo","Tu","We","Th","Fr","Sa"];


type Tab = "packages" | "flights";

/* ── useClickOutside ──────────────────────────────────────────────────────── */
function useClickOutside(refs: React.RefObject<HTMLElement | null>[], handler: () => void) {
  const cb = useCallback(handler, [handler]);
  useEffect(() => {
    const fn = (e: MouseEvent | TouchEvent) => {
      if (refs.some(r => r.current?.contains(e.target as Node))) return;
      cb();
    };
    document.addEventListener("mousedown", fn);
    document.addEventListener("touchstart", fn);
    return () => { document.removeEventListener("mousedown", fn); document.removeEventListener("touchstart", fn); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cb]);
}

/* ── FloatingPanel ────────────────────────────────────────────────────────── */
interface FPProps { anchorRef: React.RefObject<HTMLElement | null>; isOpen: boolean; alignRight?: boolean; children: React.ReactNode; }
const FloatingPanel = forwardRef<HTMLDivElement, FPProps>(({ anchorRef, isOpen, alignRight = false, children }, ref) => {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<React.CSSProperties>({ position: "fixed", top: 0, left: 0 });
  const [isMobileView, setIsMobileView] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;
    const recalc = () => {
      if (!anchorRef.current) return;
      const r = anchorRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 640;
      setIsMobileView(mobile);

      if (mobile) {
        const panelW = Math.min(348, vw - 32);
        const left = (vw - panelW) / 2;
        const openUp = r.top > vh * 0.55;
        const top = openUp
          ? Math.max(8, r.top - 8 - 460)
          : Math.min(r.bottom + 8, vh - 460);
        setPos({ position: "fixed", zIndex: 9999, top: Math.max(8, top), left, width: panelW });
        return;
      }

      const openUp = r.top > vh * 0.5;
      let left = alignRight ? r.right - 348 : r.left;
      left = Math.max(8, Math.min(left, vw - 356));
      setPos({
        position: "fixed", zIndex: 9999,
        ...(openUp ? { bottom: vh - r.top + 8 } : { top: r.bottom + 8 }),
        left,
      });
    };
    recalc();
    window.addEventListener("scroll", recalc, true);
    window.addEventListener("resize", recalc);
    return () => { window.removeEventListener("scroll", recalc, true); window.removeEventListener("resize", recalc); };
  }, [isOpen, anchorRef, alignRight]);
  if (!mounted) return null;
  return createPortal(
    <>
      {isMobileView && isOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", zIndex: 9998 }} />
      )}
      <div ref={ref} style={pos}>{children}</div>
    </>,
    document.body
  );
});
FloatingPanel.displayName = "FloatingPanel";

const panelMotion = {
  hidden: { opacity: 0, y: 8,  scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.2, ease: [0.22,1,0.36,1] as [number,number,number,number] } },
  exit:   { opacity: 0, y: 4,  scale: 0.98, transition: { duration: 0.14 } },
};
const PANEL_STYLE: React.CSSProperties = {
  background: "#fff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04),0 20px 60px -10px rgba(0,0,0,0.18),0 8px 24px -6px rgba(0,0,0,0.10)",
  overflow: "hidden",
};

/* ── CalendarPicker ───────────────────────────────────────────────────────── */
function CalendarPicker({ value, onChange, placeholder, isOpen, onToggle, onClose, alignRight = false }: {
  value: string; onChange: (v: string) => void; placeholder: string;
  isOpen: boolean; onToggle: () => void; onClose: () => void;
  alignRight?: boolean;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  useClickOutside([triggerRef, panelRef], onClose);

  const today = new Date();
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const y = view.getFullYear(), m = view.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const startDay    = new Date(y, m, 1).getDay();
  const fmt    = (d: number) => new Date(y, m, d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const isPast = (d: number) => new Date(y, m, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isToday    = (d: number) => y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
  const isSelected = (d: number) => value === fmt(d);
  const cells: (number | null)[] = [...Array<null>(startDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div ref={triggerRef} className="relative flex items-center gap-1 cursor-pointer w-full" onClick={onToggle}>
      <span
        className="flex-1 text-[15px] font-semibold leading-tight truncate"
        style={{ color: value ? "#fff" : "rgba(255,255,255,0.60)" }}
      >
        {value || placeholder}
      </span>
      <ChevronDown
        className="w-3.5 h-3.5 shrink-0 transition-transform duration-300"
        style={{ color: "rgba(255,255,255,0.75)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
      />

      <FloatingPanel ref={panelRef} anchorRef={triggerRef} isOpen={isOpen} alignRight={alignRight}>
        <AnimatePresence>
          {isOpen && (
            <motion.div variants={panelMotion} initial="hidden" animate="show" exit="exit"
              style={{ ...PANEL_STYLE, width: "100%", maxWidth: 348 }}>

              {/* Calendar header */}
              <div style={{ background: "linear-gradient(135deg,#1F8C9E 0%,#0E6F7F 100%)", padding: "18px 16px 0" }}>
                <div className="flex items-center justify-between mb-3">
                  <button type="button"
                    onClick={e => { e.stopPropagation(); setView(new Date(y, m - 1, 1)); }}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-90 transition-all"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}>
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <div className="text-center select-none">
                    <span className="text-white font-bold text-[19px]">{MONTHS[m]}</span>
                    <span className="text-white/55 text-[15px] ml-2">{y}</span>
                  </div>
                  <button type="button"
                    onClick={e => { e.stopPropagation(); setView(new Date(y, m + 1, 1)); }}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-90 transition-all"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="grid grid-cols-7 pb-3">
                  {WDAYS.map(d => (
                    <div key={d} className="flex items-center justify-center h-7">
                      <span className="text-[11px] font-bold uppercase text-white/50 tracking-wide">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 px-2 pt-2 pb-2">
                {cells.map((day, i) => day === null ? <div key={`_${i}`} /> : (
                  <div key={day} className="flex items-center justify-center" style={{ height: 44 }}>
                    <button type="button" disabled={isPast(day)}
                      onClick={e => { e.stopPropagation(); onChange(fmt(day)); onClose(); }}
                      className={[
                        "w-9 h-9 flex items-center justify-center rounded-full text-[13.5px] font-medium transition-all select-none",
                        isSelected(day) ? "text-white font-bold"
                          : isToday(day) ? "font-bold"
                          : isPast(day)  ? "text-gray-300 cursor-not-allowed"
                          : "text-[#222] hover:bg-[rgba(31,140,158,0.10)] hover:text-[#1F8C9E]",
                      ].join(" ")}
                      style={
                        isSelected(day) ? { background: "#1F8C9E", boxShadow: "0 4px 14px rgba(31,140,158,0.45)" }
                          : isToday(day) ? { background: "rgba(31,140,158,0.12)", color: "#1F8C9E", outline: "2px solid #1F8C9E", outlineOffset: "1px" }
                          : {}
                      }
                    >{day}</button>
                  </div>
                ))}
              </div>

              {/* Quick dates */}
              <div className="px-3 pt-2 pb-3" style={{ borderTop: "1px solid rgba(0,0,0,0.07)", background: "#f8fafb" }}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Flexible dates</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_DATES.map(qd => {
                    const sel = value === qd;
                    return (
                      <button key={qd} type="button"
                        onClick={e => { e.stopPropagation(); onChange(qd); onClose(); }}
                        className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all active:scale-95"
                        style={{ background: sel ? "#1F8C9E" : "#fff", color: sel ? "#fff" : "#555", border: sel ? "1.5px solid #1F8C9E" : "1.5px solid rgba(0,0,0,0.11)" }}>
                        {qd}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPanel>
    </div>
  );
}

/* ── Shared field wrapper ─────────────────────────────────────────────────── */
function Field({
  icon: Icon, label, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-2.5 flex-1 min-w-0 px-3.5 py-2 rounded-xl transition-all"
      style={{
        backgroundColor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.18)",
      }}
    >
      <Icon className="w-[15px] h-[15px] shrink-0 text-white/90" />
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>{label}</p>
        {children}
      </div>
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
      className="w-full text-[15px] font-semibold bg-transparent focus:outline-none leading-tight placeholder:text-white/60"
      style={{ color: "#fff", caretColor: "#fff" }}
    />
  );
}

/* ── Destination autocomplete: clean teal MapPin + name + country ─────────── */
function DestinationAutocomplete({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const matches = value.trim()
    ? destinations.filter(d => {
        const q = value.toLowerCase();
        return d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
      })
    : destinations.filter(d => d.popular);

  // Position the portal panel relative to the input field
  const reposition = useCallback(() => {
    const anchor = inputRef.current?.closest("[data-dest-anchor]") as HTMLElement | null;
    const rect = (anchor ?? inputRef.current)?.getBoundingClientRect();
    if (rect) {
      setPos({
        top: rect.bottom + 8,
        left: rect.left,
        width: Math.max(rect.width, 260),
      });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    reposition();
    const onScroll = () => reposition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, reposition]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (inputRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="w-full text-[15px] font-semibold bg-transparent focus:outline-none leading-tight placeholder:text-white/60"
        style={{ color: "#fff", caretColor: "#fff" }}
      />
      {mounted && open && matches.length > 0 && createPortal(
        <div
          ref={panelRef}
          className="rounded-xl overflow-y-auto dest-dropdown"
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: pos.width,
            maxHeight: 320,
            backgroundColor: "#fff",
            boxShadow: "0 12px 32px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.06)",
            zIndex: 9999,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`.dest-dropdown::-webkit-scrollbar { display: none; }`}</style>
          {matches.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => { onChange(d.name); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <MapPin className="w-4 h-4 shrink-0" style={{ color: "#1F8C9E" }} />
              <span className="text-[14px] font-semibold" style={{ color: "#1a1a1a" }}>{d.name}</span>
              <span className="text-[12px]" style={{ color: "#9ca3af" }}>{d.country}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function HeroBanner() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("packages");

  /* Packages state */
  const [pkgWhere, setPkgWhere] = useState("");
  const [pkgWhen,  setPkgWhen]  = useState("");

  /* Flights state */
  const [flFrom,  setFlFrom]  = useState("");
  const [flTo,    setFlTo]    = useState("");
  const [flDate,  setFlDate]  = useState("");


  /* Open calendar/dropdown key */
  const [open, setOpen] = useState<string | null>(null);
  const toggle   = (k: string) => setOpen(p => p === k ? null : k);
  const closeAll = useCallback(() => setOpen(null), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    closeAll();
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
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url('/herosection.avif')` }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 35%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.78) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.40) 100%)" }} />

      {/* ─── navbar-height + 24px fixed gap so the visual space is identical on every device ─── */}
      <div
        className="relative z-10 w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-[90px] xs:pt-[92px] sm:pt-[102px] lg:pt-[104px]"
        style={{ paddingBottom: "clamp(28px, 6vh, 80px)" }}
      >

        {/* Glass pill badge */}
        <div
          className="inline-flex items-center gap-2 text-white text-[11px] xs:text-xs sm:text-sm font-semibold tracking-wide px-4 xs:px-5 py-1.5 xs:py-2 rounded-full mb-4 sm:mb-8"
          style={{ backgroundColor: "rgba(255,255,255,0.10)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.18)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#F2A93B" }} />
          Curated Tours
        </div>

        {/* Headline */}
        <h1
          className="text-white mb-3 sm:mb-6 w-full tracking-[-0.09em] sm:tracking-[-0.035em]"
          style={{ lineHeight: 1.06 }}
        >
          <span
            className="block font-extrabold text-[30px] xs:text-[40px] sm:text-[46px] md:text-[54px] lg:text-[60px] xl:text-[68px] 2xl:text-[76px] 3xl:text-[88px]"
            style={{
              textShadow: "0 2px 12px rgba(0,0,0,0.60), 0 6px 40px rgba(0,0,0,0.45)",
            }}
          >
            Unforgettable{" "}
            <span className="font-heading font-extrabold not-italic" style={{ color: "#F2A93B" }}>
              Experiences
            </span>
          </span>
          <span
            className="block font-extrabold text-[30px] xs:text-[40px] sm:text-[46px] md:text-[54px] lg:text-[60px] xl:text-[68px] 2xl:text-[76px] 3xl:text-[88px]"
            style={{
              textShadow: "0 2px 12px rgba(0,0,0,0.60), 0 6px 40px rgba(0,0,0,0.45)",
            }}
          >
            Await You
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mb-6 sm:mb-10 mx-auto leading-relaxed font-medium"
          style={{
            fontSize: "clamp(13px, 1.5vw, 18px)",
            maxWidth: "560px",
            color: "rgba(255,255,255,0.90)",
            textShadow: "0 1px 8px rgba(0,0,0,0.55)",
          }}
        >
          Skip the tourist traps. Book extraordinary, expert-led tours and immersive activities designed for the modern explorer.
        </p>

        {/* ── Search card ───────────────────────────────────────────────── */}
        <div
          className="w-full rounded-3xl text-left p-3.5 sm:p-5"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.20)",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          {/* Tabs */}
          <div className="inline-flex gap-1 p-1 mb-3 sm:mb-5 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
            {([
              { id: "packages" as Tab, label: "Packages", icon: <Compass className="w-3.5 h-3.5" /> },
              { id: "flights"  as Tab, label: "Flights",  icon: <PlaneTakeoff className="w-3.5 h-3.5" /> },
            ]).map(({ id, label, icon }) => {
              const active = activeTab === id;
              return (
                <button key={id} type="button"
                  onClick={() => { setActiveTab(id); closeAll(); }}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                  style={active
                    ? { backgroundColor: "rgba(255,255,255,0.22)", color: "#fff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }
                    : { color: "rgba(255,255,255,0.60)" }}>
                  {icon}{label}
                </button>
              );
            })}
          </div>

          {/* Fields */}
          <form onSubmit={handleSearch}>
            <div
              className="flex flex-col sm:flex-row items-stretch gap-2"
            >
              {activeTab === "packages" ? (
                <>
                  <div data-dest-anchor className="flex-1 min-w-0 flex">
                    <Field icon={MapPin} label="Where to?">
                      <DestinationAutocomplete value={pkgWhere} onChange={setPkgWhere} placeholder="Bali, Alps, Kyoto…" />
                    </Field>
                  </div>

                  <Field icon={Calendar} label="When?">
                    <CalendarPicker
                      value={pkgWhen} onChange={setPkgWhen} placeholder="Select dates"
                      isOpen={open === "pkgWhen"} onToggle={() => toggle("pkgWhen")} onClose={closeAll}
                    />
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
                    <CalendarPicker
                      value={flDate} onChange={setFlDate} placeholder="Select dates"
                      isOpen={open === "flDate"} onToggle={() => toggle("flDate")} onClose={closeAll} alignRight
                    />
                  </Field>

                </>
              )}

              {/* Explore button */}
              <button
                type="submit"
                className="relative flex items-center justify-center gap-2 rounded-xl font-bold text-[13px] text-white transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shrink-0 py-2 sm:py-0 sm:px-6 whitespace-nowrap overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #1F8C9E 0%, #0E6F7F 100%)",
                  boxShadow: "0 4px 20px rgba(31,140,158,0.50), inset 0 1px 0 rgba(255,255,255,0.20)",
                  minWidth: "120px",
                }}
              >
                {/* shimmer sheen */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.22) 0%, transparent 65%)" }} />
                <span className="relative flex items-center gap-1.5">
                  Explore
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Trust strip */}
        <div className="mt-5 sm:mt-10 flex flex-wrap justify-center items-center gap-2 xs:gap-2.5 sm:gap-x-10 sm:gap-y-3 text-white/85 text-[11px] xs:text-xs sm:text-base lg:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm sm:px-0 sm:py-0 sm:rounded-none sm:bg-transparent sm:border-0 sm:backdrop-blur-none">
            <BadgeCheck className="w-4 h-4 sm:w-[17px] sm:h-[17px] shrink-0" style={{ color: "#F2A93B" }} />
            <span className="font-medium whitespace-nowrap">Expert Local Guides</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm sm:px-0 sm:py-0 sm:rounded-none sm:bg-transparent sm:border-0 sm:backdrop-blur-none">
            <Shield className="w-4 h-4 sm:w-[17px] sm:h-[17px] shrink-0" style={{ color: "#F2A93B" }} />
            <span className="font-medium whitespace-nowrap">Flexible Cancellation</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm sm:px-0 sm:py-0 sm:rounded-none sm:bg-transparent sm:border-0 sm:backdrop-blur-none">
            <Star className="w-4 h-4 sm:w-[17px] sm:h-[17px] fill-current shrink-0" style={{ color: "#F2A93B" }} />
            <span className="font-medium whitespace-nowrap">4.9/5 Average Rating</span>
          </div>
        </div>
      </div>

      {/* ── Scroll-down indicator ─────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 cursor-pointer group"
        aria-label="Scroll down"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] transition-opacity group-hover:opacity-100"
          style={{ color: "rgba(255,255,255,0.50)" }}>Scroll</span>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full transition-all group-hover:scale-110"
          style={{
            backgroundColor: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.22)",
            animation: "scrollBounce 1.8s ease-in-out infinite",
          }}
        >
          <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.80)" }} />
        </div>
        <style>{`
          @keyframes scrollBounce {
            0%, 100% { transform: translateY(0); opacity: 0.7; }
            50%       { transform: translateY(5px); opacity: 1; }
          }
        `}</style>
      </button>

    </section>
  );
}
