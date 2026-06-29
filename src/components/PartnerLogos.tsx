"use client";

const partners = [
  "Microsoft", "Cisco", "Fortinet", "Acronis",
  "Ubiquiti", "Avaya", "Bose", "Barco",
];

export default function PartnerLogos() {
  return (
    <div className="bg-gray-50 border-b border-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4 lg:gap-6">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-300 whitespace-nowrap">
          Trusted Partners
        </span>
        {partners.map((name) => (
          <div
            key={name}
            className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 whitespace-nowrap hover:border-gray-300 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#C0272D]" />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
