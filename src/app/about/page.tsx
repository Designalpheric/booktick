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
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to Start Your Journey?</h2>
          <p className="text-orange-100 mb-6 max-w-xl mx-auto">Join thousands of happy travellers who trust BookTick for their travel experiences. Send us an enquiry and let our experts plan your perfect trip.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/packages" className="bg-white text-orange-600 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors">
              Browse Packages
            </Link>
            <Link href="/contact" className="bg-orange-700 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-orange-800 transition-colors">
              Contact Us Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
