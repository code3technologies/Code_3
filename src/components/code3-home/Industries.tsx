import React from 'react'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export const INDUSTRY_ICON_PATHS: Record<string, string> = {
  'Corporate Offices': 'M3 7h18v13H3z M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2',
  Government: 'M3 21h18M4 21V9l8-6 8 6v12M9 21v-6h6v6',
  Healthcare: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z M9 12h6M12 9v6',
  Education: 'M22 10L12 5 2 10l10 5 10-5z M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5',
  Hospitality: 'M3 21h18M5 21V10l7-6 7 6v11 M9 21v-6h6v6',
  Retail: 'M3 9l9-6 9 6M4 10v10h16V10 M9 20v-6h6v6',
  'Banking & Finance': 'M3 21h18M4 21V10l8-6 8 6v11M8 21v-6M12 21v-6M16 21v-6',
  Manufacturing: 'M3 21V10l5 3V10l5 3V7l5 3v11H3z',
  'Logistics & Warehousing':
    'M3 7h11v10H3z M14 10h4l3 3v4h-7z M6.5 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M17 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  Construction:
    'M3 21h18 M5 21V11l6-4 6 4v10 M9 9h2v2H9z M13 9h2v2h-2z M9 13h2v2H9z M13 13h2v2h-2z',
  'Real Estate': 'M3 21V9l9-6 9 6v12 M9 21v-6h6v6',
  Residential: 'M3 12l9-9 9 9 M5 10v10h14V10',
  'Small & Medium Businesses (SMBs)':
    'M3 21h18 M6 21V8h12v13 M9 12h2M13 12h2M9 16h2M13 16h2',
  'Enterprise Organizations': 'M3 21V9l9-6 9 6v12 M9 21v-6h6v6 M9 12h.01M15 12h.01',
}

export interface IndustryData {
  title: string
  iconPreset: string
}

export interface IndustriesProps {
  eyebrow?: string
  title?: string
  industries?: IndustryData[]
}

const DEFAULT_INDUSTRIES: IndustryData[] = Object.keys(INDUSTRY_ICON_PATHS).map((title) => ({
  title,
  iconPreset: title,
}))

export function Industries({
  eyebrow = 'INDUSTRIES WE SERVE',
  title = 'Technology solutions tailored for every industry',
  industries = DEFAULT_INDUSTRIES,
}: IndustriesProps) {
  return (
    <section id="industries" className="bg-code3-ink py-[120px] text-white max-[760px]:py-20">
      <div className="mx-auto max-w-[1240px] px-8 max-[760px]:px-5">
        <Reveal className="mb-16 max-w-[640px]">
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h2 className="font-grotesk text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.14] text-white">
            {title}
          </h2>
        </Reveal>
        <Reveal
          delayMs={100}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {industries.map((ind) => (
            <div
              key={ind.title}
              className="group relative overflow-hidden bg-code3-ink2 p-[30px_24px] transition-colors duration-[400ms] hover:bg-code3-ink3"
            >
              <div
                className="pointer-events-none absolute -right-[60px] -top-[60px] h-[140px] w-[140px] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'radial-gradient(circle, rgba(223,51,65,.18), transparent 70%)' }}
              />
              <div className="relative mb-4 h-8 w-8">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-full w-full text-code3-signal transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                >
                  <path d={INDUSTRY_ICON_PATHS[ind.iconPreset] || ''} />
                </svg>
              </div>
              <h4 className="font-grotesk relative text-[15px] leading-snug text-white">
                {ind.title}
              </h4>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
