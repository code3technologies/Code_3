'use client'
import React, { useEffect, useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  Cloud,
  Handshake,
  Network,
  Server,
  ShieldCheck,
  Smile,
  Users,
  Wifi,
  type LucideIcon,
} from 'lucide-react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Eyebrow } from '@/components/site/Eyebrow'
import { cn } from '@/utilities/ui'

// Mirrors the real, already-published numbers (and icons) shown in the Stats
// block further down this same page - kept as compact glass cards right in
// the hero for immediate credibility, like a floating stat strip.
const HERO_STATS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: '30+', label: 'Experienced Professionals', icon: Users },
  { value: '50+', label: 'Technology Partners', icon: Handshake },
  { value: '1500+', label: 'Projects Delivered', icon: CheckCircle2 },
  { value: '400+', label: 'Satisfied Customers', icon: Smile },
]

// Fills the empty right-hand side on wide screens by cycling through all
// four real stats one at a time - more dynamic than a single static figure,
// and it actually surfaces all the numbers instead of just the biggest one.
function FeaturedStatCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_STATS.length), 3500)
    return () => clearInterval(id)
  }, [])

  return (
    // pr- clearance keeps this clear of the fixed phone/WhatsApp buttons,
    // which sit in the same bottom/right-ish zone this right-aligned block
    // would otherwise butt right up against.
    <div className="hidden shrink-0 pr-2 text-right lg:block lg:border-l lg:border-white/10 lg:pl-10 lg:pr-24">
      <span className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
        Proven Track Record
      </span>

      {/* A row of all four panels laid out side by side, shifted by -100%*index -
          panels are spatially separate rather than stacked, so mid-transition
          the outgoing one slides fully away while the next slides in with no
          overlapping/ghosted text (a stacked opacity crossfade did that). */}
      <div className="relative mt-5 h-[17rem] w-[23rem] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {HERO_STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex h-full w-[23rem] flex-none flex-col items-end justify-start"
              >
                <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-8 w-8 text-white" />
                </span>
                <div className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-7xl font-extrabold leading-none tracking-tight text-transparent xl:text-8xl">
                  {stat.value}
                </div>
                <div className="mt-3 min-h-[4.5rem] max-w-[23rem] text-2xl font-semibold leading-snug text-white">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {HERO_STATS.map((stat, i) => (
          <button
            key={stat.label}
            onClick={() => setIndex(i)}
            aria-label={`Show ${stat.label}`}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === index ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/50',
            )}
          />
        ))}
      </div>
    </div>
  )
}

