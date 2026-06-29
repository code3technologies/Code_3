"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const aboutStats = [
  { value: "13+", label: "Years in Business" },
  { value: "200+", label: "Happy Clients" },
  { value: "30+", label: "Certified Engineers" },
  { value: "24/7", label: "Support Availability" },
];

export default function AboutStrip() {
  return (
    <section className="bg-[#0D1B2A] py-20">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — text */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-5 h-0.5 bg-red-400 rounded-full" />
            <span className="text-xs font-bold tracking-widest uppercase text-red-400">
              About CODE3
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight mb-5">
            Dubai Silicon Oasis'{" "}
            <span className="text-red-400">most trusted</span> technology
            partner
          </h2>
          <p className="text-white/65 text-base leading-loose mb-4">
            Located in Dubai Silicon Oasis, CODE3 Technologies has spent over a
            decade helping UAE businesses build secure, scalable, and
            future-ready technology environments. From IT infrastructure to
            digital transformation, we deliver end-to-end solutions under one
            trusted partner.
          </p>
          <p className="text-white/65 text-base leading-loose mb-8">
            Our certified engineers and partnerships with 50+ global technology
            vendors ensure every solution meets international standards — with
            the personalised service of a local team.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about-us"
              className="inline-flex items-center gap-2 bg-[#C0272D] hover:bg-[#9B1E23] text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              About Us <ArrowRight size={15} />
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Meet the Team
            </Link>
          </div>
        </div>

        {/* Right — stat cards */}
        <div className="grid grid-cols-2 gap-3">
          {aboutStats.map(({ value, label }) => (
            <div
              key={label}
              className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl font-bold text-white mb-1.5">{value}</div>
              <div className="text-sm text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
