"use client";

import { Search, FileText, Code2, HeartHandshake } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Assess & Consult",
    desc: "We understand your objectives, infrastructure, and technology requirements in depth.",
  },
  {
    step: "02",
    icon: FileText,
    title: "Design & Plan",
    desc: "Custom solutions designed to your goals, scalability requirements, and budget.",
  },
  {
    step: "03",
    icon: Code2,
    title: "Implement & Deploy",
    desc: "Certified engineers deploy solutions with minimal disruption to operations.",
  },
  {
    step: "04",
    icon: HeartHandshake,
    title: "Support & Optimise",
    desc: "Proactive monitoring and continuous optimisation keep your environment future-ready.",
  },
];

export default function Process() {
  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#C0272D]">
              Our Process
            </span>
            <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D1B2A] leading-tight tracking-tight mb-3">
            A proven approach to technology excellence
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            From initial consultation to ongoing support — every project follows
            a structured, transparent delivery process.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Connector line (desktop only) */}
          <div className="absolute hidden lg:block top-9 left-[15%] right-[15%] h-px border-t-2 border-dashed border-[#C0272D]/30 z-0" />

          {steps.map(({ step, icon: Icon, title, desc }) => (
            <div key={title} className="relative z-10 text-center group">
              <div className="w-[72px] h-[72px] rounded-full bg-white border-2 border-gray-100 group-hover:border-[#C0272D] group-hover:bg-red-50 transition-all duration-200 flex flex-col items-center justify-center mx-auto mb-5">
                <span className="text-[10px] font-bold text-[#C0272D] uppercase tracking-widest leading-none">
                  {step}
                </span>
                <Icon size={18} className="text-[#C0272D] mt-1" />
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
