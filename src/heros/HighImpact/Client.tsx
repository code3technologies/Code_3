'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { Page } from '@/payload-types'

import { Reveal } from '@/components/site/Reveal'
import { ServiceIcon } from '@/components/site/icons'
import { cn } from '@/utilities/ui'
import type { HomeServiceCard } from './getHomeServices'

const FILTERS = [
  { value: 'all' as const, label: 'All' },
  { value: 'infrastructure' as const, label: 'IT Infra Services' },
  { value: 'digital' as const, label: 'Digital Services' },
]

// Fine, sparse points scattered across the hero - reads as depth/atmosphere
// rather than a flat gradient. Fixed positions (not randomized) so server
// and client render identically.
const SPARKLE_POSITIONS = [
  { top: '10%', left: '8%' },
  { top: '16%', left: '92%' },
  { top: '6%', left: '48%' },
  { top: '92%', left: '55%' },
  { top: '50%', left: '97%' },
  { top: '55%', left: '2%' },
]

// A single tiled SVG noise filter, layered over the gradient at very low
// opacity - the same "grain over a color wash" treatment that keeps a dark
// gradient hero from reading as a flat, generic AI-gradient blob.
const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// Four background "scenes" for the card visuals, cycled by index so no two
// neighbouring cards look identical - varied by gradient shape/position
// rather than by introducing new colors, so the grid stays on-brand.
const CARD_SCENES = [
  { background: 'radial-gradient(120% 120% at 15% 15%, #C90E1D 0%, #2a0a0a 65%)', glow: 'bg-primary_red/50' },
  { background: 'radial-gradient(120% 120% at 85% 85%, #FF3B4B 0%, #1a0808 65%)', glow: 'bg-secondary_red/45' },
  { background: 'linear-gradient(135deg, #8b0f1f 0%, #2a0a0a 70%)', glow: 'bg-white/10' },
  { background: 'radial-gradient(100% 140% at 50% 100%, #C90E1D 0%, #12060a 70%)', glow: 'bg-secondary_red/40' },
]

function CardVisual({ icon, index }: { icon: HomeServiceCard['icon']; index: number }) {
  const scene = CARD_SCENES[index % CARD_SCENES.length]
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
      <div aria-hidden className="absolute inset-0" style={{ background: scene.background }} />
      <div
        aria-hidden
        className={cn('pointer-events-none absolute h-40 w-40 animate-drift rounded-full blur-[60px]', scene.glow)}
        style={{
          top: index % 2 === 0 ? '10%' : '55%',
          left: index % 3 === 0 ? '60%' : '5%',
          animationDuration: `${14 + (index % 5)}s`,
          animationDelay: `-${index * 2}s`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_BG }}
      />
      <div className="relative z-10 flex h-full items-center justify-center">
        <span
          className="flex h-16 w-16 animate-gentle-pulse items-center justify-center rounded-2xl bg-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm"
          style={{ animationDuration: `${5 + (index % 3)}s`, animationDelay: `-${index}s` }}
        >
          <ServiceIcon preset={icon} className="h-8 w-8 text-white" />
        </span>
      </div>
    </div>
  )
}

export function HighImpactHeroClient({
  HeroText,
  subText,
  services,
}: {
  HeroText?: Page['hero']['HeroText']
  subText?: Page['hero']['subText']
  services: HomeServiceCard[]
}) {
  const [filter, setFilter] = useState<'all' | 'infrastructure' | 'digital'>('all')
  const visible = filter === 'all' ? services : services.filter((s) => s.category === filter)

  return (
    <section className="relative w-full overflow-hidden">
      {/* Dark atmospheric base - deep red bleeding to near-black. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 100% at 50% 0%, #6e0f18 0%, #2a0a0a 55%, #0c0505 100%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-10 h-[36rem] w-[36rem] animate-drift rounded-full bg-primary_red/25 blur-[150px]"
        style={{ animationDuration: '18s' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-[30rem] w-[30rem] animate-drift rounded-full bg-secondary_red/20 blur-[140px]"
        style={{ animationDuration: '22s', animationDelay: '-7s' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_BG }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
        {SPARKLE_POSITIONS.map((pos, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 animate-gentle-pulse rounded-full bg-white/40"
            style={{ ...pos, animationDuration: `${4 + (i % 3)}s`, animationDelay: `-${i}s` }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        {/* Condensed intro - the grid below is the hero's main act, so this
            stays short: enough to say who CODE3 is before the grid takes
            over, not a full pitch with its own CTAs. */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal durationMs={450}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-gentle-pulse rounded-full bg-secondary_red" />
              What We Do
            </span>
          </Reveal>

          {/* Left un-animated on purpose - the largest text and likely LCP
              candidate; a fade-in would delay its final paint. */}
          <h1 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
            {HeroText}
          </h1>

          {subText && (
            <Reveal durationMs={450} delayMs={90}>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">{subText}</p>
            </Reveal>
          )}
        </div>

        {/* Filter chips */}
        <Reveal durationMs={450} delayMs={160}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                  filter === f.value
                    ? 'border-white bg-white text-foreground'
                    : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Card grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((service, i) => (
            <Reveal key={service.id} durationMs={400} delayMs={Math.min(i * 40, 320)}>
              <Link
                href={`/service/${service.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors hover:border-white/25"
              >
                <div className="transition-transform duration-500 group-hover:scale-[1.04]">
                  <CardVisual icon={service.icon} index={i} />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-base font-semibold leading-snug text-white">{service.title}</h3>
                    <span className="mt-1.5 inline-block text-xs font-medium uppercase tracking-wide text-white/45">
                      {service.category === 'infrastructure' ? 'IT Infra Services' : 'Digital Services'}
                    </span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary_red">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
