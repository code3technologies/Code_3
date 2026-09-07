import React from 'react'
import { CheckCircle2, Handshake, Smile, Users } from 'lucide-react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

// Mirrors the real, already-published numbers shown in the Stats block
// further down this same page - shown here as a static panel (not
// HighImpact's rotating carousel) since this hero deliberately skips motion.
const HERO_STATS = [
  { value: '30+', label: 'Experienced Professionals', icon: Users },
  { value: '50+', label: 'Technology Partners', icon: Handshake },
  { value: '1500+', label: 'Projects Delivered', icon: CheckCircle2 },
  { value: '400+', label: 'Satisfied Customers', icon: Smile },
]

// A bold, saturated hero using the same dark-red gradient already
// established for the site's mega-menu / estimator sidebar - full visual
// impact like Home, but a static stat panel instead of Home's floating
// icons + rotating carousel, so it reads as a deliberately calmer sibling
// rather than a copy.
export const VividImpactHero: React.FC<Page['hero']> = ({ links, HeroText, subText }) => {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="relative flex min-h-[28rem] w-full items-center md:min-h-[36rem]"
        style={{ background: 'linear-gradient(160deg, #b3121f 0%, #d7213c 45%, #6e0d17 100%)' }}
      >
        {/* Slow-drifting ambient glow - the same animate-drift utility used
            elsewhere on the site, just applied more sparingly here (no
            floating icons or streaks) so the background feels alive without
            turning into a copy of Home's busier hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 h-[30rem] w-[30rem] animate-drift rounded-full bg-white/10 blur-[120px]"
          style={{ animationDuration: '18s' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 animate-drift rounded-full bg-black/20 blur-[110px]"
          style={{ animationDuration: '22s', animationDelay: '-8s' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-1/4 top-1/2 h-72 w-72 animate-drift rounded-full bg-white/[0.06] blur-[100px]"
          style={{ animationDuration: '26s', animationDelay: '-4s' }}
        />

        <div className="container relative z-10 mx-auto flex flex-1 items-center px-4 py-14 sm:px-6 md:py-20">
          <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
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

            {/* Static stat panel - hidden on mobile, same real numbers as
                the Stats block below, just shown all at once rather than
                one-at-a-time. */}
            <div className="hidden shrink-0 gap-4 lg:grid">
              {HERO_STATS.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="flex w-72 items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm"
                  >
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white/15">
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <div className="text-2xl font-bold leading-none text-white">{stat.value}</div>
                      <div className="mt-1 text-sm font-medium text-white/70">{stat.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
