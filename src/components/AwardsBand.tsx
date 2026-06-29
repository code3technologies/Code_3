"use client";

import { Award, Shield, Star, Building2, CheckCircle } from "lucide-react";

const awards = [
  { icon: Award, title: "Microsoft Partner", year: "Certified 2024" },
  { icon: Shield, title: "Cisco Certified", year: "Select Partner" },
  { icon: Star, title: "Fortinet Partner", year: "Authorised Reseller" },
  { icon: Building2, title: "Dubai Silicon Oasis", year: "Licensed Entity" },
  { icon: CheckCircle, title: "ISO Compliant", year: "Quality Assured" },
];

export default function AwardsBand() {
  return (
    <div className="bg-gray-50 border-y border-gray-100 py-14">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-300 mr-2 whitespace-nowrap">
          Certifications &amp; Partnerships
        </span>
        {awards.map(({ icon: Icon, title, year }) => (
          <div
            key={title}
            className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-5 py-3.5 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon size={17} className="text-[#C0272D]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0D1B2A]">{title}</div>
              <div className="text-xs text-gray-400 mt-0.5">{year}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
