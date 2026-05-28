"use client";

import { useState, useRef } from "react";
import {
  Send, CheckCircle, AlertCircle,
  ArrowRight, Plane, Package, Route, Plus, Minus,
} from "lucide-react";
import { EnquiryFormData } from "@/types";
import DateInput from "@/components/ui/DateInput";

/* ── Per-field validation rules ─────────────────────────────────────────── */
type FieldKey = keyof EnquiryFormData | "budget";
type ErrorMap = Partial<Record<FieldKey, string>>;
type TouchMap = Partial<Record<FieldKey, boolean>>;

function validateField(key: FieldKey, value: string | number): string {
  const s = String(value).trim();
  switch (key) {
    case "name":
      if (!s) return "Full name is required";
      if (s.length < 2) return "Name must be at least 2 characters";
      return "";
    case "mobile":
      if (!s) return "Mobile number is required";
      if (!/^\d{10}$/.test(s.replace(/\s/g, ""))) return "Enter a valid 10-digit number";
      return "";
    case "email":
      if (!s) return "Email address is required";
      if (!/\S+@\S+\.\S+/.test(s)) return "Enter a valid email address";
      return "";
    case "destination":
      if (!s) return "Destination is required";
      return "";
    case "travelDate":
      if (!s) return "Travel date is required";
      return "";
    case "travellers":
      if (!s || Number(value) < 1) return "At least 1 traveller required";
      if (Number(value) > 50) return "Maximum 50 travellers";
      return "";
    default:
      return "";
  }
}

