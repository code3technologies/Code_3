"use client";

import Link from "next/link";
import { ArrowRight, Play, Shield, Cloud, Video } from "lucide-react";

const heroCards = [
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    desc: "Multi-layered cybersecurity protecting your data, people, and business continuity around the clock.",
    stats: [
      { value: "99.9%", label: "Uptime SLA" },
      { value: "<2h", label: "Response" },
      { value: "24/7", label: "Monitoring" },
    ],
    wide: true,
  },
  {
    icon: Cloud,
    title: "Managed IT & Cloud",
    desc: "Scalable infrastructure designed to grow with your business.",
    wide: false,
  },
  {
    icon: Video,
    title: "AV Solutions",
    desc: "Smart conferencing and display systems for modern workplaces.",
    wide: false,
  },
];

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#0D1B2A] via-[#1A2E44] to-[#1e3a5f] text-white py-20 lg:py-24 overflow-hidden relative">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-700/40 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-red-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
              UAE's Trusted IT Partner
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-[1.12] tracking-tight mb-5">
              IT Infrastructure,{" "}
              <span className="text-red-400">Cybersecurity</span> &amp; Digital
              Growth
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-9 max-w-lg">
              From secure IT backbones to powerful digital presence — CODE3
              delivers end-to-end technology solutions that help UAE businesses
              run smarter and grow faster.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#C0272D] hover:bg-[#9B1E23] text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
              >
                Get a Free Consultation
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
              >
                <Play size={15} />
                Explore Our Services
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
              <div className="flex">
                {["IT", "AV", "CX", "+"].map((label, i) => (
                  <div
                    key={label}
                    className="w-8 h-8 rounded-full border-2 border-[#0D1B2A] flex items-center justify-center text-[10px] font-bold text-white -ml-2 first:ml-0"
                    style={{
                      background: ["#2d6a9f", "#1e7e5a", "#8b3a62", "#C0272D"][i],
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60">
                <strong className="text-white">200+ businesses</strong> across
                the UAE trust CODE3
              </p>
            </div>
          </div>

          {/* Right — cards */}
          <div className="grid grid-cols-2 gap-3">
            {heroCards.map(({ icon: Icon, title, desc, stats, wide }) => (
              <div
                key={title}
                className={`bg-white/[0.06] border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors ${
                  wide ? "col-span-2" : ""
                }`}
              >
                <div className="w-10 h-10 bg-red-900/40 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={18} className="text-red-300" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  {title}
                </h3>
                <p className="text-xs text-white/55 leading-relaxed">{desc}</p>
                {stats && (
                  <div className="flex gap-2 mt-4">
                    {stats.map(({ value, label }) => (
                      <div
                        key={label}
                        className="flex-1 bg-white/[0.08] rounded-xl p-3 text-center"
                      >
                        <div className="text-lg font-bold text-white">
                          {value}
                        </div>
                        <div className="text-[10px] text-white/50 mt-0.5">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
