import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Eyebrow } from '@/components/site/Eyebrow'
import { cn } from '@/utilities/ui'

// A light, calm hero built from patterns already used elsewhere on the site
// (SpecComparisonTable's soft ambient glow on a white/gray wash) rather than
// a photo or Home's dark animated gradient - a quieter, text-forward
// alternative for pages that shouldn't just repeat the homepage's hero.
export const SoftImpactHero: React.FC<Page['hero']> = ({ links, HeroText, subText }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50/70 to-white">
      {/* Soft ambient glow accents - same treatment as the feature-comparison
          table elsewhere on the site, just larger given this is a hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-primary_red/10 blur-[110px] md:h-[36rem] md:w-[36rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-primary_red/[0.06] blur-[100px] md:h-96 md:w-96"
      />
      {/* Faint dot-grid texture, echoing HighImpact's but light-on-light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="container relative mx-auto px-4 py-16 sm:px-6 md:py-24">
        <div className="max-w-2xl">
          <Eyebrow>Who We Are</Eyebrow>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            {HeroText}
          </h1>
          {subText && (
            <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">{subText}</p>
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} size="lg" className={cn('w-full sm:w-auto')} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
