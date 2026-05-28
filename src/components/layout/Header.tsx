"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Menu, X, Phone, ChevronDown, ArrowRight,
  MapPin, Globe, Plane, Info, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownItem = { label: string; href: string };
type NavLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> | null;
  dropdown: DropdownItem[] | null;
  columns?: 2;
  viewAll?: DropdownItem;
};

const navLinks: NavLink[] = [
  {
    label: "India Packages",
    href: "/packages?category=national",
    icon: MapPin,
    dropdown: [
      { label: "Goa",       href: "/destinations/goa" },
      { label: "Kerala",    href: "/destinations/kerala" },
      { label: "Manali",    href: "/destinations/manali" },
      { label: "Ladakh",    href: "/destinations/ladakh" },
      { label: "Rajasthan", href: "/destinations/rajasthan" },
      { label: "Andaman",   href: "/destinations/andaman" },
      { label: "Himachal",  href: "/packages?category=national" },
      { label: "Kashmir",   href: "/packages?category=national" },
    ],
    columns: 2,
    viewAll: { label: "View All India Packages", href: "/packages?category=national" },
  },
  {
    label: "International",
    href: "/packages?category=international",
    icon: Globe,
    dropdown: [
      { label: "Dubai",     href: "/destinations/dubai" },
      { label: "Thailand",  href: "/destinations/thailand" },
      { label: "Maldives",  href: "/destinations/maldives" },
      { label: "Bali",      href: "/destinations/bali" },
      { label: "Singapore", href: "/destinations/singapore" },
      { label: "Paris",     href: "/destinations/paris" },
      { label: "Vietnam",   href: "/packages?category=international" },
      { label: "Malaysia",  href: "/packages?category=international" },
    ],
    columns: 2,
    viewAll: { label: "View All International", href: "/packages?category=international" },
  },
  { label: "Flights", href: "/flights", icon: Plane, dropdown: null },
  { label: "About",   href: "/about",   icon: Info,  dropdown: null },
  { label: "Contact", href: "/contact", icon: Mail,  dropdown: null },
];

