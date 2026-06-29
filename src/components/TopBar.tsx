"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-[#0D1B2A] text-white/70 text-sm py-2 hidden md:block">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-3">
        {/* Left */}
        <div className="flex items-center gap-6">
          <a
            href="tel:+97150504254"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Phone size={13} className="opacity-70" />
            +971 50 504 2547
          </a>
          <a
            href="mailto:info@code3.ae"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Mail size={13} className="opacity-70" />
            info@code3.ae
          </a>
          <span className="flex items-center gap-2">
            <MapPin size={13} className="opacity-70" />
            Dubai Silicon Oasis, UAE
          </span>
        </div>
        {/* Right */}
        <div className="flex items-center gap-2">
          <Clock size={13} className="opacity-70" />
          <span>Mon–Fri: 9:00 AM – 6:00 PM</span>
        </div>
      </div>
    </div>
  );
}
