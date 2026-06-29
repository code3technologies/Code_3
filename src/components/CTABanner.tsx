"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative bg-gradient-to-r from-[#9B1E23] via-[#C0272D] to-[#e8434a] py-20 text-white text-center overflow-hidden">
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-3xl mx-auto px-6 relative">
        <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight mb-4">
          Ready to transform your business with technology?
        </h2>
        <p className="text-white/80 text-lg mb-10">
          Partner with CODE3 to build a secure, scalable, and future-ready
          technology environment. Our experts are ready to help — no obligation.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#C0272D] px-7 py-3.5 rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Get a Free Consultation <ArrowRight size={16} />
          </Link>
          <a
            href="tel:+97150504254"
            className="inline-flex items-center gap-2 bg-transparent border-2 border-white/40 hover:border-white hover:bg-white/10 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
          >
            <Phone size={16} />
            Call +971 50 504 2547
          </a>
        </div>
      </div>
    </section>
  );
}
