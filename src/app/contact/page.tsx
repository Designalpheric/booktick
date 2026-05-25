"use client";

import { useState } from "react";
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle,
  User, MessageSquare, ArrowRight, Plane, Package,
  Heart, Users, Route,
} from "lucide-react";
import { EnquiryFormData } from "@/types";
import { cn } from "@/lib/utils";

/* ── WhatsApp SVG (reused) ─────────────────────────────────────────────────── */
function WaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ── Field wrapper ─────────────────────────────────────────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold mb-1.5" style={{ color: "#343434" }}>
      {children}
    </label>
  );
}

const inputBase =
  "w-full px-4 py-3 rounded-xl text-sm bg-white transition-all outline-none focus:ring-2 placeholder-gray-300";
const inputNormal =
  "border border-gray-200 focus:border-[#1F8C9E] focus:ring-[#1F8C9E]/20";
const inputError = "border-red-400 focus:ring-red-200";

/* ── Initial form state ────────────────────────────────────────────────────── */
const initialState: EnquiryFormData = {
  name: "", email: "", mobile: "", destination: "",
  travelDate: "", travellers: 2, message: "", enquiryType: "general",
};

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function ContactPage() {
  const [formData, setFormData] = useState<EnquiryFormData>(initialState);
  const [budgetText, setBudgetText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof EnquiryFormData, string>> = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.replace(/\s/g, "")))
      e.mobile = "Valid 10-digit mobile number required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Valid email is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const fullMessage = budgetText
      ? `Budget: ${budgetText}${formData.message ? `\n${formData.message}` : ""}`.trim()
      : formData.message;
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, message: fullMessage }),
      });
    } catch { /* silent */ }
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "#FFFFFF" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        className="py-16 sm:py-20 lg:py-24"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Left — large bold heading */}
            <div>
              <h1
                className="font-extrabold leading-none"
                style={{
                  fontSize: "clamp(48px, 7vw, 82px)",
                  color: "#343434",
                  letterSpacing: "-0.03em",
                }}
              >
                Contact Us
              </h1>
            </div>

            {/* Right — subtitle + paragraph */}
            <div>
              <h2
                className="font-extrabold leading-snug mb-3"
                style={{
                  fontSize: "clamp(18px, 1.8vw, 22px)",
                  color: "#343434",
                  letterSpacing: "-0.018em",
                }}
              >
                We&apos;d Love to Hear From You.
              </h2>
              <p
                className="leading-relaxed max-w-sm"
                style={{
                  color: "rgba(52,52,52,0.52)",
                  fontSize: "clamp(14px, 1.1vw, 15px)",
                }}
              >
                Got a travel question or ready to plan your next trip? Our experts are
                here to help — say hello, we&apos;re listening.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ── We're Open To ────────────────────────────────────────────────── */}
      <div className="bg-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center mb-10 sm:mb-12">
            <h2
              className="font-extrabold leading-tight mb-4"
              style={{ fontSize: "clamp(30px, 4vw, 48px)", color: "#343434", letterSpacing: "-0.03em" }}
            >
              We&apos;re Open To...
            </h2>
            <p
              className="max-w-xl mx-auto leading-relaxed"
              style={{ color: "rgba(52,52,52,0.52)", fontSize: "clamp(14px, 1.2vw, 16px)" }}
            >
              Whether you have a trip in mind, a question, or just want to explore your
              options — we&apos;re always happy to help you plan something special.
            </p>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Route,
                title: "Planning a New Trip",
                desc: "Turn your travel ideas into a personalised, ready-to-go itinerary.",
              },
              {
                icon: Package,
                title: "Booking a Travel Package",
                desc: "Browse and book from our curated national and international packages.",
              },
              {
                icon: Plane,
                title: "Flight Assistance",
                desc: "Let us find you the best flights, timings, and connecting routes.",
              },
              {
                icon: Heart,
                title: "Honeymoon Getaways",
                desc: "Romantic escapes crafted with special touches just for couples.",
              },
              {
                icon: Users,
                title: "Group & Corporate Travel",
                desc: "Custom travel plans for families, friend groups, and corporate teams.",
              },
              {
                icon: MessageSquare,
                title: "Just Saying Hello",
                desc: "Every great journey starts with a conversation — we're listening.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col p-6 sm:p-7 bg-white"
                style={{
                  border: "1px solid rgba(20,20,20,0.09)",
                  borderRadius: "16px",
                }}
              >
                {/* Icon box */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shrink-0"
                  style={{ backgroundColor: "rgba(31,140,158,0.10)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#1F8C9E" }} />
                </div>

                {/* Text */}
                <h3
                  className="font-bold text-base leading-snug mb-2"
                  style={{ color: "#343434" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(52,52,52,0.55)" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#F7F6F3" }} className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Left column — enhanced ────────────────────────────────── */}
          <div className="relative">

            {/* Soft teal glow — top left */}
            <div
              className="absolute -top-16 -left-16 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(31,140,158,0.09) 0%, transparent 70%)" }}
            />

            {/* Dot pattern — top right */}
            <div
              className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-60"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(31,140,158,0.35) 1.5px, transparent 1.5px)",
                backgroundSize: "12px 12px",
              }}
            />

            {/* Badge — teal pill with live dot */}
            <div className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(31,140,158,0.08)", border: "1px solid rgba(31,140,158,0.18)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#1F8C9E" }} />
              <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "#1F8C9E" }}>
                Contact Us
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-extrabold leading-[1.06] mb-5"
              style={{ fontSize: "clamp(30px, 3.8vw, 50px)", color: "#343434", letterSpacing: "-0.028em" }}
            >
              Every trip is unique,<br />
              we craft journeys<br />
              <span className="font-serif italic" style={{ fontWeight: 400, color: "#1F8C9E" }}>
                beyond bookings.
              </span>
            </h2>

            {/* Description */}
            <p className="leading-relaxed mb-8 max-w-sm" style={{ color: "rgba(52,52,52,0.52)", fontSize: "15px" }}>
              Share your travel goals with us. Our experts reply with a
              personalised itinerary within 2 hours, Mon–Sat.
            </p>

            {/* Stats grid — premium teal-tinted card */}
            <div
              className="mb-8 rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(31,140,158,0.14)" }}
            >
              {/* Header bar */}
              <div className="px-5 py-3 flex items-center gap-2"
                style={{ backgroundColor: "rgba(31,140,158,0.07)", borderBottom: "1px solid rgba(31,140,158,0.10)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1F8C9E" }} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#1F8C9E" }}>
                  Trusted by Travellers
                </p>
              </div>

              {/* 2×2 stat cells separated by hairlines */}
              <div className="grid grid-cols-2" style={{ backgroundColor: "rgba(31,140,158,0.06)" }}>
                {[
                  { value: "10,000+", label: "Happy Travellers" },
                  { value: "4.8 ★",   label: "Average Rating"   },
                  { value: "500+",    label: "Packages"          },
                  { value: "50+",     label: "Destinations"      },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className="bg-white px-5 py-4"
                    style={{
                      borderRight:  i % 2 === 0 ? "1px solid rgba(31,140,158,0.10)" : "none",
                      borderBottom: i < 2       ? "1px solid rgba(31,140,158,0.10)" : "none",
                    }}
                  >
                    <p className="font-extrabold text-xl leading-none mb-1" style={{ color: "#1F8C9E" }}>{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact channels — premium mini-cards */}
            <div className="space-y-2.5">
              <a
                href="tel:+919876543210"
                className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ backgroundColor: "#fff", border: "1px solid rgba(20,20,20,0.07)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(31,140,158,0.10)" }}>
                  <Phone className="w-4 h-4" style={{ color: "#1F8C9E" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone</p>
                  <p className="text-sm font-semibold" style={{ color: "#343434" }}>+91 98765 43210</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "#1F8C9E" }} />
              </a>

              <a
                href="mailto:info@booktick.in"
                className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ backgroundColor: "#fff", border: "1px solid rgba(20,20,20,0.07)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(31,140,158,0.10)" }}>
                  <Mail className="w-4 h-4" style={{ color: "#1F8C9E" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email</p>
                  <p className="text-sm font-semibold" style={{ color: "#343434" }}>info@booktick.in</p>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "#1F8C9E" }} />
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20BookTick!%20I%20want%20to%20plan%20a%20trip."
                target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ backgroundColor: "#fff", border: "1px solid rgba(20,20,20,0.07)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(37,211,102,0.10)" }}>
                  <WaIcon className="w-4 h-4 text-[#25d366]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">WhatsApp</p>
                  <p className="text-sm font-semibold" style={{ color: "#343434" }}>Chat instantly · 24/7</p>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "#22c55e" }} />
              </a>
            </div>
          </div>

          {/* ── Right column — form only ───────────────────────────────── */}
          <div className="relative">

            {/* Dotted pattern — bottom right */}
            <div
              className="absolute -bottom-10 -right-4 w-44 h-44 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(52,52,52,0.13) 1.5px, transparent 1.5px)",
                backgroundSize: "14px 14px",
              }}
            />

            {/* Form heading */}
            <div className="mb-6">
              <h3
                className="font-extrabold text-xl sm:text-2xl mb-1 leading-tight"
                style={{ color: "#343434", letterSpacing: "-0.02em" }}
              >
                Send Us an Enquiry
              </h3>
              <p className="text-sm" style={{ color: "rgba(52,52,52,0.50)" }}>
                Fill in your details and we&apos;ll craft a personalised itinerary for you.
              </p>
            </div>

            {/* Form card */}
            <div
              className="bg-white rounded-3xl overflow-hidden"
              style={{
                boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 20px 40px -16px rgba(20,20,20,0.14)",
                border: "1px solid rgba(20,20,20,0.05)",
              }}
            >
              {isSuccess ? (
                /* ── Success state ── */
                <div className="px-8 py-14 text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: "rgba(31,140,158,0.10)" }}
                  >
                    <CheckCircle className="w-10 h-10" style={{ color: "#1F8C9E" }} />
                  </div>
                  <h3
                    className="text-2xl font-extrabold mb-2"
                    style={{ color: "#343434", letterSpacing: "-0.02em" }}
                  >
                    Enquiry Sent!
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-gray-700">{formData.name}</span>! Our travel expert will call you on{" "}
                    <span className="font-semibold text-gray-700">{formData.mobile}</span> within 2 hours.
                  </p>
                  <button
                    onClick={() => { setIsSuccess(false); setFormData(initialState); }}
                    className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: "#1F8C9E" }}
                  >
                    Send Another Enquiry <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-6">

                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Your Details
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 mb-5">

                    <div>
                      <FieldLabel>Full Name <span className="text-red-400">*</span></FieldLabel>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        <input type="text" placeholder="Your full name" value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={cn(inputBase, "pl-10", errors.name ? inputError : inputNormal)} />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <FieldLabel>Mobile Number <span className="text-red-400">*</span></FieldLabel>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        <input type="tel" placeholder="10-digit number" value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className={cn(inputBase, "pl-10", errors.mobile ? inputError : inputNormal)} />
                      </div>
                      {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>Email Address <span className="text-red-400">*</span></FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        <input type="email" placeholder="your@email.com" value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={cn(inputBase, "pl-10", errors.email ? inputError : inputNormal)} />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-5 mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                      Trip Details
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">

                      <div>
                        <FieldLabel>Enquiry Type</FieldLabel>
                        <input type="text" placeholder="e.g. Package, Flight, General"
                          value={formData.enquiryType === "general" ? "" : formData.enquiryType}
                          onChange={(e) => setFormData({ ...formData, enquiryType: (e.target.value || "general") as "package" | "flight" | "general" })}
                          className={cn(inputBase, inputNormal)} />
                      </div>

                      <div>
                        <FieldLabel>Destination</FieldLabel>
                        <input type="text" placeholder="e.g. Goa, Dubai, Bali" value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          className={cn(inputBase, inputNormal)} />
                      </div>

                      <div>
                        <FieldLabel>Preferred Travel Date</FieldLabel>
                        <input type="date" value={formData.travelDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                          className={cn(inputBase, inputNormal)} />
                      </div>

                      <div>
                        <FieldLabel>Number of Travellers</FieldLabel>
                        <input type="number" min="1" max="50" placeholder="e.g. 2"
                          value={formData.travellers || ""}
                          onChange={(e) => setFormData({ ...formData, travellers: Number(e.target.value) })}
                          className={cn(inputBase, inputNormal)} />
                      </div>

                      <div className="sm:col-span-2">
                        <FieldLabel>Budget Range <span className="text-gray-400 font-normal text-xs">(per person)</span></FieldLabel>
                        <input type="text" placeholder="e.g. ₹40,000 – ₹80,000" value={budgetText}
                          onChange={(e) => setBudgetText(e.target.value)}
                          className={cn(inputBase, inputNormal)} />
                      </div>

                      <div className="sm:col-span-2">
                        <FieldLabel>Message / Special Requirements</FieldLabel>
                        <div className="relative">
                          <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300 pointer-events-none" />
                          <textarea rows={3}
                            placeholder="Tell us your travel preferences or any special requirements..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className={cn(inputBase, inputNormal, "pl-10 resize-none")} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button type="submit" disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 text-white font-bold py-3.5 rounded-xl text-[15px] transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
                      style={{ backgroundColor: "#1F8C9E" }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending Enquiry…
                        </>
                      ) : (
                        <><Send className="w-4 h-4" />Send Enquiry</>
                      )}
                    </button>
                    <p className="text-center text-gray-400 text-xs">
                      🔒 100% secure &nbsp;·&nbsp; No spam &nbsp;·&nbsp; No direct booking &nbsp;·&nbsp; Just expert travel assistance
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
        </div>
      </div>

      {/* ── Map section ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 20px 40px -16px rgba(20,20,20,0.12)",
            border: "1px solid rgba(20,20,20,0.05)",
          }}
        >
          {/* Map header bar */}
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{ backgroundColor: "#0E1424" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(31,140,158,0.20)" }}
            >
              <MapPin className="w-4 h-4" style={{ color: "#1F8C9E" }} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Our Office</p>
              <p className="text-white/50 text-xs">123 Travel House, Connaught Place, New Delhi – 110001</p>
            </div>
          </div>

          {/* Map embed */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9!2d77.2177!3d28.6315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xc7d6a0f9d0cc7bfb!2sConnaught%20Place%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
            width="100%"
            height="340"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="BookTick Office Location"
          />
        </div>
      </div>


    </div>
  );
}
