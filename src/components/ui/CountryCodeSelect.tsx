"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

/* ── Country dial codes ────────────────────────────────────────────────────── */
export const COUNTRY_CODES = [
  { code: "IN", dial: "+91",  name: "India" },
  { code: "US", dial: "+1",   name: "United States" },
  { code: "GB", dial: "+44",  name: "United Kingdom" },
  { code: "AE", dial: "+971", name: "UAE" },
  { code: "AU", dial: "+61",  name: "Australia" },
  { code: "CA", dial: "+1",   name: "Canada" },
  { code: "SG", dial: "+65",  name: "Singapore" },
  { code: "MY", dial: "+60",  name: "Malaysia" },
  { code: "TH", dial: "+66",  name: "Thailand" },
  { code: "ID", dial: "+62",  name: "Indonesia" },
  { code: "PH", dial: "+63",  name: "Philippines" },
  { code: "NZ", dial: "+64",  name: "New Zealand" },
  { code: "ZA", dial: "+27",  name: "South Africa" },
  { code: "FR", dial: "+33",  name: "France" },
  { code: "DE", dial: "+49",  name: "Germany" },
  { code: "IT", dial: "+39",  name: "Italy" },
  { code: "JP", dial: "+81",  name: "Japan" },
  { code: "CN", dial: "+86",  name: "China" },
  { code: "KR", dial: "+82",  name: "South Korea" },
  { code: "PK", dial: "+92",  name: "Pakistan" },
  { code: "BD", dial: "+880", name: "Bangladesh" },
  { code: "NP", dial: "+977", name: "Nepal" },
  { code: "LK", dial: "+94",  name: "Sri Lanka" },
  { code: "MV", dial: "+960", name: "Maldives" },
  { code: "BT", dial: "+975", name: "Bhutan" },
  { code: "SA", dial: "+966", name: "Saudi Arabia" },
  { code: "QA", dial: "+974", name: "Qatar" },
  { code: "KW", dial: "+965", name: "Kuwait" },
  { code: "BH", dial: "+973", name: "Bahrain" },
  { code: "OM", dial: "+968", name: "Oman" },
];

export type CountryCode = typeof COUNTRY_CODES[number];

const PANEL_W = 264;

export default function CountryCodeSelect({
  value,
  onChange,
  error = false,
}: {
  value: CountryCode;
  onChange: (c: CountryCode) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; flipUp: boolean; maxH: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const btn = triggerRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(PANEL_W, vw - 16);
    // Keep the panel within the viewport horizontally.
    const left = Math.max(8, Math.min(r.left, vw - width - 8));
    const spaceBelow = vh - r.bottom - 12;
    const spaceAbove = r.top - 12;
    const flipUp = spaceBelow < 220 && spaceAbove > spaceBelow;
    const maxH = Math.min(320, flipUp ? spaceAbove : spaceBelow);
    setCoords({
      top: flipUp ? r.top : r.bottom,
      left,
      width,
      flipUp,
      maxH,
    });
  }, []);

  // Recompute placement when opening, and on scroll / resize while open.
  useEffect(() => {
    if (!open) return;
    place();
    const handle = () => place();
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true); // capture inner scrolls too
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, [open, place]);

  // Close on outside click (trigger + portal panel are both "inside").
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
      setSearch("");
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = COUNTRY_CODES.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  return (
    <div className="relative shrink-0 self-stretch">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center gap-0.5 h-full px-2 text-[13px] font-semibold transition-colors hover:bg-black/5"
        style={{
          backgroundColor: "#fff",
          borderRight: `1.5px solid ${error ? "rgba(248,113,113,0.3)" : "rgba(20,20,20,0.10)"}`,
          color: error ? "#f87171" : "#343434",
          minWidth: 58,
        }}
      >
        <span className="tracking-tight">{value.dial}</span>
        <ChevronDown className="w-3 h-3 opacity-40 shrink-0" />
      </button>

      {open && coords && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-[200] bg-white overflow-hidden"
            style={{
              top: coords.flipUp ? undefined : coords.top + 4,
              bottom: coords.flipUp ? window.innerHeight - coords.top + 4 : undefined,
              left: coords.left,
              width: coords.width,
              border: "1.5px solid rgba(20,20,20,0.12)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
            }}
          >
            {/* Search */}
            <div className="px-3 py-2.5" style={{ borderBottom: "1px solid rgba(20,20,20,0.07)" }}>
              <input
                autoFocus
                type="text"
                placeholder="Search country or code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-[12px] outline-none bg-transparent placeholder-gray-400"
                style={{ color: "#343434" }}
              />
            </div>
            {/* List */}
            <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: Math.max(120, coords.maxH - 48) }}>
              {filtered.length === 0 ? (
                <p className="px-3 py-3 text-[12px] text-gray-400">No results</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.code + c.dial}
                    type="button"
                    onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[12px] transition-colors hover:bg-gray-50"
                    style={{ color: value.code === c.code ? "#1F8C9E" : "#343434", fontWeight: value.code === c.code ? 700 : 400 }}
                  >
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="shrink-0" style={{ color: "#9CA3AF" }}>{c.dial}</span>
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
