"use client";

const stats = [
  { value: "13", suffix: "+", label: "Years of Excellence" },
  { value: "200", suffix: "+", label: "Happy Clients" },
  { value: "500", suffix: "+", label: "Projects Delivered" },
  { value: "50", suffix: "+", label: "Technology Partners" },
];

export default function StatsBand() {
  return (
    <div className="bg-[#0D1B2A]">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10 border-x border-white/10">
        {stats.map(({ value, suffix, label }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center py-9 px-4 text-center"
          >
            <div className="text-4xl lg:text-5xl font-bold text-white leading-none mb-2">
              {value}
              <span className="text-[#C0272D]">{suffix}</span>
            </div>
            <div className="text-sm text-white/50 font-medium">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
