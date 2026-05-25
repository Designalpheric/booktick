import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import CoreValuesTimeline from "@/components/about/CoreValuesTimeline";

export const metadata: Metadata = {
  title: "About Us — BookTick Travel",
  description: "Learn about BookTick — India's trusted travel agency for curated packages, flights, and personalised travel experiences.",
};

const team = [
  { name: "Ravi Kumar", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", bio: "15+ years in the travel industry, passionate about creating unforgettable journeys." },
  { name: "Priya Sharma", role: "Head of Operations", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face", bio: "Expert in logistics and customer experience with 10+ years of travel expertise." },
  { name: "Arjun Mehta", role: "Senior Travel Consultant", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", bio: "Specialises in international packages and adventure travel across 40+ countries." },
  { name: "Ananya Gupta", role: "Customer Relations", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", bio: "Dedicated to ensuring every traveller has an extraordinary and stress-free experience." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative h-64 sm:h-80">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=800&fit=crop"
          alt="About BookTick"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">About BookTick</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Your trusted travel partner for handcrafted journeys since 2015
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div>
            <p className="text-orange-500 font-semibold text-sm mb-2 uppercase tracking-wide">Our Story</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Crafting Journeys, Creating Memories</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              BookTick was founded in 2015 with a simple mission: to make travel accessible, personalised, and stress-free for every Indian traveller. What started as a small team of passionate travel enthusiasts has grown into one of India&apos;s most trusted travel agencies.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We believe that every journey is unique. That&apos;s why we don&apos;t offer one-size-fits-all booking — instead, our expert travel consultants craft personalised itineraries based on your preferences, budget, and travel style.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              From beachside resorts in Goa to luxury overwater villas in Maldives, from the desert dunes of Rajasthan to the misty mountains of Ladakh — we&apos;ve helped over 10,000 families and solo travellers experience the world&apos;s most beautiful destinations.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
              Plan Your Trip With Us
            </Link>
          </div>
          <div className="relative h-64 lg:h-auto rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&h=600&fit=crop"
              alt="Team at work"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Values — zig-zag timeline */}
        <CoreValuesTimeline />

        {/* Team */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Meet Our Team</h2>
            <p className="text-gray-500 mt-2">The people who make your travel dreams possible</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-orange-100"
                />
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-orange-500 text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f5f6e 0%, #1F8C9E 50%, #27a3b8 100%)",
          }}
        >
          {/* Diagonal overlay shapes */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 64px)",
            }}
          />
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
          <div
            className="absolute top-0 left-1/3 w-64 h-full pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 60%)",
              transform: "skewX(-20deg)",
            }}
          />

          {/* Content */}
          <div className="relative px-8 sm:px-12 pt-10 sm:pt-12 pb-10">

            {/* Heading */}
            <h2
              className="font-extrabold text-white leading-tight mb-3"
              style={{ fontSize: "clamp(26px, 4vw, 48px)", letterSpacing: "-0.025em" }}
            >
              Ready to Start{" "}
              <span className="font-serif italic" style={{ fontWeight: 400 }}>
                Your Journey?
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Join thousands of happy travellers who trust BookTick for their travel experiences.
              Let our experts plan your perfect trip.
            </p>

            {/* Divider */}
            <div className="border-t mb-8" style={{ borderColor: "rgba(255,255,255,0.18)" }} />

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

              {/* Left — icon + title + desc */}
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-base sm:text-lg leading-snug">Send a Free Enquiry</p>
                  <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.60)" }}>
                    — Get a personalised itinerary from our experts within 24 hours
                  </p>
                </div>
              </div>

              {/* Right — buttons */}
              <div className="flex flex-col xs:flex-row gap-3 shrink-0">
                <Link
                  href="/packages"
                  className="px-6 py-3 rounded-xl font-bold text-sm text-center transition-all hover:opacity-80 active:scale-95"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.22)",
                  }}
                >
                  Browse Packages
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl font-bold text-sm text-center bg-white transition-all hover:bg-white/90 active:scale-95"
                  style={{ color: "#0d6677" }}
                >
                  Contact Us Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
