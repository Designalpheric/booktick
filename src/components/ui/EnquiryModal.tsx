"use client";

import { useState, useEffect } from "react";
import { X, Send, CheckCircle, ArrowRight } from "lucide-react";
import { EnquiryFormData } from "@/types";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillDestination?: string;
  prefillPackageOrFlight?: string;
  enquiryType?: "package" | "flight" | "general";
  title?: string;
}

const initialState: EnquiryFormData = {
  name: "", email: "", mobile: "", destination: "",
  travelDate: "", travellers: 2, packageOrFlight: "",
  message: "", enquiryType: "general",
};

/* ── Floating-label field wrapper — matches contact page ─────────────────── */
function FloatField({
  label, required, error, children,
}: { label: React.ReactNode; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="relative pt-2.5">
      <label
        className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
        style={{ color: "#343434", backgroundColor: "#fff" }}
      >
        {label}{required && <span style={{ color: "#f87171" }}> *</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* Shared input className */
const inputCls =
  "w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/15 placeholder-gray-300";
const borderNormal = "1.5px solid rgba(20,20,20,0.14)";
const borderError  = "1.5px solid #f87171";

export default function EnquiryModal({
  isOpen, onClose,
  prefillDestination = "",
  prefillPackageOrFlight = "",
  enquiryType = "general",
}: EnquiryModalProps) {
  const [formData, setFormData] = useState<EnquiryFormData>({
    ...initialState, destination: prefillDestination,
    packageOrFlight: prefillPackageOrFlight, enquiryType,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [errors, setErrors]             = useState<Partial<Record<keyof EnquiryFormData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...initialState, destination: prefillDestination, packageOrFlight: prefillPackageOrFlight, enquiryType });
      setIsSuccess(false); setErrors({});
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, prefillDestination, prefillPackageOrFlight, enquiryType]);

  const set = (k: keyof EnquiryFormData) => (v: string | number) =>
    setFormData((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Partial<Record<keyof EnquiryFormData, string>> = {};
    if (!formData.name.trim())    e.name        = "Name is required";
    if (!/^\d{10}$/.test(formData.mobile.replace(/\s/g, ""))) e.mobile = "Valid 10-digit number required";
    if (!/\S+@\S+\.\S+/.test(formData.email))  e.email       = "Valid email is required";
    if (!formData.destination.trim())           e.destination = "Destination is required";
    if (!formData.travelDate)                   e.travelDate  = "Travel date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/enquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch { /* show success anyway */ }
    finally { setIsSubmitting(false); setIsSuccess(true); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      {/* Modal card */}
      <div
        className="relative w-full sm:max-w-[500px] max-h-[96vh] overflow-y-auto bg-white"
        style={{
          borderRadius: "0px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* ── Sticky header ── */}
        <div
          className="sticky top-0 z-10 px-7 pt-6 pb-5 bg-white"
          style={{ borderBottom: "1px solid rgba(20,20,20,0.06)" }}
        >
          {/* Mobile drag handle */}
          <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4 sm:hidden" />

          <div className="flex items-start justify-between gap-3">
            <div>
              {prefillPackageOrFlight && (
                <div
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide px-3 py-1 rounded-full mb-2"
                  style={{ backgroundColor: "rgba(31,140,158,0.08)", color: "#1F8C9E", border: "1px solid rgba(31,140,158,0.18)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1F8C9E" }} />
                  {prefillPackageOrFlight}
                </div>
              )}
              <h2
                className="font-extrabold leading-tight"
                style={{ fontSize: "clamp(18px, 1.8vw, 22px)", color: "#343434", letterSpacing: "-0.022em" }}
              >
                Plan Your{" "}
                <span className="font-serif italic" style={{ color: "#1F8C9E", fontWeight: 400 }}>Trip</span>
              </h2>
              <p className="text-[13px] mt-0.5" style={{ color: "rgba(52,52,52,0.50)" }}>
                No fluff. Fill in your details and get a personalised plan within 2 hours.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 mt-0.5"
              style={{ backgroundColor: "#f3f4f6", color: "#343434" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Success state ── */}
        {isSuccess ? (
          <div className="px-7 py-14 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: "rgba(31,140,158,0.10)" }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: "#1F8C9E" }} />
            </div>
            <h3
              className="font-extrabold mb-2"
              style={{ fontSize: "22px", color: "#343434", letterSpacing: "-0.02em" }}
            >
              Enquiry Sent!
            </h3>
            <p className="mb-1" style={{ color: "rgba(52,52,52,0.55)", fontSize: "14px" }}>
              Thank you, <span className="font-semibold" style={{ color: "#343434" }}>{formData.name}</span>!
            </p>
            <p className="mb-8" style={{ color: "rgba(52,52,52,0.50)", fontSize: "14px" }}>
              Our travel expert will call you on{" "}
              <span className="font-semibold" style={{ color: "#343434" }}>{formData.mobile}</span> within 2 hours.
            </p>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#1F8C9E" }}
            >
              Close <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="px-7 pt-7 pb-7 space-y-4">

            {/* Row: Name + Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Full Name */}
              <FloatField label="Full Name" required error={errors.name}>
                <input
                  type="text" placeholder="Your full name"
                  value={formData.name}
                  onChange={e => set("name")(e.target.value)}
                  className={inputCls}
                  style={{ border: errors.name ? borderError : borderNormal }}
                />
              </FloatField>

              {/* Mobile — +91 prefix */}
              <FloatField label="Mobile" required error={errors.mobile}>
                <div
                  className="flex overflow-hidden"
                  style={{ border: errors.mobile ? borderError : borderNormal }}
                >
                  <span
                    className="flex items-center px-3 text-[13px] font-semibold shrink-0 select-none"
                    style={{
                      backgroundColor: "rgba(31,140,158,0.06)",
                      borderRight: "1.5px solid rgba(20,20,20,0.10)",
                      color: "#343434",
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel" placeholder="10-digit number"
                    value={formData.mobile}
                    onChange={e => set("mobile")(e.target.value)}
                    className="flex-1 px-3 py-3.5 text-[13px] bg-white outline-none placeholder-gray-300"
                  />
                </div>
              </FloatField>
            </div>

            {/* Email */}
            <FloatField label="Your Email" required error={errors.email}>
              <input
                type="email" placeholder="Enter your email"
                value={formData.email}
                onChange={e => set("email")(e.target.value)}
                className={inputCls}
                style={{ border: errors.email ? borderError : borderNormal }}
              />
            </FloatField>

            {/* Row: Destination + Travel Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatField label="Destination" required error={errors.destination}>
                <input
                  type="text" placeholder="e.g. Goa, Dubai, Bali"
                  value={formData.destination}
                  onChange={e => set("destination")(e.target.value)}
                  className={inputCls}
                  style={{ border: errors.destination ? borderError : borderNormal }}
                />
              </FloatField>

              <FloatField label="Travel Date" required error={errors.travelDate}>
                <input
                  type="date"
                  value={formData.travelDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => set("travelDate")(e.target.value)}
                  className={inputCls}
                  style={{ border: errors.travelDate ? borderError : borderNormal }}
                />
              </FloatField>
            </div>

            {/* No. of Travellers */}
            <FloatField label="Number of Travellers">
              <select
                value={formData.travellers}
                onChange={e => set("travellers")(Number(e.target.value))}
                className={inputCls + " appearance-none cursor-pointer"}
                style={{ border: borderNormal }}
              >
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? "Traveller" : "Travellers"}</option>
                ))}
                <option value={11}>10+ Travellers (Group)</option>
              </select>
            </FloatField>

            {/* Message */}
            <FloatField label="Message / Special Requirements">
              <textarea
                rows={3}
                placeholder="Tell us your preferences, budget, or special requirements…"
                value={formData.message}
                onChange={e => set("message")(e.target.value)}
                className="w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/15 placeholder-gray-300 resize-none"
                style={{ border: borderNormal }}
              />
            </FloatField>

            {/* Submit */}
            <div className="space-y-2.5 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 font-bold py-4 text-[15px] transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60 text-white"
                style={{ backgroundColor: "#343434", borderRadius: "10px" }}
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
              <p className="text-center text-xs" style={{ color: "rgba(52,52,52,0.40)" }}>
                We respond within 2 hours. No spam.
              </p>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
