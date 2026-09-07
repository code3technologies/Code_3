import React from 'react'
import { CheckCircle2, Handshake, Smile, Users } from 'lucide-react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

// Mirrors the same real, already-published numbers shown in the Stats
// block further down the page.
const SUPPORTING_STATS = [
  { value: '30+', label: 'Experienced Professionals', icon: Users },
  { value: '50+', label: 'Technology Partners', icon: Handshake },
  { value: '400+', label: 'Satisfied Customers', icon: Smile },
]

// A dual-tone split hero - color blocking instead of a single gradient wash,
// and one dramatic headline stat instead of a card grid or photo. A
// different technique from the site's other heroes rather than a variation
// on the same idea.
export const SplitImpactHero: React.FC<Page['hero']> = ({ links, HeroText, subText }) => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex min-h-[28rem] w-full flex-col md:min-h-[36rem] md:flex-row">
        <div
          className="flex flex-1 flex-col justify-center px-4 py-14 sm:px-6 md:w-3/5 md:px-14 md:py-0"
          style={{ background: 'linear-gradient(160deg, #b3121f 0%, #d7213c 45%, #6e0d17 100%)' }}
        >
          <div className="mx-auto w-full max-w-xl md:mx-0">
            <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl">
              {HeroText}
            </h1>
            {subText && (
              <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">{subText}</p>
            )}
            {Array.isArray(links) && links.length > 0 && (
              <ul className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
                {links.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink
                      {...link}
                      size="lg"
                      className={cn(
                        'w-full sm:w-auto',
                        link.appearance === 'default' && 'shadow-[0_8px_30px_-6px_rgba(0,0,0,0.4)]',
                      )}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-white px-6 py-10 text-center md:w-2/5 md:px-8">
          <div>
            <div className="text-6xl font-extrabold leading-none tracking-tight text-primary_red md:text-8xl">
              1500+
            </div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Projects Delivered
            </div>
          </div>

          <div className="grid w-full max-w-xs grid-cols-3 gap-3 border-t border-gray-100 pt-6">
            {SUPPORTING_STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex flex-col items-center gap-1.5">
                  <Icon className="h-4 w-4 text-primary_red/60" />
                  <div className="text-base font-bold leading-none text-gray-900">{stat.value}</div>
                  <div className="text-[10px] font-medium leading-tight text-gray-500">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
