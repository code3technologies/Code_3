"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Monitor,
  Shield,
  Cloud,
  Network,
  Video,
  Globe,
  Search,
  BarChart2,
  LayoutGrid,
  ChevronDown,
  Phone,
  Menu,
  X,
} from "lucide-react";

const infraServices = [
  { icon: Monitor, title: "IT AMC Services", desc: "Proactive maintenance & support" },
  { icon: Shield, title: "Cybersecurity", desc: "Multi-layer threat protection" },
  { icon: Cloud, title: "Managed IT & Cloud", desc: "Scalable cloud infrastructure" },
  { icon: Network, title: "ICT & ELV Solutions", desc: "Smart infrastructure systems" },
  { icon: Video, title: "Audio Visual (AV)", desc: "Conference & display systems" },
  { icon: Globe, title: "Network Solutions", desc: "Structured cabling & Wi-Fi" },
];

const digitalServices = [
  { icon: Monitor, title: "Website Development", desc: "Custom web & mobile solutions" },
  { icon: Search, title: "SEO & Digital Marketing", desc: "Grow your online presence" },
  { icon: BarChart2, title: "Business Analytics", desc: "Data-driven decision making" },
  { icon: LayoutGrid, title: "ERP & CRM Solutions", desc: "Streamline business operations" },
];

function MegaMenu({ items }: { items: typeof infraServices }) {
  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 min-w-[520px] z-50">
      <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-4">
        Services
      </p>
      <div className="grid grid-cols-2 gap-1">
        {items.map(({ icon: Icon, title, desc }) => (
          <Link
            key={title}
            href="#"
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
              <Icon size={16} className="text-[#C0272D]" />
            </div>
            <div>
              <div className="text-sm font-600 text-[#0D1B2A] font-semibold">{title}</div>
              <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "Infra Services", menu: "infra" },
    { label: "Digital Services", menu: "digital" },
    { label: "Industries", href: "/industries" },
    { label: "About Us", href: "/about-us" },
    { label: "Careers", href: "/careers" },
    { label: "Blogs", href: "/blogs" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40" ref={navRef}>
      <div className="max-w-6xl mx-auto px-6 flex items-center h-[68px] gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mr-8 flex-shrink-0">
          <div className="w-9 h-9 bg-[#C0272D] rounded-lg flex items-center justify-center text-white font-bold text-sm tracking-tight">
            C3
          </div>
          <span className="text-[#0D1B2A] font-bold text-xl tracking-tight font-sans">
            CODE3
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <li key={link.label} className="relative">
              {link.menu ? (
                <button
                  onMouseEnter={() => setActiveMenu(link.menu!)}
                  onMouseLeave={() => setActiveMenu(null)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-[#0D1B2A] transition-colors"
                >
                  {link.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      activeMenu === link.menu ? "rotate-180" : ""
                    }`}
                  />
                  {activeMenu === link.menu && (
                    <div
                      onMouseEnter={() => setActiveMenu(link.menu!)}
                      onMouseLeave={() => setActiveMenu(null)}
                    >
                      <MegaMenu
                        items={link.menu === "infra" ? infraServices : digitalServices}
                      />
                    </div>
                  )}
                </button>
              ) : (
                <Link
                  href={link.href!}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-[#0D1B2A] transition-colors"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-3 ml-auto">
          <a
            href="tel:+97150504254"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#0D1B2A] hover:text-[#0D1B2A] transition-colors"
          >
            <Phone size={14} />
            Call Us
          </a>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg bg-[#C0272D] text-white text-sm font-semibold hover:bg-[#9B1E23] transition-colors"
          >
            Get Free Consultation
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden ml-auto p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href ?? "#"}
              className="py-3 px-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#0D1B2A] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
            <a
              href="tel:+97150504254"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600"
            >
              <Phone size={14} /> Call Us
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center py-2.5 rounded-lg bg-[#C0272D] text-white text-sm font-semibold"
            >
              Get Free Consultation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
