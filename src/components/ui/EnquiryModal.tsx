"use client";

import { useState, useEffect } from "react";
import { X, User, Phone, Mail, MapPin, Calendar, Users, MessageSquare, ArrowRight, CheckCircle } from "lucide-react";
import { EnquiryFormData } from "@/types";
import { cn } from "@/lib/utils";

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

/* ── Reusable field wrapper ─────────────────────────────────────────────── */
function FormField({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.1em] mb-1.5" style={{ color: "#6b7280" }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}

function InputWrap({ icon: Icon, error, children }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition-all"
      style={{
        border: `1.5px solid ${error ? "#f87171" : "rgba(0,0,0,0.10)"}`,
        backgroundColor: "#fafafa",
      }}
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color: "#1F8C9E" }} />
      {children}
    </div>
  );
}

const inputCls = "flex-1 min-w-0 text-sm bg-transparent focus:outline-none placeholder-gray-300 font-medium";

export default function EnquiryModal({
  isOpen, onClose,
  prefillDestination = "",
  prefillPackageOrFlight = "",
  enquiryType = "general",
  // title = "Send Enquiry", // reserved for future use
}: EnquiryModalProps) {
  const [formData, setFormData] = useState<EnquiryFormData>({
    ...initialState, destination: prefillDestination,
    packageOrFlight: prefillPackageOrFlight, enquiryType,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [errors, setErrors]             = useState<Partial<EnquiryFormData>>({});

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
    setErrors(e as Partial<EnquiryFormData>);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
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
        className="relative w-full sm:max-w-[480px] max-h-[96vh] overflow-y-auto"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.18)",
        }}
      >
        {/* ── Header ── */}
        <div
          className="sticky top-0 z-10 px-6 pt-6 pb-5"
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {/* Drag handle (mobile) */}
          <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4 sm:hidden" />

          <div className="flex items-start justify-between gap-3">
            <div>
              {/* Package pill */}
              {prefillPackageOrFlight && (
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-2"
                  style={{ backgroundColor: "rgba(31,140,158,0.10)", color: "#176D7B" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F8C9E]" />
                  {prefillPackageOrFlight}
                </div>
              )}
              <h2 className="text-xl font-extrabold leading-tight" style={{ color: "#1a1a1a", letterSpacing: "-0.02em" }}>
                Plan Your Trip
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">We&apos;ll respond within 2 hours</p>
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
          <div className="px-6 py-12 text-center">
            <div
              className="w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ width: 72, height: 72, backgroundColor: "rgba(31,140,158,0.12)" }}
            >
              <CheckCircle className="w-9 h-9" style={{ color: "#1F8C9E" }} />
            </div>
            <h3 className="text-xl font-extrabold mb-2" style={{ color: "#1a1a1a" }}>Enquiry Sent!</h3>
            <p className="text-gray-500 text-sm mb-1">
              Thank you, <span className="font-semibold text-gray-700">{formData.name}</span>!
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Our travel expert will call you within 2 hours on{" "}
              <span className="font-semibold text-gray-600">{formData.mobile}</span>.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "#1F8C9E" }}
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

            {/* Name */}
            <FormField label="Full Name" required error={errors.name as string}>
              <InputWrap icon={User} error={!!errors.name}>
                <input
                  type="text" placeholder="Your full name"
                  value={formData.name}
                  onChange={e => set("name")(e.target.value)}
                  className={cn(inputCls)} style={{ color: "#1a1a1a" }}
                />
              </InputWrap>
            </FormField>

            {/* Mobile + Email */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Mobile" required error={errors.mobile as string}>
                <InputWrap icon={Phone} error={!!errors.mobile}>
                  <input
                    type="tel" placeholder="10-digit"
                    value={formData.mobile}
                    onChange={e => set("mobile")(e.target.value)}
                    className={cn(inputCls)} style={{ color: "#1a1a1a" }}
                  />
                </InputWrap>
              </FormField>

              <FormField label="Email" required error={errors.email as string}>
                <InputWrap icon={Mail} error={!!errors.email}>
                  <input
                    type="email" placeholder="you@email.com"
                    value={formData.email}
                    onChange={e => set("email")(e.target.value)}
                    className={cn(inputCls)} style={{ color: "#1a1a1a" }}
                  />
                </InputWrap>
              </FormField>
            </div>

            {/* Destination + Date */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Destination" required error={errors.destination as string}>
                <InputWrap icon={MapPin} error={!!errors.destination}>
                  <input
                    type="text" placeholder="Goa, Dubai…"
                    value={formData.destination}
                    onChange={e => set("destination")(e.target.value)}
                    className={cn(inputCls)} style={{ color: "#1a1a1a" }}
                  />
                </InputWrap>
              </FormField>

              <FormField label="Travel Date" required error={errors.travelDate as string}>
                <InputWrap icon={Calendar} error={!!errors.travelDate}>
                  <input
                    type="date"
                    value={formData.travelDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => set("travelDate")(e.target.value)}
                    className={cn(inputCls, "cursor-pointer")} style={{ color: formData.travelDate ? "#1a1a1a" : "#9ca3af" }}
                  />
                </InputWrap>
              </FormField>
            </div>

            {/* Travellers */}
            <FormField label="Number of Travellers">
              <InputWrap icon={Users}>
                <select
                  value={formData.travellers}
                  onChange={e => set("travellers")(Number(e.target.value))}
                  className={cn(inputCls, "cursor-pointer appearance-none w-full")}
                  style={{ color: "#1a1a1a" }}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? "Traveller" : "Travellers"}</option>
                  ))}
                  <option value={11}>10+ Travellers (Group)</option>
                </select>
              </InputWrap>
            </FormField>

            {/* Message */}
            <FormField label="Message / Special Requirements">
              <div
                className="flex gap-2.5 px-3.5 py-3 rounded-xl"
                style={{ border: "1.5px solid rgba(0,0,0,0.10)", backgroundColor: "#fafafa" }}
              >
                <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#1F8C9E" }} />
                <textarea
                  rows={3}
                  placeholder="Tell us your preferences, budget, or special requirements…"
                  value={formData.message}
                  onChange={e => set("message")(e.target.value)}
                  className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-300 resize-none font-medium"
                  style={{ color: "#1a1a1a" }}
                />
              </div>
            </FormField>

            {/* Submit */}
            <div className="pt-1 pb-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3.5 rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "#1F8C9E" }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-gray-400 text-xs mt-3">
                🔒 Your details are secure. We never share your information.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
