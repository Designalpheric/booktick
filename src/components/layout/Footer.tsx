import Link from "next/link";
import Image from "next/image";
import {
  Phone, Mail, MapPin,
  Facebook, Instagram, Twitter, Linkedin,
  ChevronRight,
} from "lucide-react";

/* ── Link groups ─────────────────────────────────────────────────────────── */
const linkGroups = {
  Destinations: [
    { label: "Goa",       href: "/destinations/goa"       },
    { label: "Kerala",    href: "/destinations/kerala"    },
    { label: "Rajasthan", href: "/destinations/rajasthan" },
    { label: "Dubai",     href: "/destinations/dubai"     },
    { label: "Bali",      href: "/destinations/bali"      },
    { label: "Maldives",  href: "/destinations/maldives"  },
  ],
  "Travel Packages": [
    { label: "National Tours",       href: "/packages?category=national" },
    { label: "International Tours", href: "/packages?category=international" },
    { label: "Honeymoon Packages",  href: "/packages?type=Honeymoon" },
    { label: "Adventure Tours",     href: "/packages?type=Adventure" },
    { label: "Luxury Tours",        href: "/packages?type=Luxury"    },
    { label: "Family Packages",     href: "/packages?type=Family"    },
  ],
  "Quick Links": [
    { label: "Flights",     href: "/flights" },
    { label: "About Us",    href: "/about"   },
    { label: "Contact Us",  href: "/contact" },
  ],
};

const contactItems = [
  { icon: Phone,  label: "+91 98765 43210" },
  { icon: Mail,   label: "info@booktick.in" },
  { icon: MapPin, label: "123 Travel House, New Delhi" },
];

const socials = [
  { icon: Facebook,  href: "#", label: "Facebook"  },
  { icon: Twitter,   href: "#", label: "Twitter"   },
  { icon: Linkedin,  href: "#", label: "LinkedIn"  },
  { icon: Instagram, href: "#", label: "Instagram" },
];

/* ── Payment marks (clean inline SVG badges) ─────────────────────────────── */
function MastercardMark() {
  return (
    <div
      className="h-7 w-11 rounded-md flex items-center justify-center"
      style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
      aria-label="Mastercard"
    >
      <span className="w-3.5 h-3.5 rounded-full -mr-1.5 z-10" style={{ backgroundColor: "#EB001B" }} />
      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: "#F79E1B" }} />
    </div>
  );
}
function VisaMark() {
  return (
    <div
      className="h-7 w-11 rounded-md flex items-center justify-center"
      style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
      aria-label="Visa"
    >
      <span className="text-[10px] font-extrabold italic tracking-tight" style={{ color: "#1A1F71" }}>
        VISA
      </span>
    </div>
  );
}
function PayPalMark() {
  return (
    <div
      className="h-7 w-12 rounded-md flex items-center justify-center"
      style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
      aria-label="PayPal"
    >
      <span className="text-[10px] font-extrabold italic" style={{ color: "#003087" }}>
        Pay<span style={{ color: "#009CDE" }}>Pal</span>
      </span>
    </div>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: "#0B0B1A" }}
      className="text-white relative overflow-hidden"
    >
      {/* Subtle ambient gradient — barely visible, adds depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 800px 400px at 80% 0%, rgba(31,140,158,0.10), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        {/* ── Main grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">

          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo-light.png"
                alt="BookTick"
                width={160}
                height={48}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p className="text-white/55 text-sm leading-relaxed mb-7 max-w-xs">
              BookTick is your trusted travel partner for curated holiday packages, flight options,
              and personalised travel experiences across India and the world. We believe travel
              should be simple, memorable, and stress-free.
            </p>

            {/* Social icons — circular pills */}
            <div className="flex gap-2.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 bg-white/[0.06] border border-white/10 hover:bg-[#1F8C9E] hover:border-[#1F8C9E]"
                >
                  <Icon className="w-4 h-4 text-white/80" />
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <FooterLinkColumn title="Destinations" links={linkGroups.Destinations} />

          {/* Travel Packages */}
          <FooterLinkColumn title="Travel Packages" links={linkGroups["Travel Packages"]} />

          {/* Quick Links + Contact */}
          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-5 tracking-tight">
              Quick Links
            </h4>
            <ul className="space-y-3 mb-8">
              {linkGroups["Quick Links"].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-white/25 group-hover:text-[#1F8C9E] transition-colors" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact items — icon chip + label */}
            <div className="space-y-3.5">
              {contactItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "rgba(31,140,158,0.14)",
                      border: "1px solid rgba(31,140,158,0.22)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#5BB1BD" }} />
                  </div>
                  <span className="text-white/75 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom strip ───────────────────────────────────────────── */}
        <div
          className="mt-14 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-white/40 text-sm">
            Copyright © {year} BookTick. All Rights Reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-white/45 text-sm">We Accept</span>
            <div className="flex gap-2">
              <MastercardMark />
              <VisaMark />
              <PayPalMark />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Sub-component: link column with chevron prefix ─────────────────────── */
function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-heading font-bold text-white text-lg mb-5 tracking-tight">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-white/25 group-hover:text-[#1F8C9E] transition-colors" />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
