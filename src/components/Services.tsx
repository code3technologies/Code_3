"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Monitor, Shield, Cloud, Network,
  Video, Globe, Search, BarChart2, LayoutGrid, ArrowRight,
} from "lucide-react";

const infraServices = [
  {
    icon: Monitor,
    title: "IT AMC Services",
    desc: "Proactive monitoring, preventive maintenance, and rapid support to keep your IT always available and secure.",
    href: "/services/it-amc",
  },
  {
    icon: Shield,
    title: "Cybersecurity Solutions",
    desc: "Multi-layered enterprise-grade security to protect your data, people, and business from evolving cyber threats.",
    href: "/services/cybersecurity",
  },
  {
    icon: Cloud,
    title: "Managed IT & Cloud",
    desc: "Migrate, collaborate, and operate smarter with scalable cloud services ensuring cost efficiency and continuity.",
    href: "/services/managed-it-cloud",
  },
  {
    icon: Network,
    title: "ICT & ELV Solutions",
    desc: "Smart surveillance, structured cabling, and future-ready network infrastructure for scalable business growth.",
    href: "/services/ict-elv",
  },
  {
    icon: Video,
    title: "Audio Visual (AV) Solutions",
    desc: "Seamless AV setups for hybrid workplaces — conferencing, presentations, and smart room automation.",
    href: "/services/audio-visual",
  },
  {
    icon: Globe,
    title: "Network Solutions",
    desc: "Wi-Fi, switching, routing, VPN — reliable and secure network infrastructure tailored to your environment.",
    href: "/services/network",
  },
];

const digitalServices = [
  {
    icon: Monitor,
    title: "Website Development",
    desc: "Custom, high-performance websites and web apps designed to convert visitors into customers.",
    href: "/services/website-development",
  },
  {
    icon: Search,
    title: "SEO & Digital Marketing",
    desc: "Targeted digital marketing strategies that grow your online visibility and drive qualified leads.",
    href: "/services/seo-digital-marketing",
  },
  {
    icon: BarChart2,
    title: "Business Analytics",
    desc: "Transform raw data into actionable insights that support smarter business decision-making.",
    href: "/services/analytics",
  },
  {
    icon: LayoutGrid,
    title: "ERP & CRM Solutions",
    desc: "Streamline operations, manage relationships, and improve efficiency with tailored ERP and CRM systems.",
    href: "/services/erp-crm",
  },
];

type Tab = "infra" | "digital";

function ServiceCard({
  icon: Icon,
  title,
  desc,
  href,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden flex flex-col"
    >
      {/* Top accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C0272D] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-red-100 transition-colors">
        <Icon size={20} className="text-[#C0272D]" />
      </div>

      <h3 className="text-base font-bold text-[#0D1B2A] mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{desc}</p>

      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C0272D] group-hover:gap-3 transition-all duration-200">
        Learn more <ArrowRight size={14} />
      </span>
    </Link>
  );
}

export default function Services() {
  const [activeTab, setActiveTab] = useState<Tab>("infra");
  const services = activeTab === "infra" ? infraServices : digitalServices;

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#C0272D]">
              Our Services
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D1B2A] leading-tight tracking-tight mb-3">
            Your technology partner in every step
          </h2>
          <p className="text-gray-500 text-base leading-relaxed max-w-xl mb-8">
            Whether you need a secure IT backbone or a strong digital presence,
            we deliver complete technology solutions under one trusted roof.
          </p>

          {/* Tabs */}
          <div className="flex gap-2">
            {(["infra", "digital"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                  activeTab === tab
                    ? "bg-[#0D1B2A] text-white border-[#0D1B2A]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#0D1B2A] hover:text-[#0D1B2A]"
                }`}
              >
                {tab === "infra" ? "Infra Services" : "Digital Services"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc) => (
            <ServiceCard key={svc.title} {...svc} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border-2 border-[#C0272D] text-[#C0272D] font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
