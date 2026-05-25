"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, Phone, ChevronDown, ArrowRight, MapPin, Globe, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownItem = { label: string; href: string };
type NavLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; color?: string; style?: React.CSSProperties }> | null;
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
      { label: "Europe",    href: "/destinations/europe" },
      { label: "Vietnam",   href: "/destinations/vietnam" },
      { label: "Malaysia",  href: "/destinations/malaysia" },
    ],
    columns: 2,
    viewAll: { label: "View All International", href: "/packages?category=international" },
  },
  { label: "Flights", href: "/flights", icon: Plane, dropdown: null },
  { label: "About",   href: "/about",   icon: null,  dropdown: null },
  { label: "Contact", href: "/contact", icon: null,  dropdown: null },
];

export default function Header() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

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
    <header
      className="fixed top-0 inset-x-0 z-50"
      style={{ padding: "10px 16px 0", pointerEvents: "none" }}
    >
      <div
        className="max-w-7xl mx-auto flex items-center px-5 sm:px-6"
        style={{
          pointerEvents: "auto",
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          height: "56px",
        }}
      >
        <div className="flex-1 flex items-center">
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/logo-dark.png"
              alt="BookTick"
              width={130}
              height={40}
              priority
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = isActive(link.href);
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
                    "inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-sm transition-colors duration-150 whitespace-nowrap",
                    active ? "bg-gray-100 font-semibold" : "font-medium hover:bg-gray-100"
                  )}
                  style={{ color: "#0b0b0d" }}
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 opacity-50 transition-transform duration-200",
                        activeDropdown === link.label && "rotate-180"
                      )}
                    />
                  )}
                </Link>

                {link.dropdown && activeDropdown === link.label && (
                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50",
                      link.columns === 2 ? "w-[360px]" : "w-[220px]"
                    )}
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "20px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.03), 0 20px 40px -8px rgba(0,0,0,0.14)",
                    }}
                  >
                    <div
                      className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"
                      style={{ border: "1px solid rgba(0,0,0,0.08)", borderBottom: "none", borderRight: "none", borderRadius: "2px 0 0 0" }}
                    />
                    {link.columns === 2 ? (
                      <div className="p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 px-2 pb-2 pt-1">{link.label}</p>
                        <div className="grid grid-cols-2 gap-1">
                          {link.dropdown.map((item) => (
                            <Link key={item.label} href={item.href}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                              style={{ color: "#0b0b0d" }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(31,140,158,0.07)")}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                              <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(31,140,158,0.10)" }}>
                                <MapPin className="w-3 h-3" style={{ color: "#1F8C9E" }} />
                              </span>
                              <span className="leading-tight">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                        {link.viewAll && (
                          <div className="mt-2 pt-2.5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                            <Link href={link.viewAll.href}
                              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
                              style={{ color: "#1F8C9E" }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(31,140,158,0.07)")}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                              <span>{link.viewAll.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 px-3 pb-2 pt-1.5">{link.label}</p>
                        {link.dropdown.map((item) => (
                          <Link key={item.label} href={item.href}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                            style={{ color: "#0b0b0d" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(31,140,158,0.07)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(31,140,158,0.10)" }}>
                              <Globe className="w-3 h-3" style={{ color: "#1F8C9E" }} />
                            </span>
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

        <div className="flex-1 flex items-center justify-end gap-2.5">
          <Link href="/contact"
            className="hidden lg:inline-flex items-center gap-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 active:scale-95"
            style={{ backgroundColor: "#0b0b0d", borderRadius: "9999px", paddingLeft: "20px", paddingRight: "8px", paddingTop: "8px", paddingBottom: "8px" }}
          >
            Contact us
            <span className="flex items-center justify-center shrink-0" style={{ width: "28px", height: "28px", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.12)" }}>
              <Phone className="w-3.5 h-3.5 text-white" />
            </span>
          </Link>
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-gray-100"
            style={{ color: "#0b0b0d" }}
            onClick={() => { setMobileOpen(!mobileOpen); setMobileExpanded(null); }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2"
          style={{ pointerEvents: "auto", backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
        >
          <div className="px-3 py-3 space-y-0.5">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{ color: mobileExpanded === link.label ? "#1F8C9E" : "#0b0b0d", backgroundColor: mobileExpanded === link.label ? "rgba(31,140,158,0.07)" : "transparent" }}
                    onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                  >
                    <span className="flex items-center gap-2">
                      {link.icon && <link.icon className="w-4 h-4 shrink-0" style={{ color: mobileExpanded === link.label ? "#1F8C9E" : "#6b7280" }} />}
                      {link.label}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 opacity-40 transition-transform duration-200", mobileExpanded === link.label && "rotate-180")} />
                  </button>
                  {mobileExpanded === link.label && (
                    <div className="mx-1 mb-1 overflow-hidden" style={{ backgroundColor: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "10px" }}>
                      <div className="p-2 grid grid-cols-2 gap-0.5">
                        {link.dropdown.map((item) => (
                          <Link key={item.label} href={item.href}
                            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white"
                            style={{ color: "#374151" }}
                            onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                          >{item.label}</Link>
                        ))}
                      </div>
                      {link.viewAll && (
                        <div className="px-2 pb-2" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                          <Link href={link.viewAll.href}
                            className="flex items-center justify-between px-3 py-2 text-sm font-semibold mt-1.5 rounded-lg"
                            style={{ color: "#1F8C9E", backgroundColor: "rgba(31,140,158,0.07)" }}
                            onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                          >
                            <span>{link.viewAll.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.label} href={link.href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={isActive(link.href) ? { backgroundColor: "rgba(31,140,158,0.10)", color: "#1F8C9E" } : { color: "#0b0b0d" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon && <link.icon className="w-4 h-4 shrink-0" style={{ color: isActive(link.href) ? "#1F8C9E" : "#6b7280" }} />}
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-2 pb-1" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <Link href="/contact"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#0b0b0d" }}
                onClick={() => setMobileOpen(false)}
              >
                <span>Contact us</span>
                <span className="flex items-center justify-center w-7 h-7 rounded-full shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                  <Phone className="w-3.5 h-3.5 text-white" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
