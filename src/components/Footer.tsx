"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Linkedin, Facebook, Twitter, Youtube } from "lucide-react";

const quickLinks = ["Home", "About Us", "Infra Services", "Digital Services", "Careers", "Blogs"];
const services = [
  "IT AMC Services", "Cybersecurity", "Managed IT & Cloud",
  "ICT & ELV Solutions", "AV Solutions", "Network Solutions",
];

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] text-white pt-16 pb-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#C0272D] rounded-lg flex items-center justify-center text-white font-bold text-sm tracking-tight">
                C3
              </div>
              <span className="text-white font-bold text-xl tracking-tight">CODE3</span>
            </Link>
            <p className="text-sm text-white/50 leading-loose mb-6">
              CODE3 Technologies delivers end-to-end IT Infrastructure,
              Cybersecurity, Audio Visual, and Digital Solutions that help UAE
              businesses operate securely, efficiently, and grow confidently.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Linkedin, href: "#" },
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white/35 mb-5">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((label) => (
                <li key={label}>
                  <Link
                    href="#"
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white/35 mb-5">
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map((label) => (
                <li key={label}>
                  <Link
                    href="#"
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white/35 mb-5">
              Contact Us
            </h4>
            <div className="flex flex-col gap-4">
              {[
                { Icon: Phone, text: "+971 50 504 2547", href: "tel:+97150504254" },
                { Icon: Mail, text: "info@code3.ae", href: "mailto:info@code3.ae" },
                { Icon: MapPin, text: "Building A1, Dubai Silicon Oasis, P.O. Box 342001, Dubai, UAE", href: "#" },
                { Icon: Clock, text: "Mon–Fri: 9:00 AM – 6:00 PM", href: null },
              ].map(({ Icon, text, href }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon size={15} className="text-white/40 flex-shrink-0 mt-0.5" />
                  {href ? (
                    <a href={href} className="text-sm text-white/55 hover:text-white transition-colors leading-relaxed">
                      {text}
                    </a>
                  ) : (
                    <span className="text-sm text-white/55 leading-relaxed">{text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.07] py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/35">
          <span>© 2026 CODE3 Technologies FZCO. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
