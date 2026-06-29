"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    category: "Cybersecurity",
    date: "June 20, 2026",
    readTime: "5 min read",
    title: "Top 5 Cybersecurity Threats Facing UAE Businesses in 2026",
    excerpt:
      "Ransomware, phishing, and supply chain attacks are on the rise. Here&apos;s how to stay ahead with layered defences.",
    color: "from-[#1A2E44] to-[#0D1B2A]",
    href: "/blogs/cybersecurity-threats-2026",
  },
  {
    category: "Cloud",
    date: "June 10, 2026",
    readTime: "4 min read",
    title: "Why UAE SMBs Are Moving to Managed Cloud in 2026",
    excerpt:
      "The benefits of cloud migration go beyond cost &mdash; flexibility, security, and compliance are reshaping how businesses operate.",
    color: "from-[#0f6e56] to-[#1d9e75]",
    href: "/blogs/managed-cloud-uae-smb",
  },
  {
    category: "AV Solutions",
    date: "May 28, 2026",
    readTime: "6 min read",
    title: "How Modern AV Systems Are Transforming UAE Boardrooms",
    excerpt:
      "From wireless conferencing to intelligent room automation &mdash; a guide to building the ideal hybrid meeting environment.",
    color: "from-[#533489] to-[#7F77DD]",
    href: "/blogs/av-systems-uae-boardrooms",
  },
];

export default function BlogFeed() {
  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
              <span className="text-xs font-bold tracking-widest uppercase text-[#C0272D]">
                Insights
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0D1B2A] leading-tight tracking-tight">
              Latest from CODE3
            </h2>
          </div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#C0272D] text-[#C0272D] font-semibold text-sm hover:bg-red-50 transition-colors flex-shrink-0"
          >
            View All Posts <ArrowRight size={15} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map(({ category, date, readTime, title, excerpt, color, href }) => (
            <Link
              key={title}
              href={href}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              {/* Image placeholder */}
              <div
                className={`h-44 bg-gradient-to-br ${color} flex items-center justify-center relative`}
              >
                <svg
                  className="opacity-10 w-20 h-20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="absolute top-3 left-3 bg-[#C0272D] text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                  {category}
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs text-gray-400 mb-2.5">
                  {date} · {readTime}
                </p>
                <h3 className="text-base font-bold text-[#0D1B2A] leading-snug mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C0272D] group-hover:gap-3 transition-all duration-200">
                  Read more <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
