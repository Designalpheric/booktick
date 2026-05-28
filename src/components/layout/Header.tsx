"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Menu, X, Phone, ChevronDown, ArrowRight,
  MapPin, Globe, Plane, Info, Mail, Sparkles, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownItem = { label: string; href: string; tag?: string };
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
      { label: "Goa",       href: "/destinations/goa",       tag: "Beaches" },
      { label: "Kerala",    href: "/destinations/kerala",    tag: "Backwaters" },
      { label: "Manali",    href: "/destinations/manali",    tag: "Mountains" },
      { label: "Ladakh",    href: "/destinations/ladakh",    tag: "High passes" },
      { label: "Rajasthan", href: "/destinations/rajasthan", tag: "Heritage" },
      { label: "Andaman",   href: "/destinations/andaman",   tag: "Islands" },
      { label: "Himachal",  href: "/packages?category=national", tag: "Adventure" },
      { label: "Kashmir",   href: "/packages?category=national", tag: "Snow" },
    ],
    columns: 2,
    viewAll: { label: "View All India Packages", href: "/packages?category=national" },
  },
  {
    label: "International",
    href: "/packages?category=international",
    icon: Globe,
    dropdown: [
      { label: "Dubai",     href: "/destinations/dubai",     tag: "Luxury" },
      { label: "Thailand",  href: "/destinations/thailand",  tag: "Adventure" },
      { label: "Maldives",  href: "/destinations/maldives",  tag: "Honeymoon" },
      { label: "Bali",      href: "/destinations/bali",      tag: "Culture" },
      { label: "Singapore", href: "/destinations/singapore", tag: "City" },
      { label: "Paris",     href: "/destinations/paris",     tag: "Romance" },
      { label: "Vietnam",   href: "/packages?category=international", tag: "Heritage" },
      { label: "Malaysia",  href: "/packages?category=international", tag: "Family" },
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
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 220);
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
                  onMouseEnter={() => {
                    if (link.dropdown) {
                      cancelClose();
                      setActiveDropdown(link.label);
                    } else {
                      cancelClose();
                      setActiveDropdown(null);
                    }
                  }}
                  onMouseLeave={() => link.dropdown && scheduleClose()}
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
                        "absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 overflow-hidden",
                        link.columns === 2 ? "w-[680px]" : "w-[240px]",
                        "transition-all duration-200 origin-top"
                      , open
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-[0.97] -translate-y-1.5 pointer-events-none"
                      )}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid rgba(15,23,42,0.06)",
                        borderRadius: "20px",
                        boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 24px 56px -12px rgba(15,23,42,0.22)",
                      }}
                    >
                      {/* Arrow */}
                      <div
                        className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"
                        style={{
                          border: "1px solid rgba(15,23,42,0.06)",
                          borderBottom: "none",
                          borderRight: "none",
                          borderRadius: "2px 0 0 0",
                        }}
                      />

                      {link.columns === 2 ? (
                        (() => {
                          // Split into Popular (first 4) and Trending (last 4)
                          const popular  = link.dropdown.slice(0, 4);
                          const trending = link.dropdown.slice(4, 8);
                          const isIndia  = link.icon !== Globe;
                          const featured = isIndia
                            ? {
                                title: "Goa Beach Bliss",
                                subtitle: "Sun, sand & curated stays — escape into India's coastal paradise.",
                                image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=700&fit=crop",
                                href: "/destinations/goa",
                              }
                            : {
                                title: "Dubai Luxury Escape",
                                subtitle: "Iconic skyline, golden dunes & 5-star comfort — your global adventure.",
                                image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&h=700&fit=crop",
                                href: "/destinations/dubai",
                              };

                          return (
                            <div className="p-3">
                              <div className="grid grid-cols-[0.85fr_1.6fr] gap-3">
                                {/* ── LEFT — Featured destination card ───────────────── */}
                                <Link
                                  href={featured.href}
                                  className="group/feat relative overflow-hidden rounded-2xl flex"
                                >
                                  <Image
                                    src={featured.image}
                                    alt={featured.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover/feat:scale-105"
                                    sizes="280px"
                                  />
                                  {/* Dark gradient overlay */}
                                  <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                      background: "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.88) 100%)",
                                    }}
                                  />
                                  {/* Top-left badge */}
                                  <span
                                    className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                                    style={{ background: "rgba(255,255,255,0.92)", color: "#0F172A" }}
                                  >
                                    <Sparkles className="w-2.5 h-2.5" style={{ color: "#F2A93B" }} />
                                    Featured
                                  </span>
                                  {/* Content */}
                                  <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                                    <h4 className="text-[17px] font-extrabold leading-[1.1] mb-1.5" style={{ letterSpacing: "-0.015em" }}>
                                      {featured.title}
                                    </h4>
                                    <p className="text-[11.5px] leading-snug mb-2.5" style={{ color: "rgba(255,255,255,0.80)" }}>
                                      {featured.subtitle}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-[11.5px] font-bold opacity-90 group-hover/feat:opacity-100 transition-opacity">
                                      Explore
                                      <ArrowRight className="w-3 h-3 transition-transform group-hover/feat:translate-x-0.5" />
                                    </span>
                                  </div>
                                </Link>

                                {/* ── RIGHT — 2-column destination list ──────────────── */}
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 self-start pt-1">
                                  {/* Popular column */}
                                  <div>
                                    <p
                                      className="text-[11px] font-semibold mb-3 pl-1"
                                      style={{ color: "rgba(15,23,42,0.55)" }}
                                    >
                                      Popular Destinations
                                    </p>
                                    <div className="flex flex-col gap-1">
                                      {popular.map((item) => (
                                        <Link
                                          key={item.label}
                                          href={item.href}
                                          className="group/item flex items-center gap-2 px-1.5 py-1 rounded-lg transition-colors hover:bg-gray-50"
                                          style={{ color: "#0F172A" }}
                                        >
                                          <span
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                                            style={{
                                              background: "#fff",
                                              border: "1px solid rgba(15,23,42,0.10)",
                                              color: "#1F8C9E",
                                            }}
                                          >
                                            {link.icon === Globe
                                              ? <Globe className="w-3.5 h-3.5" />
                                              : <MapPin className="w-3.5 h-3.5" />
                                            }
                                          </span>
                                          <span className="min-w-0 flex-1">
                                            <span className="block text-[12.5px] font-semibold leading-tight">
                                              {item.label}
                                            </span>
                                            {item.tag && (
                                              <span className="block text-[10.5px] leading-tight mt-0.5" style={{ color: "rgba(15,23,42,0.50)" }}>
                                                {item.tag}
                                              </span>
                                            )}
                                          </span>
                                        </Link>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Trending column */}
                                  <div>
                                    <p
                                      className="text-[11px] font-semibold mb-3 pl-1"
                                      style={{ color: "rgba(15,23,42,0.55)" }}
                                    >
                                      Trending Now
                                    </p>
                                    <div className="flex flex-col gap-1">
                                      {trending.map((item) => (
                                        <Link
                                          key={item.label}
                                          href={item.href}
                                          className="group/item flex items-center gap-2 px-1.5 py-1 rounded-lg transition-colors hover:bg-gray-50"
                                          style={{ color: "#0F172A" }}
                                        >
                                          <span
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                            style={{
                                              background: "#fff",
                                              border: "1px solid rgba(15,23,42,0.10)",
                                              color: "rgba(15,23,42,0.40)",
                                            }}
                                          >
                                            <span className="w-3 h-3 rounded-full" style={{ border: "1.5px solid currentColor" }} />
                                          </span>
                                          <span className="min-w-0 flex-1">
                                            <span className="block text-[12.5px] font-semibold leading-tight">
                                              {item.label}
                                            </span>
                                            {item.tag && (
                                              <span className="block text-[10.5px] leading-tight mt-0.5" style={{ color: "rgba(15,23,42,0.50)" }}>
                                                {item.tag}
                                              </span>
                                            )}
                                          </span>
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* ── Footer — help text + contact button ─────────────── */}
                              <div
                                className="flex items-center justify-between mt-4 pt-4 px-2"
                                style={{ borderTop: "1px solid rgba(15,23,42,0.07)" }}
                              >
                                <div className="min-w-0">
                                  <p className="text-[13px] font-bold leading-tight" style={{ color: "#0F172A" }}>
                                    Need help choosing a destination?
                                  </p>
                                  <p className="text-[11.5px] leading-tight mt-0.5" style={{ color: "rgba(15,23,42,0.55)" }}>
                                    Our travel experts will craft the perfect trip for you.
                                  </p>
                                </div>
                                <Link
                                  href="/contact"
                                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[12.5px] font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95 shrink-0 ml-3"
                                  style={{ backgroundColor: "#0F172A" }}
                                >
                                  Contact us
                                </Link>
                              </div>
                            </div>
                          );
                        })()
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
                  ? "linear-gradient(135deg,#1F8C9E 0%,#0E6F7F 100%)"
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
                    background: "linear-gradient(135deg,#1F8C9E,#0E6F7F)",
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
