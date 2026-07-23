'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/ui'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'
import { SERVICE_CATEGORIES, SERVICE_DATA, SERVICE_ICON_PATHS } from './serviceData'

export interface ServicesCategoryData {
  label: string
  icon: string
  services: { title: string; description: string }[]
}

export interface ServicesExplorerProps {
  eyebrow?: string
  title?: string
  description?: string
  categories?: ServicesCategoryData[]
}

const DEFAULT_CATEGORIES: ServicesCategoryData[] = SERVICE_CATEGORIES.map((cat) => ({
  label: cat.label,
  icon: cat.key,
  services: (SERVICE_DATA[cat.key] || []).map(([title, description]) => ({ title, description })),
}))

export function ServicesExplorer({
  eyebrow = 'OUR SERVICES',
  title = 'Your technology partner in every step',
  description = 'Whether you need a secure IT backbone or a strong digital presence, CODE3 provides tailored solutions under one roof. Click a category to see everything it covers.',
  categories = DEFAULT_CATEGORIES,
}: ServicesExplorerProps) {
  const [active, setActive] = useState(0)
  const activeCategory = categories[active]

  return (
    <section id="services" className="relative overflow-hidden py-[120px] max-[760px]:py-20">
      <div
        className="pointer-events-none absolute -right-[140px] -top-[180px] z-0 h-[520px] w-[520px] rounded-full blur-[2px]"
        style={{ background: 'radial-gradient(circle, rgba(223,51,65,0.16), transparent 68%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-[160px] -left-[120px] z-0 h-[420px] w-[420px] rounded-full blur-[2px]"
        style={{ background: 'radial-gradient(circle, rgba(139,15,31,0.14), transparent 68%)' }}
      />
      <div className="relative z-[1] mx-auto max-w-[1240px] px-8 max-[760px]:px-5">
        <Reveal className="mb-16 max-w-[640px]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-grotesk text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.14] text-code3-text">
            {title}
          </h2>
          {description && (
            <p className="font-inter mt-4 text-[16.5px] leading-relaxed text-code3-slate">
              {description}
            </p>
          )}
        </Reveal>

        <Reveal className="mb-10 flex flex-wrap gap-2.5">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActive(i)}
              aria-expanded={active === i}
              className={cn(
                'font-inter flex-none whitespace-nowrap rounded-full border px-5 py-[11px] text-[13.5px] font-semibold transition-all duration-300',
                active === i
                  ? 'border-code3-ink bg-code3-ink text-white'
                  : 'border-code3-line-light bg-white text-code3-slate hover:border-code3-ink hover:text-code3-ink',
              )}
            >
              {cat.label}
            </button>
          ))}
        </Reveal>

        {activeCategory && (
          <div className="border-t border-code3-line-light pt-10">
            <div className="grid grid-cols-1 gap-x-10 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
              {activeCategory.services.map((svc) => (
                <div key={svc.title} className="group">
                  <div className="mb-[18px] flex h-[46px] w-[46px] items-center justify-center rounded-full border border-code3-line-light bg-white transition-colors duration-300 group-hover:border-code3-ink group-hover:bg-code3-ink">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-code3-ink transition-colors duration-300 group-hover:text-code3-signal"
                    >
                      <path d={SERVICE_ICON_PATHS[activeCategory.icon] || ''} />
                    </svg>
                  </div>
                  <h4 className="font-grotesk mb-2.5 text-[16.5px] text-code3-text">{svc.title}</h4>
                  <p className="font-inter text-[13.5px] leading-relaxed text-code3-slate">
                    {svc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
