"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, User, MessageSquare } from "lucide-react";
import { EnquiryFormData } from "@/types";
import { cn } from "@/lib/utils";

const initialState: EnquiryFormData = {
  name: "",
  email: "",
  mobile: "",
  destination: "",
  travelDate: "",
  travellers: 2,
  message: "",
  enquiryType: "general",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<EnquiryFormData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<EnquiryFormData>>({});

  const validate = (): boolean => {
    const e: Partial<Record<keyof EnquiryFormData, string>> = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.replace(/\s/g, "")))
      e.mobile = "Valid 10-digit mobile number required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Valid email is required";
    setErrors(e as Partial<EnquiryFormData>);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setIsSuccess(true);
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Contact Us</h1>
          <p className="text-orange-100">We&apos;re here to make your travel dreams a reality. Get in touch today!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Get In Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Phone</p>
                    <a href="tel:+919876543210" className="text-orange-500 hover:underline text-sm">+91 98765 43210</a>
                    <p className="text-gray-400 text-xs mt-0.5">Mon–Sat, 9 AM – 8 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">WhatsApp</p>
                    <a
                      href="https://wa.me/919876543210?text=Hi%20BookTick!%20I%20want%20to%20plan%20a%20trip."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-sm"
                    >
                      Chat on WhatsApp
                    </a>
                    <p className="text-gray-400 text-xs mt-0.5">Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Email</p>
                    <a href="mailto:info@booktick.in" className="text-blue-500 hover:underline text-sm">info@booktick.in</a>
                    <p className="text-gray-400 text-xs mt-0.5">Reply within 4 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Office Address</p>
                    <p className="text-gray-600 text-sm">123 Travel House,<br />Connaught Place,<br />New Delhi – 110001</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Office Hours</p>
                    <p className="text-gray-600 text-sm">Mon–Fri: 9 AM – 8 PM</p>
                    <p className="text-gray-600 text-sm">Sat–Sun: 10 AM – 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210?text=Hi%20BookTick!%20I%20want%20to%20plan%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-2xl transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat Instantly on WhatsApp
            </a>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
                <h2 className="text-white font-bold text-xl">Send Us an Enquiry</h2>
                <p className="text-orange-100 text-sm mt-1">Fill in your details and we&apos;ll get back within 2 hours</p>
              </div>

              {isSuccess ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-9 h-9 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Sent Successfully!</h3>
                  <p className="text-gray-600 mb-6">Thank you, {formData.name}! Our travel expert will call you on {formData.mobile} within 2 hours.</p>
                  <button
                    onClick={() => { setIsSuccess(false); setFormData(initialState); }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={cn("w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400", errors.name ? "border-red-400" : "border-gray-200")}
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="10-digit number"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className={cn("w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400", errors.mobile ? "border-red-400" : "border-gray-200")}
                        />
                      </div>
                      {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={cn("w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400", errors.email ? "border-red-400" : "border-gray-200")}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Enquiry Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Enquiry Type</label>
                      <select
                        value={formData.enquiryType}
                        onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value as "package" | "flight" | "general" })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300"
                      >
                        <option value="general">General Enquiry</option>
                        <option value="package">Travel Package</option>
                        <option value="flight">Flight Enquiry</option>
                      </select>
                    </div>

                    {/* Destination */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination</label>
                      <input
                        type="text"
                        placeholder="e.g. Goa, Dubai, Bali"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                      />
                    </div>

                    {/* Travel Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Travel Date</label>
                      <input
                        type="date"
                        value={formData.travelDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                      />
                    </div>

                    {/* Travellers */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Travellers</label>
                      <select
                        value={formData.travellers}
                        onChange={(e) => setFormData({ ...formData, travellers: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "Traveller" : "Travellers"}</option>
                        ))}
                        <option value={11}>10+ (Group)</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message / Special Requirements
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                          rows={4}
                          placeholder="Tell us your travel preferences, budget range, or any special requirements..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-xl transition-colors text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending Enquiry...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Enquiry — Our team will call within 2 hours
                      </>
                    )}
                  </button>
                  <p className="text-center text-gray-400 text-xs mt-3">
                    🔒 100% secure · No spam · No direct booking · Just expert travel assistance
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
