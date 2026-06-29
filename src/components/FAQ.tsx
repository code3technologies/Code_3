"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

const faqs = [
  {
    q: "What services does CODE3 provide?",
    a: "CODE3 offers Managed IT Services, Cybersecurity Solutions, ICT & ELV Solutions, Audio Visual (AV) Solutions, Cloud Services, and Digital Services to help businesses grow efficiently.",
  },
  {
    q: "Do you provide services across the UAE?",
    a: "Yes. We serve clients across Dubai, Abu Dhabi, Sharjah, and the wider UAE. Our team provides on-site and remote IT support depending on your needs.",
  },
  {
    q: "Can your solutions be customised for our business?",
    a: "Absolutely. Every solution we deliver is tailored to your business goals, infrastructure, budget, and growth plans. We start with a thorough assessment before any proposal.",
  },
  {
    q: "Do you provide ongoing support and maintenance?",
    a: "Yes. Through our IT AMC and managed services, we provide 24/7 monitoring, preventive maintenance, and on-call support to keep your technology running without interruption.",
  },
  {
    q: "Which industries do you serve?",
    a: "We work with SMBs, enterprise organisations, education institutions, healthcare providers, retail, and hospitality businesses across the UAE.",
  },
  {
    q: "How do we get started with CODE3?",
    a: "Simply reach out via our contact form, call us at +971 50 504 2547, or email info@code3.ae. We'll schedule a free consultation and get back to you within 24 hours.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#C0272D]">
              FAQs
            </span>
            <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D1B2A] leading-tight tracking-tight mb-2">
            Frequently asked questions
          </h2>
          <p className="text-gray-500 text-base">
            Quick answers about our IT infrastructure, cybersecurity, AV, and digital solutions.
          </p>
        </div>

        {/* Accordion grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className={`border rounded-xl overflow-hidden transition-colors ${
                open === i ? "border-[#C0272D]" : "border-gray-100 hover:border-gray-300"
              } bg-white`}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold text-[#0D1B2A]">{q}</span>
                <div className="flex-shrink-0 text-gray-400">
                  {open === i ? (
                    <X size={18} className="text-[#C0272D]" />
                  ) : (
                    <Plus size={18} />
                  )}
                </div>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
