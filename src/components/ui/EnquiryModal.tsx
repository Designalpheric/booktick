"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, CheckCircle, ArrowRight, AlertCircle, Phone } from "lucide-react";
import { EnquiryFormData } from "@/types";
import DateInput from "@/components/ui/DateInput";

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

type FieldKey = keyof EnquiryFormData;
type ErrorMap = Partial<Record<FieldKey, string>>;
type TouchMap = Partial<Record<FieldKey, boolean>>;

/* ── Per-field validation rules ─────────────────────────────────────────── */
function validateField(key: FieldKey, value: string | number): string {
  switch (key) {
    case "name":
      if (!String(value).trim()) return "Full name is required";
      if (String(value).trim().length < 2) return "Name must be at least 2 characters";
      return "";
    case "mobile":
      if (!String(value).trim()) return "Mobile number is required";
      if (!/^\d{10}$/.test(String(value).replace(/\s/g, ""))) return "Enter a valid 10-digit number";
      return "";
    case "email":
      if (!String(value).trim()) return "Email address is required";
      if (!/\S+@\S+\.\S+/.test(String(value))) return "Enter a valid email address";
      return "";
    case "destination":
      if (!String(value).trim()) return "Destination is required";
      return "";
    case "travelDate":
      if (!value) return "Travel date is required";
      return "";
    default:
      return "";
  }
}

