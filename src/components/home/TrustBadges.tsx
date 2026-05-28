import { Shield, Award, Headphones, RefreshCw, Users, Star } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "100% Safe & Secure",
    desc: "Your personal data and enquiries are fully protected with enterprise-grade security.",
    iconBg: "rgba(31,140,158,0.10)",
    iconColor: "#1F8C9E",
  },
  {
    icon: Award,
    title: "Award-Winning Agency",
    desc: "Recognised as one of India's top travel agencies for 3 consecutive years.",
    iconBg: "rgba(31,140,158,0.10)",
    iconColor: "#1F8C9E",
  },
  {
    icon: Headphones,
    title: "24/7 Travel Support",
    desc: "Our expert team is available round the clock via phone, WhatsApp, and email.",
    iconBg: "rgba(31,140,158,0.10)",
    iconColor: "#1F8C9E",
  },
  {
    icon: RefreshCw,
    title: "Flexible Cancellation",
    desc: "Plans change — we offer flexible rescheduling and cancellation policies.",
    iconBg: "rgba(31,140,158,0.10)",
    iconColor: "#1F8C9E",
  },
  {
    icon: Users,
    title: "Expert Travel Planners",
    desc: "Dedicated travel consultants with 10+ years of experience in each destination.",
    iconBg: "rgba(31,140,158,0.10)",
    iconColor: "#1F8C9E",
  },
  {
    icon: Star,
    title: "Best Price Guarantee",
    desc: "We match or beat any comparable quote. Get the best deal — guaranteed.",
    iconBg: "rgba(31,140,158,0.10)",
    iconColor: "#1F8C9E",
  },
];

const stats = [
  { value: "10,000+", label: "Happy Travellers" },
  { value: "50+",     label: "Destinations"     },
  { value: "500+",    label: "Packages"          },
  { value: "4.8★",   label: "Average Rating"    },
];

export default function TrustBadges() {
  return (
    <section className="py-14 xs:py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">

        {/* ── Left-aligned heading ── */}
        <div className="mb-10 sm:mb-12">
          <h2
            className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold leading-tight mb-3"
            style={{ color: "#343434" }}
          >
            Travel with{" "}
            <span className="font-serif italic" style={{ fontWeight: 400 }}>
              Complete Confidence
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Everything you need for a seamless travel experience
          </p>
        </div>

        {/* ── Features grid — open layout, no card borders ── */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-x-6 xs:gap-x-8 sm:gap-x-10 lg:gap-x-12 gap-y-7 xs:gap-y-8 sm:gap-y-10">
          {badges.map((badge) => (
            <div key={badge.title} className="flex gap-4 group">

              {/* Icon box */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: badge.iconBg }}
              >
                <badge.icon
                  className="w-6 h-6"
                  style={{ color: badge.iconColor }}
                />
              </div>

              {/* Text */}
              <div className="pt-1">
                <h3
                  className="font-bold text-base mb-1.5 leading-snug"
                  style={{ color: "#343434" }}
                >
                  {badge.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