/* ── WhatsApp SVG ──────────────────────────────────────────────────────────── */
function WaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (k: FieldKey, v: string | number) => {
    if (k === "budget") { setBudgetText(String(v)); return; }
    setFormData(p => ({ ...p, [k]: v } as EnquiryFormData));
    const err = validateField(k, v);
    setErrors(p => ({ ...p, [k]: err || undefined }));
  };

  const handleBlur = (k: FieldKey) => () => {
    const value = k === "budget" ? budgetText : (formData[k as keyof EnquiryFormData] as string | number);
    const err = validateField(k, value);
    setErrors(p => ({ ...p, [k]: err || undefined }));
  };

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
    <div className="min-h-screen pt-[76px] sm:pt-[88px]" style={{ backgroundColor: "#FFFFFF" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        className="py-6 xs:py-8 sm:py-12 lg:py-16"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-10 lg:gap-16 items-center">

            {/* Left — large bold heading */}
            <div>
              <h1
                className="font-extrabold leading-none"
                style={{
                  fontSize: "clamp(32px, 7vw, 82px)",
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
                className="font-extrabold leading-snug mb-2 sm:mb-3"
                style={{
                  fontSize: "clamp(15px, 1.8vw, 22px)",
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
                  fontSize: "clamp(13px, 1.1vw, 15px)",
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
      <div className="py-8 xs:py-10 sm:py-16" style={{ backgroundColor: "#F7F6F3" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center mb-5 sm:mb-10">
            <h2
              className="font-extrabold leading-tight mb-2 sm:mb-3"
              style={{ fontSize: "clamp(22px, 4vw, 44px)", color: "#343434", letterSpacing: "-0.03em" }}
            >
              We&apos;re Open To...
            </h2>
            <p
              className="max-w-lg mx-auto leading-relaxed"
              style={{ color: "rgba(52,52,52,0.52)", fontSize: "clamp(13px, 1.1vw, 15px)" }}
            >
              Whether you have a trip in mind, a question, or just want to explore your
              options — we&apos;re always happy to help.
            </p>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
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
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-row sm:flex-col items-start gap-3 sm:gap-0 p-4 sm:p-6 bg-white"
                style={{
                  border: "1px solid rgba(20,20,20,0.07)",
                  borderRadius: "14px",
                }}
              >
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center sm:mb-4 shrink-0"
                  style={{ backgroundColor: "rgba(31,140,158,0.10)" }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#1F8C9E" }} />
                </div>
                <div>
                  <h3
                    className="font-bold text-sm sm:text-base leading-snug mb-1 sm:mb-2"
                    style={{ color: "#343434" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: "rgba(52,52,52,0.52)" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>


      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#F7F6F3" }} className="py-8 xs:py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            {/* ── Left column ──────────────────────────────────────────── */}
            <div className="relative lg:pt-2">

              {/* Decorative teal glow */}
              <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(31,140,158,0.08) 0%, transparent 70%)" }} />
              {/* Decorative dot grid */}
              <div className="absolute top-0 right-0 w-36 h-36 pointer-events-none opacity-50"
                style={{ backgroundImage: "radial-gradient(circle, rgba(31,140,158,0.32) 1.5px, transparent 1.5px)", backgroundSize: "12px 12px" }} />

              {/* Headline */}
              <h2 className="font-extrabold leading-[1.05] mb-3 sm:mb-5"
                style={{ fontSize: "clamp(22px, 4.5vw, 58px)", color: "#343434", letterSpacing: "-0.030em" }}>
                Every trip is unique,<br />
                we craft journeys<br />
                <span className="font-serif italic" style={{ fontWeight: 400, color: "#1F8C9E" }}>beyond bookings.</span>
              </h2>

              {/* Description */}
              <p className="leading-relaxed mb-5 sm:mb-8 max-w-md" style={{ color: "rgba(52,52,52,0.55)", fontSize: "clamp(13px,1.1vw,15px)" }}>
                Share your travel goals with us. Our experts reply with a personalised
                itinerary within 2 hours, Mon–Sat.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mb-6 sm:mb-10">
                <a href="/packages"
                  className="inline-flex items-center px-6 py-3 rounded-full font-bold text-sm transition-all hover:bg-gray-100 active:scale-95"
                  style={{ border: "1.5px solid rgba(52,52,52,0.18)", color: "#343434", backgroundColor: "transparent" }}>
                  Browse Packages
                </a>
                <a href="https://wa.me/919876543210?text=Hi%20BookTick!%20I%20want%20to%20plan%20a%20trip."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#1F8C9E" }}>
                  <WaIcon className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Divider */}
              <div className="border-t mb-5 sm:mb-8" style={{ borderColor: "rgba(52,52,52,0.10)" }} />

              {/* 3-column feature highlights */}
              <div className="grid grid-cols-3 gap-2 sm:gap-5">
                {[
                  {
                    title: "What We Offer",
                    items: ["National Tours", "International Tours", "Honeymoon Packages", "Adventure Tours"],
                  },
                  {
                    title: "Our Promise",
                    items: ["2hr Itinerary Reply", "4.8 ★ Avg Rating", "500+ Packages", "10,000+ Travellers"],
                  },
                  {
                    title: "Who We Serve",
                    items: ["Honeymoon Couples", "Families & Groups", "Solo Travellers", "Corporate Teams"],
                  },
                ].map(({ title, items }) => (
                  <div key={title}>
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center mb-2 sm:mb-3"
                      style={{ backgroundColor: "rgba(31,140,158,0.12)" }}>
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: "#1F8C9E" }} />
                    </div>
                    <p className="font-bold text-[11px] sm:text-sm mb-1.5 sm:mb-2.5" style={{ color: "#343434" }}>{title}</p>
                    <ul className="space-y-1 sm:space-y-1.5">
                      {items.map((item) => (
                        <li key={item} className="text-[10px] sm:text-xs leading-relaxed" style={{ color: "rgba(52,52,52,0.55)" }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column — form card ──────────────────────────────── */}
            <div className="relative">

              {/* Dot pattern — bottom right */}
              <div className="absolute -bottom-8 -right-4 w-40 h-40 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle, rgba(52,52,52,0.10) 1.5px, transparent 1.5px)", backgroundSize: "14px 14px" }} />

              {/* Card */}
              <div className="bg-white rounded-3xl relative"
                style={{ border: "1px solid rgba(20,20,20,0.10)" }}>

                {isSuccess ? (
                  /* ── Success state ── */
                  <div className="px-8 py-14 text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ backgroundColor: "rgba(31,140,158,0.10)" }}>
                      <CheckCircle className="w-10 h-10" style={{ color: "#1F8C9E" }} />
                    </div>
                    <h3 className="text-2xl font-extrabold mb-2" style={{ color: "#343434", letterSpacing: "-0.02em" }}>Enquiry Sent!</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                      Thank you, <span className="font-semibold text-gray-700">{formData.name}</span>! Our travel expert will call you on{" "}
                      <span className="font-semibold text-gray-700">{formData.mobile}</span> within 2 hours.
                    </p>
                    <button onClick={() => { setIsSuccess(false); setFormData(initialState); setBudgetText(""); setErrors({}); setTouched({}); }}
                      className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full text-white transition-all hover:opacity-90 active:scale-95"
                      style={{ backgroundColor: "#1F8C9E" }}>
                      Send Another Enquiry <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Card header */}
                    <div className="px-4 sm:px-7 pt-5 sm:pt-7 pb-4 sm:pb-5" style={{ borderBottom: "1px solid rgba(20,20,20,0.06)" }}>
                      <h3 className="font-extrabold mb-1 leading-tight"
                        style={{ fontSize: "clamp(18px, 1.8vw, 22px)", color: "#343434", letterSpacing: "-0.022em" }}>
                        Send Us an{" "}
                        <span style={{ color: "#1F8C9E" }}>Enquiry</span>
                      </h3>
                      <p className="text-sm" style={{ color: "rgba(52,52,52,0.50)" }}>
                        No fluff. Fill in your details and get a personalised travel plan within 2 hours.
                      </p>
                    </div>

                    {/* Form — floating label inputs */}
                    <form onSubmit={handleSubmit} className="px-4 sm:px-7 pt-4 sm:pt-7 pb-5 sm:pb-7 space-y-3">

                      {/* Row 1: Name + Mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* Full Name */}
                        <div className="relative pt-2.5">
                          <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                            style={{ color: "#343434", backgroundColor: "#fff" }}>
                            Your Name <span style={{ color: "#f87171" }}>*</span>
                          </label>
                          <input type="text" placeholder="Enter full name" value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3.5 text-[13px] rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/20 focus:border-[#1F8C9E] placeholder-gray-300"
                            style={{ border: errors.name ? "1.5px solid #f87171" : "1.5px solid rgba(20,20,20,0.14)" }} />
                          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Mobile */}
                        <div className="relative pt-2.5">
                          <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                            style={{ color: "#343434", backgroundColor: "#fff" }}>
                            Phone Number <span style={{ color: "#f87171" }}>*</span>
                          </label>
                          <div className="flex overflow-hidden rounded-xl"
                            style={{ border: errors.mobile ? "1.5px solid #f87171" : "1.5px solid rgba(20,20,20,0.14)" }}>
                            <span className="flex items-center px-3 text-[13px] font-semibold shrink-0 select-none"
                              style={{ backgroundColor: "rgba(31,140,158,0.06)", borderRight: "1.5px solid rgba(20,20,20,0.10)", color: "#343434" }}>
                              +91
                            </span>
                            <input type="tel" placeholder="10-digit number" value={formData.mobile}
                              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                              className="flex-1 px-3 py-3.5 text-[13px] bg-white outline-none placeholder-gray-300" />
                          </div>
                          {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="relative pt-2.5">
                        <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                          style={{ color: "#343434", backgroundColor: "#fff" }}>
                          Your Email <span style={{ color: "#f87171" }}>*</span>
                        </label>
                        <input type="email" placeholder="Enter your email" value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/15 placeholder-gray-300"
                          style={{ border: errors.email ? "1.5px solid #f87171" : "1.5px solid rgba(20,20,20,0.14)" }} />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                      </div>

                      {/* Row: Destination + Enquiry Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative pt-2.5">
                          <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                            style={{ color: "#343434", backgroundColor: "#fff" }}>Destination</label>
                          <input type="text" placeholder="e.g. Goa, Dubai, Bali" value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            className="w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/15 placeholder-gray-300"
                            style={{ border: "1.5px solid rgba(20,20,20,0.14)" }} />
                        </div>
                        <div className="relative pt-2.5">
                          <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                            style={{ color: "#343434", backgroundColor: "#fff" }}>Enquiry Type</label>
                          <input type="text" placeholder="Package, Flight, General"
                            value={formData.enquiryType === "general" ? "" : formData.enquiryType}
                            onChange={(e) => setFormData({ ...formData, enquiryType: (e.target.value || "general") as "package" | "flight" | "general" })}
                            className="w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/15 placeholder-gray-300"
                            style={{ border: "1.5px solid rgba(20,20,20,0.14)" }} />
                        </div>
                      </div>

                      {/* Row: Travel Date + Travellers */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative pt-2.5">
                          <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                            style={{ color: "#343434", backgroundColor: "#fff" }}>Travel Date</label>
                          <DateInput
                            value={formData.travelDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(v) => setFormData({ ...formData, travelDate: v })}
                            placeholder="Select date"
                          />
                        </div>
                        <div className="relative pt-2.5">
                          <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                            style={{ color: "#343434", backgroundColor: "#fff" }}>No. of Travellers</label>
                          <input type="number" min="1" max="50" placeholder="e.g. 2"
                            value={formData.travellers || ""}
                            onChange={(e) => setFormData({ ...formData, travellers: Number(e.target.value) })}
                            className="w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/15 placeholder-gray-300"
                            style={{ border: "1.5px solid rgba(20,20,20,0.14)" }} />
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="relative pt-2.5">
                        <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                          style={{ color: "#343434", backgroundColor: "#fff" }}>
                          Budget Range <span className="font-normal" style={{ color: "rgba(52,52,52,0.45)" }}>(per person)</span>
                        </label>
                        <input type="text" placeholder="e.g. ₹40,000 – ₹80,000" value={budgetText}
                          onChange={(e) => setBudgetText(e.target.value)}
                          className="w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/15 placeholder-gray-300"
                          style={{ border: "1.5px solid rgba(20,20,20,0.14)" }} />
                      </div>

                      {/* Message */}
                      <div className="relative pt-2.5">
                        <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                          style={{ color: "#343434", backgroundColor: "#fff" }}>Message / Requirements</label>
                        <textarea rows={3} placeholder="Tell us your travel preferences or any special requirements..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3.5 text-[13px] rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/15 placeholder-gray-300 resize-none"
                          style={{ border: "1.5px solid rgba(20,20,20,0.14)" }} />
                      </div>

                      {/* Submit */}
                      <div className="space-y-2.5 pt-1">
                        <button type="submit" disabled={isSubmitting}
                          className="w-full flex items-center justify-center gap-2.5 font-bold py-4 rounded-full text-[15px] transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
                          style={{ backgroundColor: "#343434", color: "#fff" }}>
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
                        <p className="text-center text-xs" style={{ color: "rgba(52,52,52,0.40)" }}>
                          We respond within 2 hours. No spam.
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>




      {/* ── FAQ Section ──────────────────────────────────────────────────── */}
      <div className="py-8 xs:py-12 sm:py-20" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-start">

            {/* Left — heading block */}
            <div className="lg:sticky lg:top-28 mb-2 lg:mb-0">
              <h2
                className="font-extrabold leading-[1.0] mb-1 sm:mb-2"
                style={{ fontSize: "clamp(26px, 5.5vw, 68px)", color: "#343434", letterSpacing: "-0.035em" }}
              >
                Got Questions?
              </h2>
              <p
                className="font-serif italic leading-tight mb-3 sm:mb-6"
                style={{ fontSize: "clamp(22px, 4.5vw, 58px)", color: "#343434", fontWeight: 400 }}
              >
                We&apos;ve Got Answers
              </p>
              <p
                className="leading-relaxed max-w-xs"
                style={{ color: "rgba(52,52,52,0.50)", fontSize: "clamp(13px, 1.1vw, 15px)" }}
              >
                If you&apos;re exploring travel options with BookTick, reach out and we&apos;ll walk you through everything you need to know.
              </p>
            </div>

            {/* Right — accordion */}
            <div style={{ borderTop: "1px solid rgba(52,52,52,0.10)" }}>
              {[
                {
                  q: "What Types of Travel Packages Does BookTick Offer?",
                  a: "We offer a wide range of curated national and international travel packages — from beachside getaways in Goa and Kerala to luxury escapes in Maldives, Dubai, Bali, and beyond. Every package is handcrafted by our travel experts.",
                },
                {
                  q: "How Do I Enquire About a Travel Package?",
                  a: "Simply fill out the enquiry form on this page, reach out via WhatsApp, or call us directly. Our team will get back to you within 2 hours (Mon–Sat) with personalised options tailored to your preferences.",
                },
                {
                  q: "Do You Offer Customised Itineraries?",
                  a: "Absolutely. Every itinerary we create is fully personalised based on your travel dates, budget, group size, and interests. We don't believe in one-size-fits-all — your trip is unique, and we plan it that way.",
                },
                {
                  q: "How Long Does It Take to Get a Personalised Itinerary?",
                  a: "Our travel experts typically respond within 2 hours during working hours (Mon–Sat, 9am–7pm IST). For complex international itineraries, it may take up to 24 hours to prepare a detailed proposal.",
                },
                {
                  q: "Is There Any Fee to Enquire or Plan a Trip?",
                  a: "Not at all — enquiries and itinerary consultations are completely free. We only charge once you review and confirm your travel plan. No hidden fees, no spam, just honest travel assistance.",
                },
              ].map((item, i) => (
                <div key={i} style={{ borderBottom: "1px solid rgba(52,52,52,0.10)" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left gap-4 group"
                  >
                    <span
                      className="font-semibold text-[15px] leading-snug transition-colors"
                      style={{ color: openFaq === i ? "#1F8C9E" : "#343434" }}
                    >
                      {item.q}
                    </span>
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all"
                      style={{
                        border: `1.5px solid ${openFaq === i ? "#1F8C9E" : "rgba(52,52,52,0.22)"}`,
                        color: openFaq === i ? "#1F8C9E" : "#343434",
                        backgroundColor: openFaq === i ? "rgba(31,140,158,0.07)" : "transparent",
                      }}
                    >
                      {openFaq === i
                        ? <Minus className="w-3.5 h-3.5" />
                        : <Plus className="w-3.5 h-3.5" />
                      }
                    </span>
                  </button>
                  {openFaq === i && (
                    <p
                      className="pb-5 text-sm leading-relaxed"
                      style={{ color: "rgba(52,52,52,0.55)" }}
                    >
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
