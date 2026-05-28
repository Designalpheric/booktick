"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WDAYS  = ["Su","Mo","Tu","We","Th","Fr","Sa"];

interface Props {
  value: string;                 // YYYY-MM-DD
  onChange: (v: string) => void;
  placeholder?: string;
  min?: string;                  // YYYY-MM-DD
  error?: boolean;
  className?: string;
}

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISO(s?: string) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(s?: string) {
  const d = parseISO(s);
  if (!d) return "";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DateInput({ value, onChange, placeholder = "Select date", min, error, className }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<Date>(() => parseISO(value) || new Date());
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const reposition = useCallback(() => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 12;
    const isMobile = vw < 640;

    if (isMobile) {
      // Centered modal on mobile — full width minus margins, vertically centered
      const calW = Math.min(360, vw - margin * 2);
      const calH = 420; // estimate
      const left = (vw - calW) / 2;
      const top = Math.max(margin, (vh - calH) / 2);
      setPos({ top, left, width: calW });
      return;
    }

    // Desktop/tablet: positioned below input
    const desired = Math.max(r.width, 320);
    const maxW = Math.min(desired, vw - margin * 2);

    let left = r.left;
    if (left + maxW > vw - margin) left = vw - maxW - margin;
    if (left < margin) left = margin;

    const calHeightEstimate = 380;
    let top = r.bottom + 8;
    if (top + calHeightEstimate > vh - margin && r.top - 8 - calHeightEstimate > margin) {
      top = r.top - 8 - calHeightEstimate;
    }
    if (top + calHeightEstimate > vh - margin) {
      top = Math.max(margin, vh - calHeightEstimate - margin);
    }

    setPos({ top, left, width: maxW });
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
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

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const minDate = parseISO(min) || null;
  const today = new Date(); today.setHours(0,0,0,0);
  const selected = parseISO(value);

  // Build calendar grid
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const goPrev = () => setView(new Date(year, month - 1, 1));
  const goNext = () => setView(new Date(year, month + 1, 1));

  const isDisabled = (d: Date) => {
    if (minDate && d < minDate) return true;
    return false;
  };

  const isSelected = (d: Date) => selected && toISO(d) === toISO(selected);
  const isToday = (d: Date) => toISO(d) === toISO(today);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          className ??
          "w-full flex items-center gap-2 px-4 py-3.5 text-[13px] bg-white outline-none transition-all text-left"
        }
        style={{
          border: error ? "1.5px solid #f87171" : "1.5px solid rgba(20,20,20,0.14)",
          color: value ? "#343434" : "#9ca3af",
        }}
      >
        <Calendar className="w-4 h-4 shrink-0" style={{ color: "#374151" }} />
        <span className="flex-1 truncate">{value ? formatDisplay(value) : placeholder}</span>
      </button>

      {mounted && open && isMobile && createPortal(
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 9998,
          }}
        />,
        document.body
      )}
      {mounted && open && createPortal(
          <div
            ref={panelRef}
            className="rounded-2xl bg-white p-3"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              maxHeight: "calc(100vh - 24px)",
              overflowY: "auto",
              zIndex: 9999,
              boxShadow: "0 12px 32px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={goPrev}
              className="w-7 h-7 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" style={{ color: "#343434" }} />
            </button>
            <div className="text-[14px] font-bold" style={{ color: "#343434" }}>
              {MONTHS[month]} {year}
            </div>
            <button
              type="button"
              onClick={goNext}
              className="w-7 h-7 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" style={{ color: "#343434" }} />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WDAYS.map((w) => (
              <div key={w} className="text-[11px] font-bold text-center py-1" style={{ color: "#9ca3af" }}>
                {w}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const disabled = isDisabled(d);
              const sel = isSelected(d);
              const tod = isToday(d);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => { onChange(toISO(d)); setOpen(false); }}
                  className="aspect-square sm:aspect-auto sm:h-7 text-[12px] font-semibold rounded-full flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: sel ? "#1F8C9E" : "transparent",
                    color: disabled ? "#d1d5db" : sel ? "#fff" : tod ? "#1F8C9E" : "#343434",
                    cursor: disabled ? "not-allowed" : "pointer",
                    border: tod && !sel ? "1.5px solid #1F8C9E" : "1.5px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (!sel && !disabled) e.currentTarget.style.backgroundColor = "rgba(31,140,158,0.08)"; }}
                  onMouseLeave={(e) => { if (!sel) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: "1px solid #f3f4f6" }}>
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className="text-[12px] font-semibold transition-colors hover:underline"
              style={{ color: "#9ca3af" }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => { onChange(toISO(today)); setOpen(false); }}
              className="text-[12px] font-bold px-3 py-1 rounded-full transition-all hover:opacity-80"
              style={{ backgroundColor: "rgba(31,140,158,0.12)", color: "#1F8C9E" }}
            >
              Today
            </button>
          </div>
          </div>,
        document.body
      )}
    </>
  );
}