/* ── Floating-label field wrapper ────────────────────────────────────────── */
function FloatField({
  label, required, error, children,
}: { label: React.ReactNode; required?: boolean; error?: string; children: React.ReactNode }) {
  const hasError = Boolean(error);
  return (
    <div className="relative pt-2 sm:pt-2.5">
      <label
        className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-[5] transition-colors"
        style={{ color: hasError ? "#f87171" : "#343434", backgroundColor: "#fff" }}
      >
        {label}{required && <span style={{ color: "#f87171" }}> *</span>}
      </label>
      {children}
      {hasError && (
        <p className="flex items-center gap-1 mt-1 text-[11px] sm:text-xs leading-tight" style={{ color: "#f87171" }}>
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Shared input style ──────────────────────────────────────────────────── */
const inputBase =
  "w-full px-4 py-2.5 sm:py-3.5 text-[13px] rounded-xl bg-white outline-none transition-all focus:ring-2 placeholder-gray-300";
const borderNormal = "1.5px solid rgba(20,20,20,0.14)";
const borderError  = "1.5px solid #f87171";
const focusNormal  = "focus:ring-[#1F8C9E]/20 focus:border-[#1F8C9E]";
const focusError   = "focus:ring-red-100 focus:border-red-400";

function inputCls(hasError: boolean) {
  return `${inputBase} ${hasError ? focusError : focusNormal}`;
}

/* ─────────────────────────────────────────────────────────────────────────── */
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
  const [errors,   setErrors]   = useState<ErrorMap>({});
  const [touched,  setTouched]  = useState<TouchMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialState,
        destination: prefillDestination,
        packageOrFlight: prefillPackageOrFlight,
        enquiryType,
      });
      setErrors({});
      setTouched({});
      setIsSuccess(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, prefillDestination, prefillPackageOrFlight, enquiryType]);

  /* ── onChange: update value + clear error if field is now valid ── */
  const handleChange = (k: FieldKey) => (v: string | number) => {
    setFormData(p => ({ ...p, [k]: v }));
    if (touched[k]) {
      const err = validateField(k, v);
      setErrors(p => ({ ...p, [k]: err || undefined }));
    }
  };

  /* ── onBlur: mark touched + validate immediately ── */
  const handleBlur = (k: FieldKey) => () => {
    setTouched(p => ({ ...p, [k]: true }));
    const err = validateField(k, formData[k] as string | number);
    setErrors(p => ({ ...p, [k]: err || undefined }));
  };

  /* ── Full validate on submit ── */
  const validateAll = (): boolean => {
    const required: FieldKey[] = ["name", "mobile", "email", "destination", "travelDate"];
    const newErrors: ErrorMap = {};
    const newTouched: TouchMap = {};
    required.forEach(k => {
      newTouched[k] = true;
      const err = validateField(k, formData[k] as string | number);
      if (err) newErrors[k] = err;
    });
    setTouched(p => ({ ...p, ...newTouched }));
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      /* scroll to the first error field */
      setTimeout(() => {
        const firstErr = formRef.current?.querySelector("[data-has-error='true']");
        firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
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

  const e = errors;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      {/* Modal card */}
      <div
        className="enquiry-modal-card relative w-full sm:max-w-[500px] max-h-[92vh] sm:max-h-[96vh] overflow-y-auto bg-white rounded-[24px]"
        style={{
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx global>{`
          .enquiry-modal-card::-webkit-scrollbar { display: none; width: 0; height: 0; }
        `}</style>

        {/* ── Success state (full card, no form header) ── */}
        {isSuccess ? (
          <div className="relative flex flex-col">

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.85)", color: "#343434" }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon + heading */}
            <div className="px-6 pt-8 pb-5 text-center">
              {/* Stacked ring icon */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full" style={{ backgroundColor: "rgba(31,140,158,0.08)" }} />
                  <div className="absolute w-[72px] h-[72px] rounded-full" style={{ backgroundColor: "rgba(31,140,158,0.14)" }} />
                  <div
                    className="relative w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #1F8C9E 0%, #0d6978 100%)", boxShadow: "0 8px 24px rgba(31,140,158,0.40)" }}
                  >
                    <CheckCircle className="w-7 h-7 text-white" strokeWidth={2.2} />
                  </div>
                </div>
              </div>

              <div
                className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: "rgba(22,163,74,0.09)", color: "#16a34a" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Enquiry Confirmed
              </div>

              <h3
                className="font-extrabold leading-tight mb-1"
                style={{ fontSize: "clamp(22px, 5vw, 28px)", color: "#1a1a1a", letterSpacing: "-0.025em" }}
              >
                You&apos;re all set,{" "}
                <span style={{ color: "#1F8C9E" }}>{formData.name}!</span>
              </h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "rgba(52,52,52,0.50)" }}>
                Your request has been received. Our travel expert will reach out shortly.
              </p>
            </div>

            {/* Phone callback card */}
            <div className="px-5 pb-5">
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(31,140,158,0.07) 0%, rgba(31,140,158,0.03) 100%)", border: "1.5px solid rgba(31,140,158,0.14)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(31,140,158,0.13)" }}
                >
                  <Phone className="w-[18px] h-[18px]" style={{ color: "#1F8C9E" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium mb-0.5" style={{ color: "rgba(52,52,52,0.45)" }}>We'll call you on</p>
                  <p className="font-extrabold text-[15px] leading-none" style={{ color: "#1a1a1a" }}>+91 {formData.mobile}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-medium mb-0.5" style={{ color: "rgba(52,52,52,0.40)" }}>Response in</p>
                  <p className="font-extrabold text-[13px] leading-none" style={{ color: "#16a34a" }}>≤ 2 hours</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-6 pt-0">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-white text-[14px] transition-all hover:opacity-90 active:scale-[0.99]"
                style={{ background: "linear-gradient(135deg, #1F8C9E 0%, #0d6978 100%)", boxShadow: "0 6px 24px rgba(31,140,158,0.32)" }}
              >
                Back to Exploring
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        ) : (
          /* ── Form mode: sticky header + form ── */
          <>
          {/* ── Sticky header ── */}
          <div
            className="sticky top-0 z-20 px-5 pt-5 pb-3 sm:px-7 sm:pt-6 sm:pb-5 bg-white"
            style={{ borderBottom: "1px solid rgba(20,20,20,0.06)" }}
          >

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
                  style={{ fontSize: "clamp(16px, 4vw, 22px)", color: "#343434", letterSpacing: "-0.022em" }}
                >
                  Plan Your{" "}
                  <span className="font-serif italic" style={{ color: "#1F8C9E", fontWeight: 400 }}>Trip</span>
                </h2>
                <p className="text-[11px] sm:text-[13px] mt-0.5" style={{ color: "rgba(52,52,52,0.50)" }}>
                  No fluff. Fill in your details and get a personalised plan within 2 hours.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 mt-0.5"
                style={{ backgroundColor: "#f3f4f6", color: "#343434" }}
                onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = "#e5e7eb")}
                onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = "#f3f4f6")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* ── Form ── */}
          <form ref={formRef} onSubmit={handleSubmit} noValidate
            className="px-5 pt-4 pb-5 space-y-3 sm:px-7 sm:pt-7 sm:pb-7 sm:space-y-4"
          >
            {/* Name + Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

              <FloatField label="Full Name" required error={e.name}>
                <input
                  data-has-error={!!e.name}
                  type="text" placeholder="Your full name"
                  value={formData.name}
                  onChange={ev => handleChange("name")(ev.target.value)}
                  onBlur={handleBlur("name")}
                  className={inputCls(!!e.name)}
                  style={{ border: e.name ? borderError : borderNormal }}
                />
              </FloatField>

              <FloatField label="Mobile" required error={e.mobile}>
                <div
                  data-has-error={!!e.mobile}
                  className="flex overflow-hidden rounded-xl"
                  style={{ border: e.mobile ? borderError : borderNormal }}
                >
                  <span
                    className="flex items-center px-3 text-[13px] font-semibold shrink-0 select-none"
                    style={{
                      backgroundColor: e.mobile ? "rgba(248,113,113,0.06)" : "rgba(31,140,158,0.06)",
                      borderRight: `1.5px solid ${e.mobile ? "rgba(248,113,113,0.3)" : "rgba(20,20,20,0.10)"}`,
                      color: e.mobile ? "#f87171" : "#343434",
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel" placeholder="10-digit number"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={ev => handleChange("mobile")(ev.target.value.replace(/\D/g, ""))}
                    onBlur={handleBlur("mobile")}
                    className="flex-1 px-3 py-2.5 sm:py-3.5 text-[13px] bg-white outline-none placeholder-gray-300"
                  />
                </div>
              </FloatField>
            </div>

            {/* Email */}
            <FloatField label="Your Email" required error={e.email}>
              <input
                data-has-error={!!e.email}
                type="email" placeholder="Enter your email"
                value={formData.email}
                onChange={ev => handleChange("email")(ev.target.value)}
                onBlur={handleBlur("email")}
                className={inputCls(!!e.email)}
                style={{ border: e.email ? borderError : borderNormal }}
              />
            </FloatField>

            {/* Destination + Travel Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FloatField label="Destination" required error={e.destination}>
                <input
                  data-has-error={!!e.destination}
                  type="text" placeholder="e.g. Goa, Dubai, Bali"
                  value={formData.destination}
                  onChange={ev => handleChange("destination")(ev.target.value)}
                  onBlur={handleBlur("destination")}
                  className={inputCls(!!e.destination)}
                  style={{ border: e.destination ? borderError : borderNormal }}
                />
              </FloatField>

              <FloatField label="Travel Date" required error={e.travelDate}>
                <DateInput
                  value={formData.travelDate}
                  onChange={(v) => { handleChange("travelDate")(v); handleBlur("travelDate")(); }}
                  min={new Date().toISOString().split("T")[0]}
                  error={!!e.travelDate}
                  placeholder="Select date"
                />
              </FloatField>
            </div>

            {/* Travellers */}
            <FloatField label="Number of Travellers">
              <input
                type="number" min={1} max={50} placeholder="e.g. 2"
                value={formData.travellers}
                onChange={ev => handleChange("travellers")(Number(ev.target.value))}
                className={inputCls(false)}
                style={{ border: borderNormal }}
              />
            </FloatField>

            {/* Message */}
            <FloatField label="Message / Special Requirements">
              <textarea
                rows={3}
                placeholder="Tell us your preferences, budget, or special requirements…"
                value={formData.message}
                onChange={ev => handleChange("message")(ev.target.value)}
                className="w-full px-4 py-2.5 sm:py-3.5 text-[13px] rounded-xl bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/20 focus:border-[#1F8C9E] placeholder-gray-300 resize-none"
                style={{ border: borderNormal }}
              />
            </FloatField>

            {/* Submit */}
            <div className="space-y-2.5 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 font-bold py-3 sm:py-4 rounded-xl text-[14px] sm:text-[15px] transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60 text-white"
                style={{ backgroundColor: "#343434" }}
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
          </>
        )}
      </div>
    </div>
  );
}
