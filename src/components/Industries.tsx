"use client";

import { Home, Briefcase, GraduationCap, ShoppingBag } from "lucide-react";

const industries = [
  {
    icon: Home,
    title: "SMBs",
    desc: "Cost-effective, scalable tech solutions that grow with your business.",
  },
  {
    icon: Briefcase,
    title: "Enterprise",
    desc: "Enterprise-grade IT infrastructure built for resilience and scale.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    desc: "Robust networks and AV solutions enabling modern digital learning.",
  },
  {
    icon: ShoppingBag,
    title: "Retail & Hospitality",
    desc: "Reliable networks, surveillance, and AV for exceptional customer experience.",
  },
];

export default function Industries() {
  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#C0272D]">
              Industries We Serve
            </span>
            <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D1B2A] leading-tight tracking-tight mb-3">
            Technology solutions for every industry
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            We understand that every sector has unique challenges. Our solutions
            are tailored for your industry's specific operational needs.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industries.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group bg-white border border-gray-100 rounded-2xl p-7 text-center hover:border-[#C0272D] hover:shadow-lg hover:shadow-red-50 transition-all duration-200 cursor-pointer"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-[#C0272D] transition-colors duration-200">
                <Icon
                  size={26}
                  className="text-[#C0272D] group-hover:text-white transition-colors duration-200"
                />
              </div>
              <h3 className="text-base font-bold text-[#0D1B2A] mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