export default function Header() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled]             = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any pending close (used when user re-enters the menu)
  const cancelClose = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  };

  // Schedule close with a small grace delay so users can move from trigger → dropdown
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  // Click-outside listener — closes the dropdown when clicking outside the nav
  useEffect(() => {
    if (!activeDropdown) return;
    const onDocClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDropdown(null);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [activeDropdown]);

  // Clean up timer on unmount
  useEffect(() => () => cancelClose(), []);

  // Pages that have a full-screen hero image (navbar starts transparent over dark bg)
  const heroPages = ["/"];
  const isHeroPage = heroPages.includes(pathname);

  // On non-hero pages always render as "scrolled" (solid white pill, dark logo)
  const effectiveScrolled = scrolled || !isHeroPage;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setMobileExpanded(null); }, [pathname]);

  const isActive = (href: string) => {
    const [base, query] = href.split("?");
    if (base === "/") return pathname === "/";
    if (!pathname.startsWith(base)) return false;
    if (query) {
      const [key, value] = query.split("=");
      return searchParams.get(key) === value;
    }
    return true;
  };

  return (
    <>
      {/* ── Main header ─────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50"
        style={{
          padding: "14px 16px 0",
          pointerEvents: "none",
        }}
      >
        {/* ── Pill ── */}
        <div
          className="max-w-7xl 2xl:max-w-screen-2xl mx-auto flex items-center gap-2 sm:gap-3 lg:gap-6 h-[52px] xs:h-[54px] sm:h-[64px] lg:h-[66px]"
          style={{
            pointerEvents: "auto",
            paddingLeft: "16px",
            paddingRight: "12px",
            backgroundColor: effectiveScrolled ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.10)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderRadius: "999px",
            border: effectiveScrolled ? "1px solid rgba(0,0,0,0.065)" : "1px solid rgba(255,255,255,0.18)",
            boxShadow: effectiveScrolled
              ? "0 1px 0 rgba(255,255,255,0.8) inset, 0 4px 8px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.12)"
              : "none",
            transition: "background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
          }}
        >

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link href="/" className="shrink-0 flex items-center flex-1" style={{ paddingLeft: "6px" }}>
            <Image
              src={effectiveScrolled ? "/logo-dark.png" : "/logo-light.png"}
              alt="BookTick"
              width={140}
              height={44}
              priority
              className="h-[24px] xs:h-[26px] sm:h-[30px] xl:h-[32px] w-auto object-contain transition-opacity duration-300"
            />
          </Link>

          {/* ── Desktop nav ───────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const open   = activeDropdown === link.label;
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "relative inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap",
                      "transition-colors duration-150",
                      active
                        ? effectiveScrolled
                          ? "bg-[rgba(31,140,158,0.08)] font-semibold"
                          : "bg-[rgba(255,255,255,0.15)] font-semibold"
                        : effectiveScrolled
                          ? "hover:bg-gray-100"
                          : "hover:bg-[rgba(255,255,255,0.12)]"
                    )}
                    style={{
                      color: active
                        ? effectiveScrolled ? "#1F8C9E" : "#ffffff"
                        : effectiveScrolled ? "#0b0b0d" : "rgba(255,255,255,0.88)",
                    }}
                  >
                    {link.label}
                    {link.dropdown && (
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 opacity-50 transition-transform duration-200",
                          open && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {link.dropdown && (
                    <div
                      className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50",
                        link.columns === 2 ? "w-[380px]" : "w-[220px]",
                        "transition-all duration-[160ms] origin-top",
                        open
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-[0.97] -translate-y-1.5 pointer-events-none"
                      )}
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 20px 48px -8px rgba(0,0,0,0.18)",
                      }}
                    >
                      {/* Arrow */}
                      <div
                        className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"
                        style={{
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderBottom: "none",
                          borderRight: "none",
                          borderRadius: "2px 0 0 0",
                        }}
                      />

                      {link.columns === 2 ? (
                        <div className="p-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 px-2 pb-2 pt-1">
                            {link.label}
                          </p>
                          <div className="grid grid-cols-2 gap-0.5">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors duration-100 hover:bg-gray-50 group/item"
                                style={{ color: "#1F2937" }}
                              >
                                <span
                                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: "rgba(31,140,158,0.09)" }}
                                >
                                  {link.icon === Globe
                                    ? <Globe className="w-3 h-3" style={{ color: "#1F8C9E" }} />
                                    : <MapPin className="w-3 h-3" style={{ color: "#1F8C9E" }} />
                                  }
                                </span>
                                {item.label}
                              </Link>
                            ))}
                          </div>
                          {link.viewAll && (
                            <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                              <Link
                                href={link.viewAll.href}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-colors hover:bg-gray-50"
                                style={{ color: "#1F8C9E" }}
                              >
                                <span>{link.viewAll.label}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 px-2.5 pb-2 pt-1.5">
                            {link.label}
                          </p>
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-gray-50"
                              style={{ color: "#1F2937" }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── Right section ─────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-1 justify-end">
            {/* CTA — desktop only */}
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-2 text-[13px] font-semibold text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95"
              style={{
                background: effectiveScrolled
                  ? "linear-gradient(135deg,#1F8C9E 0%,#14677A 100%)"
                  : "rgba(255,255,255,0.15)",
                boxShadow: effectiveScrolled ? "0 4px 16px rgba(31,140,158,0.35)" : "none",
                border: effectiveScrolled ? "none" : "1px solid rgba(255,255,255,0.35)",
                borderRadius: "9999px",
                paddingLeft: "18px",
                paddingRight: "5px",
                paddingTop: "5px",
                paddingBottom: "5px",
                lineHeight: 1,
                transition: "background 0.35s ease, box-shadow 0.35s ease, border 0.35s ease",
              }}
            >
              Book Trip
              <span
                className="flex items-center justify-center shrink-0"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255,255,255,0.18)",
                }}
              >
                <Phone className="w-3.5 h-3.5 text-white" />
              </span>
            </Link>

            {/* Hamburger — mobile */}
            <button
              className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-colors"
              style={{
                color: effectiveScrolled ? "#111827" : "#ffffff",
              }}
              onClick={() => { setMobileOpen(!mobileOpen); setMobileExpanded(null); }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-[18px] h-[18px] sm:w-5 sm:h-5" /> : <Menu className="w-[18px] h-[18px] sm:w-5 sm:h-5" />}
            </button>
          </div>


        </div>

      </header>

      {/* ── Mobile menu (rendered outside header so it's below it) ─────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed z-40"
          style={{
            top: "74px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="mx-3 mt-2 rounded-2xl overflow-hidden"
            style={{
              background: "#fff",
              boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
              border: "1px solid rgba(0,0,0,0.07)",
            }}
            onClick={(e) => e.stopPropagation()}
          >

            <div className="p-3 space-y-0.5">
              {navLinks.map((link, i) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors"
                      style={{
                        color: mobileExpanded === link.label ? "#1F8C9E" : "#111827",
                        backgroundColor:
                          mobileExpanded === link.label ? "rgba(31,140,158,0.07)" : "transparent",
                      }}
                      onClick={() =>
                        setMobileExpanded(mobileExpanded === link.label ? null : link.label)
                      }
                    >
                      <span className="flex items-center gap-3">
                        {link.icon && (
                          <link.icon
                            className="w-4 h-4 shrink-0"
                            style={{ color: mobileExpanded === link.label ? "#1F8C9E" : "#9CA3AF" }}
                          />
                        )}
                        {link.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 opacity-40 transition-transform duration-200",
                          mobileExpanded === link.label && "rotate-180"
                        )}
                      />
                    </button>

                    {mobileExpanded === link.label && (
                      <div
                        className="mx-2 mb-1 mt-0.5"
                        style={{
                          background: "#F9FAFB",
                          border: "1px solid rgba(0,0,0,0.06)",
                          borderRadius: "12px",
                        }}
                      >
                        <div className="p-2 grid grid-cols-2 gap-0.5">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-gray-700 hover:bg-white transition-colors"
                              onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        {link.viewAll && (
                          <div className="px-2 pb-2" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                            <Link
                              href={link.viewAll.href}
                              className="flex items-center justify-between px-3 py-2.5 text-[13px] font-semibold rounded-xl mt-1.5 transition-colors"
                              style={{ color: "#1F8C9E", background: "rgba(31,140,158,0.07)" }}
                              onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                            >
                              {link.viewAll.label}
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <React.Fragment key={link.label}>
                    {/* Section divider before simple page links (About, Contact) */}
                    {!link.icon && i > 0 && navLinks[i - 1]?.icon && (
                      <div className="pt-1 pb-0.5 px-1">
                        <div style={{ borderTop: "1px solid #F1F5F9" }} />
                      </div>
                    )}
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors"
                      style={
                        isActive(link.href)
                          ? { background: "rgba(31,140,158,0.08)", color: "#1F8C9E" }
                          : { color: "#111827" }
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.icon ? (
                        <link.icon
                          className="w-4 h-4 shrink-0"
                          style={{ color: isActive(link.href) ? "#1F8C9E" : "#9CA3AF" }}
                        />
                      ) : (
                        <span className="w-4 h-4 shrink-0" />
                      )}
                      {link.label}
                    </Link>
                  </React.Fragment>
                )
              )}

              {/* Mobile CTA */}
              <div className="pt-2 pb-1" style={{ borderTop: "1px solid #F3F4F6" }}>
                <Link
                  href="/contact"
                  className="flex items-center justify-between px-5 py-3.5 rounded-xl text-[14px] font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg,#1F8C9E,#0E6878)",
                    boxShadow: "0 4px 14px rgba(31,140,158,0.28)",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Book Trip
                  <Phone className="w-4 h-4" />
                </Link>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
