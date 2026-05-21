import Link from "next/link";
import { Plane, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  "Destinations": [
    { label: "Goa",      href: "/destinations/goa" },
    { label: "Kerala",   href: "/destinations/kerala" },
    { label: "Rajasthan",href: "/destinations/rajasthan" },
    { label: "Dubai",    href: "/destinations/dubai" },
    { label: "Bali",     href: "/destinations/bali" },
    { label: "Maldives", href: "/destinations/maldives" },
  ],
  "Travel Packages": [
    { label: "Domestic Tours",       href: "/packages?category=domestic" },
    { label: "International Tours",  href: "/packages?category=international" },
    { label: "Honeymoon Packages",   href: "/packages?type=Honeymoon" },
    { label: "Adventure Tours",      href: "/packages?type=Adventure" },
    { label: "Luxury Tours",         href: "/packages?type=Luxury" },
    { label: "Family Packages",      href: "/packages?type=Family" },
  ],
  "Quick Links": [
    { label: "Flights",           href: "/flights" },
    { label: "About Us",          href: "/about" },
    { label: "Contact Us",        href: "/contact" },
    { label: "Submit Enquiry",    href: "/contact" },
    { label: "Privacy Policy",    href: "/privacy" },
    { label: "Terms & Conditions",href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#12004D" }} className="text-white">

      {/* Top CTA Banner — navy → cyan gradient */}
      <div style={{ background: "linear-gradient(135deg, #1B0A6B 0%, #43C6D9 100%)" }} className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-xl font-bold">Ready to Plan Your Dream Holiday?</h3>
            <p className="text-white/70 text-sm mt-1">Talk to our travel experts today — free consultation!</p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://wa.me/919876543210?text=Hi%20BookTick!%20I%20want%20to%20plan%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white font-semibold px-6 py-2.5 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
              style={{ color: "#12004D" }}
            >
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              Send Enquiry
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#43C6D9" }}>
                <Plane className="w-5 h-5 text-white rotate-45" />
              </div>
              <span className="text-xl font-bold">
                Book<span style={{ color: "#43C6D9" }}>Tick</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              BookTick is your trusted travel partner for curated holiday packages, flight options, and personalised travel experiences across India and the world. We believe travel should be simple, memorable, and stress-free.
            </p>
            <div className="space-y-2.5 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" style={{ color: "#43C6D9" }} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" style={{ color: "#43C6D9" }} />
                <span>info@booktick.in</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#43C6D9" }} />
                <span>123 Travel House, Connaught Place, New Delhi – 110001</span>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-white/10 hover:bg-orange-500"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide"
                  style={{ color: "#43C6D9" }}>
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors text-white/50 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {[
              { icon: "🏆", label: "Award Winning Agency" },
              { icon: "✈️", label: "10,000+ Happy Travellers" },
              { icon: "🌍", label: "50+ Destinations" },
              { icon: "⭐", label: "4.8/5 Average Rating" },
              { icon: "🔒", label: "Secure Enquiry System" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-sm text-white/50">
                <span className="text-xl">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/30 text-sm">
            © {new Date().getFullYear()} BookTick Travel. All rights reserved. | Built with ❤️ for travellers.
          </p>
        </div>
      </div>
    </footer>
  );
}
