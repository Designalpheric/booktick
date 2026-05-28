"use client";

import { useState, useRef } from "react";
import {
  PlaneTakeoff, PlaneLanding, ArrowLeftRight, ArrowLeft,
  Phone, CheckCircle2, Clock, Shield, Star, Sparkles, Send, Users, AlertCircle,
} from "lucide-react";
import DateInput from "@/components/ui/DateInput";

/* ── Per-field validation rules ─────────────────────────────────────────── */
type FlightFieldKey = "from" | "to" | "depart" | "returnD" | "name" | "phone" | "email";

function validateFlightField(
  key: FlightFieldKey,
  value: string,
  tripType: string
): string {
  const s = value.trim();
  switch (key) {
    case "from":
      if (!s) return "Departure city is required";
      if (s.length < 2) return "Enter a valid city";
      return "";
    case "to":
      if (!s) return "Destination is required";
      if (s.length < 2) return "Enter a valid city";
      return "";
    case "depart":
      if (!s) return "Departure date is required";
      return "";
    case "returnD":
      if (tripType === "Round Trip" && !s) return "Return date is required";
      return "";
    case "name":
      if (!s) return "Full name is required";
      if (s.length < 2) return "Name must be at least 2 characters";
      return "";
    case "phone":
      if (!s) return "Phone number is required";
      if (!/^\d{10}$/.test(s.replace(/\s/g, ""))) return "Enter a valid 10-digit number";
      return "";
    case "email":
      if (!s) return ""; // optional
      if (!/\S+@\S+\.\S+/.test(s)) return "Enter a valid email address";
      return "";
    default:
      return "";
  }
}

/* ── WhatsApp SVG ────────────────────────────────────────────────────────── */
function WaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const tripTypes = ["One Way", "Round Trip", "Multi-City"] as const;
type TripType = (typeof tripTypes)[number];
const cabins = ["Economy", "Premium Economy", "Business", "First Class"] as const;
type Cabin = (typeof cabins)[number];

