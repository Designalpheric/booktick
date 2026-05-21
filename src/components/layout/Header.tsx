"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown, ArrowRight, MapPin, Globe, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Nav data ───────────────────────────────────────────────────────────── */
type DropdownItem = { label: string; href: string };
type NavLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }> | null;
  dropdown: DropdownItem[] | null;
  columns?: 2;
  viewAll?: DropdownItem;
};

const navLinks: NavLink[] = [
  {
    label: "India Packages",
    href: "/packages?category=domestic",
    icon: MapPin,
    dropdown: [
      { label: "Goa",         href: "/destinations/goa" },
      { label: "Kerala",      href: "/destinations/kerala" },
      { label: "Himachal",    href: "/destinations/himachal" },
      { label: "Kashmir",     href: "/destinations/kashmir" },
      { label: "Rajasthan",   href: "/destinations/rajasthan" },
      { label: "Uttarakhand", href: "/destinations/uttarakhand" },
      { label: "Andaman",     href: "/destinations/andaman" },
      { label: "North East",  href: "/destinations/north-east" },
    ],
    columns: 2,
    viewAll: { label: "View All India Packages →", href: "/packages?category=domestic" },
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
      { label: "Europe",    href: "/destinations/europe" },
      { label: "Vietnam",   href: "/destinations/vietnam" },
      { label: "Malaysia",  href: "/destinations/malaysia" },
    ],
    columns: 2,
    viewAll: { label: "View All International →", href: "/packages?category=international" },
  },
  { label: "Flights", href: "/flights", icon: Plane, dropdown: null },
  { label: "About",   href: "/about",   icon: null,  dropdown: null },
  { label: "Contact", href: "/contact", icon: null,  dropdown: null },
];

export default function Header() {
  const pathname  = usePathname();
  const [isScrolled, setIsScrolled]           = useState(false);
  const [activeDropdown, setActiveDropdown]   = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [mobileExpanded, setMobileExpanded]   = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === "/") return pathname === "/";
    return pathname.startsWith(base);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        isScrolled
          ? {
              backgroundColor: "rgba(18, 0, 77, 0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(67, 198, 217, 0.15)",
              boxShadow: "0 4px 24px rgba(18, 0, 77, 0.35)",
              paddingTop: "8px",
              paddingBottom: "8px",
            }
          : {
              backgroundColor: "transparent",
              paddingTop: "16px",
              paddingBottom: "16px",
            }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo-light.png"
              alt="BookTick"
              width={140}
              height={44}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    "text-white/90 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown className={cn("w-3.5 h-3.5 opacity-70 transition-transform duration-200", activeDropdown === link.label && "rotate-180")} />
                  )}
                </Link>

                {/* Dropdown */}
                {link.dropdown && activeDropdown === link.label && (
                  <div
                    className={cn("absolute top-full left-0 mt-2 z-50 rounded-2xl overflow-hidden", link.columns === 2 ? "w-72" : "w-52")}
                    style={{
                      background: "rgba(18, 0, 77, 0.95)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(67, 198, 217, 0.18)",
                      boxShadow: "0 16px 40px rgba(18, 0, 77, 0.55)",
                    }}
                  >
                    {link.columns === 2 ? (
                      <>
                        <div className="grid grid-cols-2 gap-px p-2">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-xl"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        {link.viewAll && (
                          <div className="px-2 pb-2" style={{ borderTop: "1px solid rgba(67,198,217,0.12)" }}>
                            <Link
                              href={link.viewAll.href}
                              className="flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors"
                              style={{ color: "#43C6D9" }}
                            >
                              {link.viewAll.label}
                            </Link>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-1.5">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              +91 98765 43210
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:opacity-90 active:scale-95 shadow-md"
              style={{ backgroundColor: "#43C6D9" }}
            >
              Get Quote
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => { setMobileOpen(!mobileOpen); setMobileExpanded(null); }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden mt-1"
          style={{
            background: "rgba(18, 0, 77, 0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(67, 198, 217, 0.12)",
            boxShadow: "0 16px 40px rgba(18, 0, 77, 0.5)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                  >
                    <span className="flex items-center gap-2.5">
                      {link.icon && <link.icon className="w-4 h-4" style={{ color: "#43C6D9" }} />}
                      {link.label}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", mobileExpanded === link.label && "rotate-180")} />
                  </button>
                  {mobileExpanded === link.label && (
                    <div className="mx-2 mt-1 rounded-xl p-2 grid grid-cols-2 gap-0.5" style={{ background: "rgba(255,255,255,0.05)" }}>
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="px-3 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                          onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                        >
                          {item.label}
                        </Link>
                      ))}
                      {link.viewAll && (
                        <Link
                          href={link.viewAll.href}
                          className="col-span-2 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors mt-1"
                          style={{ color: "#43C6D9", borderTop: "1px solid rgba(67,198,217,0.1)" }}
                          onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                        >
                          {link.viewAll.label}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-white/15 text-white font-semibold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon && <link.icon className="w-4 h-4" style={{ color: "#43C6D9" }} />}
                  {link.label}
                </Link>
              )
            )}

            <div className="pt-3 space-y-2" style={{ borderTop: "1px solid rgba(67,198,217,0.12)" }}>
              <a href="tel:+919876543210" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/60">
                <Phone className="w-4 h-4" style={{ color: "#43C6D9" }} />
                +91 98765 43210
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ backgroundColor: "#43C6D9" }}
                onClick={() => setMobileOpen(false)}
              >
                Get Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