// FeaturedStatCarousel above is lg:block-only (designed for the wide,
// side-by-side layout), which left the same real estate completely empty
// below that breakpoint - a big chunk of real traffic (tablets, unmaximized
// laptop windows) saw nothing but background between the CTAs and the
// scroll cue. This is the lg:hidden counterpart: same four real stats, laid
// out as a compact static grid that fits the stacked mobile/tablet layout
// instead of the wide carousel treatment.
function MobileStatStrip() {
  return (
    <div className="w-full lg:hidden">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
        Proven Track Record
      </span>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {HERO_STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="flex flex-col items-start gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <Icon className="h-5 w-5 text-white/70" />
              <div className="text-xl font-extrabold leading-none text-white">{stat.value}</div>
              <div className="text-xs leading-snug text-white/70">{stat.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Minimal, low-effort fill for the empty strip at the bottom of the hero -
// just hints there's more below without adding real content/clutter. Uses
// Tailwind's built-in animate-bounce rather than a custom keyframe, since a
// couple of custom-keyframe additions to tailwind.config earlier needed a
// dev-server restart before they actually took effect.
function ScrollCue() {
  return (
    <div className="relative z-10 flex flex-none flex-col items-center gap-1.5 py-5 text-white/50">
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">Scroll to explore</span>
      <ChevronDown className="h-4 w-4 animate-bounce" />
    </div>
  )
}

// Purely decorative - no text, no claims, just a handful of thin outlined
// "IT services" icons scattered through the hero's open background space,
// each drifting slowly on its own timing (reusing animate-drift, same as
// the ambient glow blobs). Scattered by percentage position so they land in
// whatever empty space exists rather than a fixed pixel spot.
function FloatingTechIcons() {
  const icons: { Icon: LucideIcon; style: React.CSSProperties; duration: string; delay: string }[] = [
    { Icon: Cloud, style: { top: '10%', left: '58%' }, duration: '18s', delay: '0s' },
    { Icon: Wifi, style: { top: '14%', right: '6%' }, duration: '22s', delay: '-5s' },
    { Icon: ShieldCheck, style: { top: '58%', left: '63%' }, duration: '20s', delay: '-10s' },
    { Icon: Server, style: { bottom: '18%', left: '4%' }, duration: '24s', delay: '-3s' },
    { Icon: Network, style: { bottom: '14%', right: '30%' }, duration: '19s', delay: '-8s' },
  ]

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
      {icons.map(({ Icon, style, duration, delay }, i) => (
        <Icon
          key={i}
          strokeWidth={1}
          className="animate-drift absolute h-9 w-9 text-white/[0.08]"
          style={{ ...style, animationDuration: duration, animationDelay: delay }}
        />
      ))}
    </div>
  )
}

export const HighImpactHero: React.FC<Page['hero']> = ({ links, HeroText, subText }) => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Fills exactly the viewport height remaining below the sticky header
          (100px on mobile, 116px from sm up, where the top info bar shows),
          so the next section never peeks into view until the visitor
          scrolls - regardless of how short the content itself is. */}
      <div className="relative flex min-h-[calc(100vh-100px)] w-full flex-col sm:min-h-[calc(100vh-116px)]">
        {/* Abstract background - the same dark-red gradient already used for
            the Infra Services sidebar / Products menu, for consistency */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #b3121f 0%, #8b0f1f 40%, #2d0e0e 100%)' }}
        />
        {/* Ambient glow accents - brighter/larger than before so the hero's
            empty areas read as deliberate depth rather than flat dead space.
            Each drifts slowly on its own timing so they never move in
            lockstep - reads as organic rather than mechanical. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 h-[32rem] w-[32rem] animate-drift rounded-full bg-white/20 blur-[130px]"
          style={{ animationDuration: '16s' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 h-[26rem] w-[26rem] animate-drift rounded-full bg-black/30 blur-[120px]"
          style={{ animationDuration: '20s', animationDelay: '-6s' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/3 h-[26rem] w-[26rem] animate-drift rounded-full bg-secondary_red/25 blur-[150px]"
          style={{ animationDuration: '24s', animationDelay: '-12s' }}
        />
        {/* Subtle dot-grid texture for a tech feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Diagonal light streaks - the dynamic, "designed" visual interest a
            flat gradient alone doesn't give; angled bars of light that sway
            slowly back and forth, each on its own timing (staggered negative
            delays start them mid-cycle rather than all in sync). The rotate
            lives inside the animate-streak-sway keyframe itself now, since an
            animated transform fully replaces a static one. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-1/4 left-[8%] h-[180%] w-20 animate-streak-sway bg-gradient-to-b from-transparent via-white/[0.07] to-transparent"
            style={{ animationDuration: '13s' }}
          />
          <div
            className="absolute -top-1/4 left-[38%] h-[180%] w-12 animate-streak-sway bg-gradient-to-b from-transparent via-white/[0.05] to-transparent"
            style={{ animationDuration: '17s', animationDelay: '-4s' }}
          />
          <div
            className="absolute -top-1/4 left-[68%] h-[180%] w-28 animate-streak-sway bg-gradient-to-b from-transparent via-secondary_red/[0.25] to-transparent"
            style={{ animationDuration: '15s', animationDelay: '-9s' }}
          />
          <div
            className="absolute -top-1/4 left-[85%] h-[180%] w-10 animate-streak-sway bg-gradient-to-b from-transparent via-white/[0.06] to-transparent"
            style={{ animationDuration: '19s', animationDelay: '-2s' }}
          />
        </div>

        <FloatingTechIcons />

        {/* flex-1 + items-center: content grows to fill whatever space is
            left above the scroll cue and centers itself within it - keeps
            the cue pinned at the bottom in normal flow, never overlapping
            the centered content even on very short viewports. */}
        <div className="container relative z-10 mx-auto flex flex-1 items-center px-4 py-6 sm:px-6">
          <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <Eyebrow className="mb-1.5 text-red-300">IT Solutions & Technology Services</Eyebrow>
              <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight text-white md:text-4xl">
                {HeroText}
              </h1>
              {subText && (
                <p className="mt-2 text-sm leading-normal text-white/80 md:text-base">{subText}</p>
              )}
              {Array.isArray(links) && links.length > 0 && (
                <ul className="mt-4 flex w-full flex-col gap-2.5 sm:flex-row">
                  {links.map(({ link }, i) => (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        size="sm"
                        className={cn(
                          'w-full sm:w-auto',
                          link.appearance === 'default' && 'shadow-[0_8px_30px_-6px_rgba(201,14,29,0.65)]',
                        )}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <FeaturedStatCarousel />

            <MobileStatStrip />
          </div>
        </div>

        <ScrollCue />
      </div>
    </section>
  )
}
