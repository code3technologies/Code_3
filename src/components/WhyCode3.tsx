"use client";

import { Users, CheckCircle2, Zap, Star } from "lucide-react";
import { Check } from "lucide-react";

const checkpoints = [
  "Certified engineers with hands-on expertise in leading technologies",
  "End-to-end solutions from infrastructure to digital services",
  "Proactive monitoring with under 2-hour response guarantee",
  "Scalable solutions for SMBs and large enterprises alike",
  "50+ global technology partnerships and vendor certifications",
];

const whyPoints = [
  {
    icon: Users,
    title: "Certified Expertise",
    desc: "Our engineers hold industry certifications from Microsoft, Cisco, Fortinet, and more &mdash; delivering globally-standardised solutions locally.",
  },
  {
    icon: CheckCircle2,
    title: "End-to-End Delivery",
    desc: "From consultation to deployment and ongoing support &mdash; one partner, one point of contact for your entire technology environment.",
  },
  {
    icon: Zap,
    title: "Rapid Response",
    desc: "Proactive monitoring and preventive maintenance minimize downtime, keeping your business running uninterrupted.",
  },
];

export default function WhyCode3() {
  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left &mdash; dark card */}
        <div className="relative">
          <div className="bg-[#0D1B2A] rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6">Why businesses choose CODE3</h3>
            <div className="flex flex-col gap-4">
              {checkpoints.map((point) => (
                <div key={point} className="flex items-start gap-3 text-sm text-white/75">
                  <div className="w-5 h-5 rounded-full bg-red-900/40 border border-red-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={11} className="text-red-300" />
                  </div>
                  {point}
                </div>
              ))}
            </div>
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-5 -right-5 bg-white rounded-xl shadow-xl px-5 py-4 min-w-[170px]">
            <div className="text-3xl font-bold text-[#C0272D]">99.9%</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">Client satisfaction rate</div>
          </div>
        </div>

        {/* Right &mdash; text + points */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#C0272D]">
              Why Choose CODE3
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D1B2A] leading-tight tracking-tight mb-3">
            Technology partnership built for the long run
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-10">
            We combine technical expertise, proactive support, and
            industry-leading partnerships to deliver solutions that don&apos;t just
            work today &mdash; they scale with you.
          </p>

          <div className="flex flex-col gap-7">
            {whyPoints.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-5">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-[#C0272D]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0D1B2A] mb-1.5">{title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