/* ─────────────────────────────────────────────────────────────────────────── */
export default function FlightsPage() {
  const [tripType,  setTripType]  = useState<TripType>("Round Trip");
  const [from,      setFrom]      = useState("");
  const [to,        setTo]        = useState("");
  const [depart,    setDepart]    = useState("");
  const [returnD,   setReturnD]   = useState("");
  const [adults,    setAdults]    = useState(1);
  const [children,  setChildren]  = useState(0);
  const [infants,   setInfants]   = useState(0);
  const [cabin,     setCabin]     = useState<Cabin>("Economy");
  const [name,      setName]      = useState("");
  const [phone,     setPhone]     = useState("");
  const [email,     setEmail]     = useState("");
  const [notes,     setNotes]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState<Partial<Record<FlightFieldKey, string>>>({});
  const [touched,   setTouched]   = useState<Partial<Record<FlightFieldKey, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const totalPax = adults + children + infants;

  /* ── Field value getter ── */
  const getFieldValue = (k: FlightFieldKey): string => {
    switch (k) {
      case "from": return from;
      case "to": return to;
      case "depart": return depart;
      case "returnD": return returnD;
      case "name": return name;
      case "phone": return phone;
      case "email": return email;
    }
  };

  /* ── onChange helper: clear error if field becomes valid ── */
  const handleFieldChange = (k: FlightFieldKey, v: string) => {
    if (touched[k]) {
      const err = validateFlightField(k, v, tripType);
      setErrors(p => ({ ...p, [k]: err || undefined }));
    }
  };

  /* ── onBlur helper: mark touched + validate ── */
  const handleFieldBlur = (k: FlightFieldKey) => () => {
    setTouched(p => ({ ...p, [k]: true }));
    const err = validateFlightField(k, getFieldValue(k), tripType);
    setErrors(p => ({ ...p, [k]: err || undefined }));
  };

  /* ── Full validate on submit ── */
  const validate = (): boolean => {
    const required: FlightFieldKey[] = ["from", "to", "depart", "name", "phone"];
    if (tripType === "Round Trip") required.push("returnD");
    // Email validated only if entered
    const newErrors: Partial<Record<FlightFieldKey, string>> = {};
    const newTouched: Partial<Record<FlightFieldKey, boolean>> = {};
    required.forEach(k => {
      newTouched[k] = true;
      const err = validateFlightField(k, getFieldValue(k), tripType);
      if (err) newErrors[k] = err;
    });
    // Email format check (optional field)
    if (email.trim()) {
      newTouched.email = true;
      const err = validateFlightField("email", email, tripType);
      if (err) newErrors.email = err;
    }
    setTouched(p => ({ ...p, ...newTouched }));
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErr = formRef.current?.querySelector("[data-has-error='true']");
        firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  const reset = () => {
    setSubmitted(false);
    setFrom(""); setTo(""); setDepart(""); setReturnD("");
    setName(""); setPhone(""); setEmail(""); setNotes("");
    setAdults(1); setChildren(0); setInfants(0);
    setErrors({}); setTouched({});
  };

  /* ── THANK YOU ─────────────────────────────────────────────────────────── */
  if (submitted) {
    const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    const fmtDate = (d: string) => {
      if (!d) return "—";
      const [y, m, day] = d.split("-");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
    };

    return (
      <div
        className="min-h-screen pt-[70px] xs:pt-[72px] sm:pt-[82px] lg:pt-[84px] flex items-center justify-center px-4 py-8 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg,#061E24 0%,#0F4C5C 45%,#1F8C9E 100%)" }}
      >
        {/* Glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse,#67E8F9 0%,transparent 70%)" }} />

        <div className="relative z-10 w-full max-w-[400px] px-5 sm:px-7 py-6 sm:py-8 text-center"
          style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 32px 64px rgba(0,0,0,0.30)" }}>

          {/* Check icon */}
          <div className="relative w-14 h-14 mx-auto mb-3">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#1F8C9E" }} />
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#1F8C9E,#0E6F7F)", boxShadow: "0 6px 20px rgba(31,140,158,0.40)" }}>
              <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.12em] uppercase px-3 py-1 rounded-full mb-3"
            style={{ background: "rgba(31,140,158,0.08)", color: "#1F8C9E", border: "1px solid rgba(31,140,158,0.15)" }}>
            <Sparkles className="w-2.5 h-2.5" /> Enquiry Confirmed
          </span>

          {/* Headline */}
          <h2 className="font-extrabold mb-0.5"
            style={{ fontSize: "clamp(19px,3vw,24px)", color: "#0F172A", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
            You&rsquo;re All Set,{" "}
            <span className="font-serif italic font-normal" style={{ color: "#1F8C9E" }}>{cap(name)}!</span>
          </h2>
          <p className="text-[12px] mb-4" style={{ color: "rgba(100,116,139,0.70)" }}>
            Your enquiry is confirmed — we&rsquo;ll handle the rest.
          </p>

          {/* Flight summary card */}
          <div className="mb-4 rounded-xl overflow-hidden text-left"
            style={{ border: "1.5px solid rgba(31,140,158,0.14)", background: "rgba(31,140,158,0.03)" }}>
            {/* Route row */}
            <div className="px-3.5 py-2.5 flex items-center justify-between gap-2"
              style={{ borderBottom: "1px solid rgba(31,140,158,0.10)" }}>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "rgba(31,140,158,0.55)" }}>From</p>
                <p className="font-extrabold text-slate-800 text-[14px] leading-none">{cap(from)}</p>
              </div>
              <div className="flex flex-col items-center gap-0.5 shrink-0">
                <PlaneTakeoff className="w-3.5 h-3.5" style={{ color: "#1F8C9E" }} />
                <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(31,140,158,0.45)" }}>
                  {tripType === "Round Trip" ? "Round" : tripType === "One Way" ? "One Way" : "Multi"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "rgba(31,140,158,0.55)" }}>To</p>
                <p className="font-extrabold text-slate-800 text-[14px] leading-none">{cap(to)}</p>
              </div>
            </div>
            {/* Details row */}
            <div className="grid grid-cols-3 divide-x text-center py-2"
              style={{ borderColor: "rgba(31,140,158,0.10)" }}>
              <div className="px-1.5">
                <p className="text-[9px] mb-0.5" style={{ color: "rgba(100,116,139,0.6)" }}>Departure</p>
                <p className="text-[11px] font-semibold text-slate-700 leading-tight">{fmtDate(depart)}</p>
              </div>
              <div className="px-1.5">
                <p className="text-[9px] mb-0.5" style={{ color: "rgba(100,116,139,0.6)" }}>Travellers</p>
                <p className="text-[11px] font-semibold text-slate-700 leading-tight">{totalPax} pax</p>
              </div>
              <div className="px-1.5">
                <p className="text-[9px] mb-0.5" style={{ color: "rgba(100,116,139,0.6)" }}>Cabin</p>
                <p className="text-[11px] font-semibold text-slate-700 leading-tight">{cabin}</p>
              </div>
            </div>
          </div>

          {/* Reply promise */}
          <p className="text-slate-500 text-[12px] leading-relaxed mb-4">
            Our expert replies within{" "}
            <span className="font-bold" style={{ color: "#1F8C9E" }}>2 hours</span>
            {phone ? <> on <span className="font-bold text-slate-700">{phone}</span></> : ""}.
          </p>

          {/* Need it faster — inline label + buttons */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex-1 h-px" style={{ background: "#F1F5F9" }} />
            <p className="text-[10px] font-bold uppercase tracking-wider shrink-0" style={{ color: "rgba(100,116,139,0.45)" }}>Need it faster?</p>
            <div className="flex-1 h-px" style={{ background: "#F1F5F9" }} />
          </div>
          <div className="flex gap-2">
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg,#25D366,#18A34A)", boxShadow: "0 3px 12px rgba(37,211,102,0.25)" }}>
              <WaIcon className="w-4 h-4" /> WhatsApp
            </a>
            <a href="tel:+919999999999"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold transition-all active:scale-[0.97]"
              style={{ border: "1.5px solid #E2E8F0", color: "#1E293B", background: "#FAFBFC" }}>
              <Phone className="w-4 h-4" style={{ color: "#1F8C9E" }} /> Call Us
            </a>
          </div>

          {/* Reset */}
          <button onClick={reset}
            className="mt-4 flex items-center gap-1.5 mx-auto text-[11px] text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Submit another enquiry
          </button>
        </div>
      </div>
    );
  }

  /* ── MAIN PAGE ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F6F3" }}>

      {/* ════════════════════════════════════════════════════════════════════
          COMPACT PAGE HEADER
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative pt-16 overflow-hidden"
        style={{ background: "linear-gradient(150deg,#061E24 0%,#0A3D4A 50%,#1F8C9E 100%)" }}
      >
        {/* Subtle dot-grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Soft cyan glow top-right */}
        <div className="absolute -top-10 right-0 w-[500px] h-[260px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(103,232,249,0.10) 0%,transparent 70%)" }} />

        {/* Content — single tight column */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 xs:px-6 pt-4 sm:pt-10 pb-10 sm:pb-20 text-center">

          {/* Tag pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide text-white mb-4 uppercase"
            style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <PlaneTakeoff className="w-3 h-3" />
            Flight Enquiry Desk
          </div>

          {/* Headline — single compact line */}
          <h1 className="mb-3" style={{ letterSpacing: "-0.03em", lineHeight: 1.08 }}>
            <span className="font-extrabold text-white" style={{ fontSize: "clamp(22px,3.5vw,44px)" }}>
              Fly Smarter with{" "}
            </span>
            <span
              className="font-serif italic"
              style={{
                fontSize: "clamp(22px,3.5vw,44px)",
                fontWeight: 400,
                background: "linear-gradient(135deg,#67E8F9 0%,#A5F3FC 60%,#e0fffe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              Best Fares
            </span>
            <span className="font-extrabold text-white" style={{ fontSize: "clamp(22px,3.5vw,44px)" }}>
              {" "}on Every Route
            </span>
          </h1>

          {/* Subtext + stats in one row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0">
            <p className="hidden sm:block text-[13px] sm:pr-6"
              style={{ color: "rgba(255,255,255,0.45)" }}>
              Share your route &amp; dates — we compare all airlines and reply with the best fares in under 2 hours.
            </p>

            <div className="flex items-center justify-center sm:border-l sm:border-white/10">
              {[
                { icon: <Star className="w-3 h-3" />,   val: "4.9",    lbl: "Rating"   },
                { icon: <Clock className="w-3 h-3" />,  val: "<2 hr",  lbl: "Response" },
                { icon: <Shield className="w-3 h-3" />, val: "500+",   lbl: "Happy Flyers" },
              ].map(({ icon, val, lbl }, i) => (
                <div
                  key={lbl}
                  className="flex items-center gap-1.5 px-3 sm:px-4 whitespace-nowrap"
                  style={{
                    borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.12)" : undefined,
                  }}
                >
                  <span className="text-white opacity-50">{icon}</span>
                  <div className="text-left">
                    <span className="font-bold text-white text-[13px]">{val}</span>
                    <span className="text-[11px] ml-1" style={{ color: "rgba(255,255,255,0.38)" }}>{lbl}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FORM AREA — floats up over hero bottom
      ════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[940px] mx-auto px-3 xs:px-4 sm:px-8 -mt-6 sm:-mt-10 pb-10 sm:pb-16">

        {/* ── Single Unified Form Card ───────────────────────────────────── */}
        <div className="bg-white rounded-3xl"
          style={{ border: "1px solid rgba(20,20,20,0.09)", boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}>

          {/* Card header */}
          <div className="px-4 sm:px-7 pt-4 sm:pt-7 pb-3 sm:pb-5" style={{ borderBottom: "1px solid rgba(20,20,20,0.06)" }}>
            <h2 className="font-extrabold mb-1 leading-tight"
              style={{ fontSize: "clamp(18px,2vw,26px)", color: "#343434", letterSpacing: "-0.025em" }}>
              Flight{" "}
              <span style={{ color: "#1F8C9E" }}>Enquiry</span>
            </h2>
            <p className="text-sm" style={{ color: "rgba(52,52,52,0.48)" }}>
              Fill in your trip details — we&rsquo;ll get back with the best fares within 2 hours.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} noValidate className="px-4 sm:px-8 pt-4 sm:pt-6 pb-5 sm:pb-8">

            {/* ── ROUTE ────────────────────────────────────────────────── */}
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3"
                style={{ color: "rgba(52,52,52,0.38)" }}>Route</p>

              {/* FROM / TO row with centred swap pill */}
              <div className="flex flex-col sm:flex-row sm:items-stretch"
                style={{ border: "1.5px solid rgba(20,20,20,0.13)", overflow: "hidden" }}>

                {/* FROM */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(31,140,158,0.10)" }}>
                    <PlaneTakeoff className="w-3.5 h-3.5" style={{ color: "#1F8C9E" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                      style={{ color: "rgba(52,52,52,0.38)" }}>From</p>
                    <input
                      data-has-error={!!errors.from}
                      type="text" placeholder="City or airport…" value={from}
                      onChange={(e) => { setFrom(e.target.value); handleFieldChange("from", e.target.value); }}
                      onBlur={handleFieldBlur("from")}
                      className="w-full bg-transparent text-[14px] font-semibold outline-none placeholder-gray-300"
                      style={{ color: "#343434" }} />
                    {errors.from && (
                      <p className="flex items-center gap-1 mt-0.5 text-[11px]" style={{ color: "#f87171" }}>
                        <AlertCircle className="w-3 h-3 shrink-0" />{errors.from}
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider + Swap — responsive */}
                <div className="relative flex items-center justify-center shrink-0 w-full h-9 sm:w-px sm:h-auto">
                  {/* Horizontal line on mobile */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px sm:hidden"
                    style={{ backgroundColor: "rgba(20,20,20,0.09)" }} />
                  {/* Vertical line on desktop */}
                  <div className="hidden sm:block absolute inset-y-0 left-0 w-px"
                    style={{ backgroundColor: "rgba(20,20,20,0.10)" }} />
                  <button type="button" onClick={() => { setFrom(to); setTo(from); }}
                    className="relative flex items-center justify-center w-7 h-7 rounded-full z-10 transition-all hover:scale-110 active:scale-95"
                    style={{ background: "#fff", border: "1.5px solid rgba(20,20,20,0.14)", color: "#1F8C9E",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}>
                    <ArrowLeftRight className="w-3 h-3" />
                  </button>
                </div>

                {/* TO */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(245,158,11,0.10)" }}>
                    <PlaneLanding className="w-3.5 h-3.5" style={{ color: "#D97706" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                      style={{ color: "rgba(52,52,52,0.38)" }}>To</p>
                    <input
                      data-has-error={!!errors.to}
                      type="text" placeholder="City or airport…" value={to}
                      onChange={(e) => { setTo(e.target.value); handleFieldChange("to", e.target.value); }}
                      onBlur={handleFieldBlur("to")}
                      className="w-full bg-transparent text-[14px] font-semibold outline-none placeholder-gray-300"
                      style={{ color: "#343434" }} />
                    {errors.to && (
                      <p className="flex items-center gap-1 mt-0.5 text-[11px]" style={{ color: "#f87171" }}>
                        <AlertCircle className="w-3 h-3 shrink-0" />{errors.to}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── TRIP DETAILS ─────────────────────────────────────────── */}
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3"
                style={{ color: "rgba(52,52,52,0.38)" }}>Trip Details</p>

              {/* Trip Type — pill segmented control */}
              <div className="inline-flex p-1 mb-3 sm:mb-4 w-full sm:w-auto"
                style={{ backgroundColor: "#F0F0EE" }}>
                {tripTypes.map((t) => (
                  <button key={t} type="button" onClick={() => setTripType(t)}
                    className="flex-1 sm:flex-none px-2 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-semibold transition-all duration-200 whitespace-nowrap"
                    style={tripType === t
                      ? { backgroundColor: "#fff", color: "#343434",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)" }
                      : { color: "rgba(52,52,52,0.55)", backgroundColor: "transparent" }}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative pt-2.5">
                  <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                    style={{ color: "#343434", backgroundColor: "#fff" }}>
                    Departure <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <DateInput
                    value={depart}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(v) => {
                      setDepart(v);
                      handleFieldChange("depart", v);
                      // If new departure is after current return, clear return
                      if (tripType === "Round Trip" && returnD && v && returnD < v) {
                        setReturnD("");
                        handleFieldChange("returnD", "");
                      }
                    }}
                    error={!!errors.depart}
                    placeholder="Select date"
                  />
                  {errors.depart && (
                    <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#f87171" }}>
                      <AlertCircle className="w-3 h-3 shrink-0" />{errors.depart}
                    </p>
                  )}
                </div>
                {tripType === "Round Trip" ? (
                  <div className="relative pt-2.5">
                    <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                      style={{ color: "#343434", backgroundColor: "#fff" }}>
                      Return <span style={{ color: "#f87171" }}>*</span>
                    </label>
                    <DateInput
                      value={returnD}
                      min={depart || new Date().toISOString().split("T")[0]}
                      onChange={(v) => { setReturnD(v); handleFieldChange("returnD", v); }}
                      error={!!errors.returnD}
                      placeholder="Select date"
                    />
                    {errors.returnD && (
                      <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#f87171" }}>
                        <AlertCircle className="w-3 h-3 shrink-0" />{errors.returnD}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="relative pt-2.5">
                    <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                      style={{ color: "#343434", backgroundColor: "#fff" }}>Flexibility</label>
                    <input type="text" placeholder="e.g. ± 2 days"
                      className="w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/20 focus:border-[#1F8C9E] placeholder-gray-300"
                      style={{ border: "1.5px solid rgba(20,20,20,0.14)" }} />
                  </div>
                )}
              </div>
            </div>

            {/* ── PREFERENCES ──────────────────────────────────────────── */}
            <div className="mb-6 rounded-2xl p-4" style={{ backgroundColor: "#F7F6F3" }}>

              {/* Travellers — compact rows */}
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3"
                style={{ color: "rgba(52,52,52,0.38)" }}>Travellers</p>
              <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
                {[
                  { label: "Adults",   sub: "12+",      val: adults,   min: 1, inc: () => setAdults(a  => a  + 1), dec: () => setAdults(a  => Math.max(1, a  - 1)) },
                  { label: "Children", sub: "2–11 yrs", val: children, min: 0, inc: () => setChildren(c => c + 1), dec: () => setChildren(c => Math.max(0, c - 1)) },
                  { label: "Infants",  sub: "Under 2",  val: infants,  min: 0, inc: () => setInfants(i => i  + 1), dec: () => setInfants(i  => Math.max(0, i  - 1)) },
                ].map(({ label, sub, val, min, inc, dec }) => (
                  <div key={label}
                    className="flex-1 flex items-center justify-between gap-3 px-3 py-3 rounded-xl bg-white"
                    style={{ border: "1px solid rgba(20,20,20,0.08)" }}>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold leading-tight" style={{ color: "#343434" }}>{label}</p>
                      <p className="text-[11px] leading-tight mt-0.5" style={{ color: "rgba(52,52,52,0.42)" }}>{sub}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button type="button" onClick={dec} disabled={val <= min}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] font-bold transition-all hover:scale-110 disabled:opacity-30"
                        style={{ backgroundColor: "rgba(31,140,158,0.10)", color: "#1F8C9E" }}>−</button>
                      <span className="text-[15px] font-bold w-4 text-center tabular-nums"
                        style={{ color: "#343434" }}>{val}</span>
                      <button type="button" onClick={inc}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] font-bold transition-all hover:scale-110"
                        style={{ backgroundColor: "rgba(31,140,158,0.10)", color: "#1F8C9E" }}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cabin Class — compact horizontal pills */}
              <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5"
                style={{ color: "rgba(52,52,52,0.38)" }}>Cabin Class</p>
              <div className="flex flex-wrap gap-2">
                {cabins.map((c) => (
                  <button key={c} type="button" onClick={() => setCabin(c)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[12px] font-semibold transition-all duration-150 hover:scale-[1.03] active:scale-[0.97]"
                    style={cabin === c
                      ? { backgroundColor: "#1F8C9E", color: "#fff",
                          boxShadow: "0 2px 10px rgba(31,140,158,0.30)" }
                      : { backgroundColor: "#fff", color: "#343434",
                          border: "1.5px solid rgba(52,52,52,0.15)" }}>
                    {c}
                  </button>
                ))}
              </div>

              {/* Summary chip */}
              <p className="text-[12px] font-medium mt-3" style={{ color: "rgba(52,52,52,0.50)" }}>
                {totalPax} passenger{totalPax !== 1 ? "s" : ""} ·{" "}
                <span className="font-semibold" style={{ color: "#1F8C9E" }}>{cabin}</span>
              </p>
            </div>

            {/* ── CONTACT DETAILS ──────────────────────────────────────── */}
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ color: "rgba(52,52,52,0.38)" }}>Contact Details</p>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div className="relative pt-2.5">
                    <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                      style={{ color: "#343434", backgroundColor: "#fff" }}>
                      Full Name <span style={{ color: "#f87171" }}>*</span>
                    </label>
                    <input
                      data-has-error={!!errors.name}
                      type="text" placeholder="e.g. Rahul Sharma" value={name}
                      onChange={(e) => { setName(e.target.value); handleFieldChange("name", e.target.value); }}
                      onBlur={handleFieldBlur("name")}
                      className="w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/20 focus:border-[#1F8C9E] placeholder-gray-300"
                      style={{ border: errors.name ? "1.5px solid #f87171" : "1.5px solid rgba(20,20,20,0.14)" }} />
                    {errors.name && (
                      <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#f87171" }}>
                        <AlertCircle className="w-3 h-3 shrink-0" />{errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="relative pt-2.5">
                    <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                      style={{ color: "#343434", backgroundColor: "#fff" }}>
                      Phone Number <span style={{ color: "#f87171" }}>*</span>
                    </label>
                    <div
                      data-has-error={!!errors.phone}
                      className="flex overflow-hidden"
                      style={{ border: errors.phone ? "1.5px solid #f87171" : "1.5px solid rgba(20,20,20,0.14)" }}>
                      <span className="flex items-center px-3 text-[13px] font-semibold shrink-0 select-none"
                        style={{
                          backgroundColor: errors.phone ? "rgba(248,113,113,0.06)" : "rgba(31,140,158,0.06)",
                          borderRight: `1.5px solid ${errors.phone ? "rgba(248,113,113,0.3)" : "rgba(20,20,20,0.10)"}`,
                          color: errors.phone ? "#f87171" : "#343434",
                        }}>
                        +91
                      </span>
                      <input
                        type="tel" inputMode="numeric" pattern="[0-9]*"
                        placeholder="10-digit number" maxLength={10} value={phone}
                        onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 10); setPhone(v); handleFieldChange("phone", v); }}
                        onKeyDown={(e) => { if (["e","E","+","-",".",",", " "].includes(e.key)) e.preventDefault(); }}
                        onBlur={handleFieldBlur("phone")}
                        className="flex-1 px-3 py-3.5 text-[13px] bg-white outline-none placeholder-gray-300" />
                    </div>
                    {errors.phone && (
                      <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#f87171" }}>
                        <AlertCircle className="w-3 h-3 shrink-0" />{errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="relative pt-2.5">
                  <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                    style={{ color: errors.email ? "#f87171" : "#343434", backgroundColor: "#fff" }}>
                    Email <span className="font-normal" style={{ color: "rgba(52,52,52,0.45)" }}>(optional)</span>
                  </label>
                  <input
                    data-has-error={!!errors.email}
                    type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); handleFieldChange("email", e.target.value); }}
                    onBlur={handleFieldBlur("email")}
                    className="w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/20 focus:border-[#1F8C9E] placeholder-gray-300"
                    style={{ border: errors.email ? "1.5px solid #f87171" : "1.5px solid rgba(20,20,20,0.14)" }} />
                  {errors.email && (
                    <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#f87171" }}>
                      <AlertCircle className="w-3 h-3 shrink-0" />{errors.email}
                    </p>
                  )}
                </div>

                {/* Special Requests */}
                <div className="relative pt-2.5">
                  <label className="absolute top-0 left-3.5 text-[13px] font-semibold px-1 z-10"
                    style={{ color: "#343434", backgroundColor: "#fff" }}>
                    Special Requests <span className="font-normal" style={{ color: "rgba(52,52,52,0.45)" }}>(optional)</span>
                  </label>
                  <input type="text" placeholder="e.g. window seat, veg meal" value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3.5 text-[13px] bg-white outline-none transition-all focus:ring-2 focus:ring-[#1F8C9E]/20 focus:border-[#1F8C9E] placeholder-gray-300"
                    style={{ border: "1.5px solid rgba(20,20,20,0.14)" }} />
                </div>
              </div>
            </div>

            {/* ── Submit ───────────────────────────────────────────────── */}
            <div className="mt-2">

              {/* Primary CTA */}
              <button
                type="submit" disabled={loading}
                className="w-full sm:w-auto sm:mx-auto flex items-center justify-center gap-2.5 font-bold py-3.5 sm:py-4 px-6 sm:px-10 rounded-full text-[14px] sm:text-[15px] transition-all hover:brightness-105 active:scale-[0.99] disabled:opacity-60 overflow-hidden relative"
                style={{ background: "linear-gradient(135deg,#1F8C9E 0%,#0E6F7F 100%)", color: "#fff",
                  boxShadow: "0 4px 20px rgba(31,140,158,0.35)" }}
              >
                {/* Shimmer sheen */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.18) 0%,transparent 65%)" }} />
                <span className="relative flex items-center gap-2.5">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending Enquiry…
                    </>
                  ) : (
                    <><Send className="w-4 h-4" />Submit Flight Enquiry</>
                  )}
                </span>
              </button>



            </div>

          </form>

        </div>
        {/* ── End Unified Form Card ───────────────────────────────────── */}

        {/* ── Reach Us Directly — standalone section ───────────────────── */}
        <div className="mt-5 sm:mt-8 mb-3 sm:mb-4">

          {/* Section label */}
          <div className="text-center mb-5">
            <p className="text-[13px] font-semibold" style={{ color: "rgba(52,52,52,0.45)" }}>
              Prefer to talk? Reach us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* WhatsApp */}
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
              className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg,#25D366 0%,#128C5E 100%)",
                boxShadow: "0 4px 20px rgba(37,211,102,0.28)" }}>
              {/* Sheen */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 30% 0%,rgba(255,255,255,0.22) 0%,transparent 60%)" }} />
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.20)" }}>
                <WaIcon className="w-5 h-5 text-white" />
              </div>
              <div className="relative flex-1 min-w-0">
                <p className="text-[14px] font-extrabold text-white leading-none">Chat on WhatsApp</p>
                <p className="text-[11px] mt-1 leading-none font-medium" style={{ color: "rgba(255,255,255,0.70)" }}>
                  Typically replies in minutes
                </p>
              </div>
              <CheckCircle2 className="relative w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.50)" }} />
            </a>

            {/* Call */}
            <a href="tel:+919999999999"
              className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] bg-white"
              style={{ border: "1.5px solid rgba(20,20,20,0.11)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 30% 0%,rgba(31,140,158,0.07) 0%,transparent 65%)" }} />
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                style={{ backgroundColor: "rgba(31,140,158,0.12)" }}>
                <Phone className="w-4 h-4" style={{ color: "#1F8C9E" }} />
              </div>
              <div className="relative flex-1 min-w-0">
                <p className="text-[14px] font-extrabold leading-none" style={{ color: "#343434" }}>Call Us</p>
                <p className="text-[11px] mt-1 leading-none font-medium truncate" style={{ color: "rgba(52,52,52,0.48)" }}>
                  +91 99999 99999 · Mon–Sat
                </p>
              </div>
              <CheckCircle2 className="relative w-4 h-4 shrink-0" style={{ color: "rgba(31,140,158,0.35)" }} />
            </a>

          </div>
        </div>
        {/* ── End Reach Us ─────────────────────────────────────────────── */}

      </div>
      {/* ── End Form Area ─────────────────────────────────────────────────── */}

    </div>
  );
}
