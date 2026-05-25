"use client";

import { useState } from "react";
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle,
  User, MessageSquare, ArrowRight,
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
    <div className="min-h-screen pt-16" style={{ backgroundColor: "#FAF7F2" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        className="py-10 sm:py-14"
        style={{ background: "linear-gradient(135deg, #0e5f6e 0%, #1F8C9E 60%, #2ba8bd 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="font-extrabold text-white mb-3 leading-tight tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.025em" }}
          >
            Let&apos;s Plan Your{" "}
            <span className="font-serif italic font-normal" style={{ color: "#F2A93B" }}>
              Dream Trip
            </span>
          </h1>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Share your travel goals with us — our experts will craft a personalised itinerary and call you within 2 hours.
          </p>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

          {/* ── Left: Contact sidebar ──────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Info card */}
            <div
              className="bg-white rounded-3xl p-6"
              style={{
                boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 20px 40px -16px rgba(20,20,20,0.14)",
                border: "1px solid rgba(20,20,20,0.05)",
              }}
            >
              <h2
                className="font-extrabold text-lg mb-6"
                style={{ color: "#343434", letterSpacing: "-0.01em" }}
              >
                Get In Touch
              </h2>

              <div className="space-y-5">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(31,140,158,0.10)" }}
                  >
                    <Phone className="w-5 h-5" style={{ color: "#1F8C9E" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Phone</p>
                    <a
                      href="tel:+919876543210"
                      className="text-sm font-semibold hover:underline"
                      style={{ color: "#1F8C9E" }}
                    >
                      +91 98765 43210
                    </a>
                    <p className="text-gray-400 text-xs mt-0.5">Mon–Sat, 9 AM – 8 PM</p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(37,211,102,0.10)" }}
                  >
                    <WaIcon className="w-5 h-5 text-[#25d366]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">WhatsApp</p>
                    <a
                      href="https://wa.me/919876543210?text=Hi%20BookTick!%20I%20want%20to%20plan%20a%20trip."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#1ebe5d] hover:underline"
                    >
                      Chat Instantly
                    </a>
                    <p className="text-gray-400 text-xs mt-0.5">Available 24/7</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(31,140,158,0.10)" }}
                  >
                    <Mail className="w-5 h-5" style={{ color: "#1F8C9E" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Email</p>
                    <a
                      href="mailto:info@booktick.in"
                      className="text-sm font-semibold hover:underline"
                      style={{ color: "#1F8C9E" }}
                    >
                      info@booktick.in
                    </a>
                    <p className="text-gray-400 text-xs mt-0.5">Reply within 4 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(242,169,59,0.12)" }}
                  >
                    <MapPin className="w-5 h-5" style={{ color: "#d97706" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Office</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      123 Travel House,<br />Connaught Place,<br />New Delhi – 110001
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(31,140,158,0.10)" }}
                  >
                    <Clock className="w-5 h-5" style={{ color: "#1F8C9E" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Hours</p>
                    <p className="text-sm text-gray-600">Mon–Fri: 9 AM – 8 PM</p>
                    <p className="text-sm text-gray-600">Sat–Sun: 10 AM – 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210?text=Hi%20BookTick!%20I%20want%20to%20plan%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 w-full rounded-2xl px-5 py-4 transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                boxShadow: "0 4px 18px -4px rgba(34,197,94,0.38)",
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <WaIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">Chat on WhatsApp</p>
                <p className="text-white/70 text-xs mt-0.5">Available 24 / 7 · Instant reply</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/60 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* Response time badge */}
            <div
              className="rounded-2xl px-5 py-4 flex items-center gap-3"
              style={{
                backgroundColor: "rgba(31,140,158,0.07)",
                border: "1px solid rgba(31,140,158,0.15)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#1F8C9E" }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#1F8C9E" }}>
                  We respond within 2 hours
                </p>
                <p className="text-xs text-gray-500">Mon – Sat, 9 AM to 8 PM IST</p>
              </div>
            </div>
          </div>

          {/* ── Right: Enquiry form ────────────────────────────────────── */}
          <div
            className="bg-white rounded-3xl overflow-hidden"
            style={{
              boxShadow: "0 1px 2px rgba(20,20,20,0.04), 0 20px 40px -16px rgba(20,20,20,0.14)",
              border: "1px solid rgba(20,20,20,0.05)",
            }}
          >
            {/* Form header */}
            <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-gray-100">
              <h2
                className="font-extrabold text-xl sm:text-2xl mb-1 leading-tight"
                style={{ color: "#343434", letterSpacing: "-0.02em" }}
              >
                Send Us an Enquiry
              </h2>
              <p className="text-gray-400 text-sm">
                Fill in your details and we&apos;ll craft a personalised itinerary for you.
              </p>
            </div>

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

                {/* ── Required fields ── */}
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Your Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 mb-5">

                  {/* Name */}
                  <div>
                    <FieldLabel>Full Name <span className="text-red-400">*</span></FieldLabel>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn(inputBase, "pl-10", errors.name ? inputError : inputNormal)}
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Mobile */}
                  <div>
                    <FieldLabel>Mobile Number <span className="text-red-400">*</span></FieldLabel>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className={cn(inputBase, "pl-10", errors.mobile ? inputError : inputNormal)}
                      />
                    </div>
                    {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <FieldLabel>Email Address <span className="text-red-400">*</span></FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn(inputBase, "pl-10", errors.email ? inputError : inputNormal)}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* ── Trip details ── */}
                <div className="border-t border-gray-100 pt-5 mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Trip Details
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">

                    {/* Enquiry Type */}
                    <div>
                      <FieldLabel>Enquiry Type</FieldLabel>
                      <input
                        type="text"
                        placeholder="e.g. Package, Flight, General"
                        value={formData.enquiryType === "general" ? "" : formData.enquiryType}
                        onChange={(e) =>
                          setFormData({ ...formData, enquiryType: (e.target.value || "general") as "package" | "flight" | "general" })
                        }
                        className={cn(inputBase, inputNormal)}
                      />
                    </div>

                    {/* Destination */}
                    <div>
                      <FieldLabel>Destination</FieldLabel>
                      <input
                        type="text"
                        placeholder="e.g. Goa, Dubai, Bali"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className={cn(inputBase, inputNormal)}
                      />
                    </div>

                    {/* Travel Date */}
                    <div>
                      <FieldLabel>Preferred Travel Date</FieldLabel>
                      <input
                        type="date"
                        value={formData.travelDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                        className={cn(inputBase, inputNormal)}
                      />
                    </div>

                    {/* Travellers */}
                    <div>
                      <FieldLabel>Number of Travellers</FieldLabel>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        placeholder="e.g. 2"
                        value={formData.travellers || ""}
                        onChange={(e) => setFormData({ ...formData, travellers: Number(e.target.value) })}
                        className={cn(inputBase, inputNormal)}
                      />
                    </div>

                    {/* Budget Range */}
                    <div className="sm:col-span-2">
                      <FieldLabel>Budget Range <span className="text-gray-400 font-normal text-xs">(per person)</span></FieldLabel>
                      <input
                        type="text"
                        placeholder="e.g. ₹40,000 – ₹80,000"
                        value={budgetText}
                        onChange={(e) => setBudgetText(e.target.value)}
                        className={cn(inputBase, inputNormal)}
                      />
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2">
                      <FieldLabel>Message / Special Requirements</FieldLabel>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300 pointer-events-none" />
                        <textarea
                          rows={3}
                          placeholder="Tell us your travel preferences or any special requirements..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className={cn(inputBase, inputNormal, "pl-10 resize-none")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
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
                      <>
                        <Send className="w-4 h-4" />
                        Send Enquiry
                      </>
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

      {/* ── Bottom CTA strip ─────────────────────────────────────────────── */}
      <div
        className="py-14"
        style={{ backgroundColor: "#0E1424" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="font-extrabold text-white mb-3 leading-tight"
            style={{ fontSize: "clamp(24px, 3.5vw, 40px)", letterSpacing: "-0.025em" }}
          >
            Prefer to talk?{" "}
            <span className="font-serif italic font-normal" style={{ color: "#F2A93B" }}>
              We&apos;re one call away.
            </span>
          </h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
            Our travel experts are available Mon–Sat, 9 AM to 8 PM. Call us or start a WhatsApp chat right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919876543210"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-full text-[15px] text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#1F8C9E" }}
            >
              <Phone className="w-4 h-4" />
              Call +91 98765 43210
            </a>
            <a
              href="https://wa.me/919876543210?text=Hi%20BookTick!%20I%20want%20to%20plan%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-full text-[15px] text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#22c55e" }}
            >
              <WaIcon className="w-4 h-4" />
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
