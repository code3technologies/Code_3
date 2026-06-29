"use client";

const testimonials = [
  {
    text: "CODE3 has been a reliable technology partner for our organisation. Their proactive approach and rapid response have significantly improved the stability and performance of our IT environment.",
    name: "IT Manager",
    role: "UAE-Based Enterprise",
    initials: "IT",
    color: "#0D1B2A",
  },
  {
    text: "From consultation to implementation, every stage was delivered efficiently and exceeded our expectations. The team demonstrated exceptional professionalism throughout the entire project.",
    name: "Operations Manager",
    role: "Retail Sector, Dubai",
    initials: "OM",
    color: "#1e7e5a",
  },
  {
    text: "CODE3's expertise in IT infrastructure and cybersecurity has strengthened our technology environment while ensuring uninterrupted business operations. Highly recommended.",
    name: "Director",
    role: "Healthcare Organisation",
    initials: "DR",
    color: "#8b3a62",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#C0272D]">
              Client Stories
            </span>
            <span className="w-5 h-0.5 bg-[#C0272D] rounded-full" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0D1B2A] leading-tight tracking-tight">
            What our clients say
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(({ text, name, role, initials, color }) => (
            <div
              key={name}
              className="bg-white border border-gray-100 rounded-2xl p-7 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
              </div>

              {/* Quote mark */}
              <div className="text-5xl leading-none text-[#C0272D] opacity-30 font-serif mb-3">
                "
              </div>

              <p className="text-sm text-gray-500 leading-relaxed italic flex-1 mb-6">
                {text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: color }}
                >
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0D1B2A]">{name}</div>
                  <div className="text-xs text-gray-400">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
