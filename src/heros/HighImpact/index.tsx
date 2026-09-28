'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Cloud, Network, Server, ShieldCheck, Wifi, type LucideIcon } from 'lucide-react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Reveal } from '@/components/site/Reveal'
import { cn } from '@/utilities/ui'

// Fades and lifts the ambient background layer as the visitor scrolls past
// the hero - separate from the entrance animations above (which only ever
// run once on load), this responds continuously to scroll position. Only
// the background reacts; the text content stays in normal document flow.
function useScrollFade() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      const rect = el.getBoundingClientRect()
      // 0 at the top of the viewport, 1 once the hero has scrolled fully past.
      const p = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1)
      setProgress(p)
      raf = 0
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return { ref, progress }
}

// Subtle mouse-parallax for the ambient background blobs (desktop only - a
// touch device never fires mousemove, so this is inert there, not just
// hidden). Small, capped offsets so it reads as the background responding
// gently to the cursor rather than the page feeling unstable.
function useParallax(maxOffset = 18) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      setOffset({ x: px * maxOffset * 2, y: py * maxOffset * 2 })
    }
    const handleLeave = () => setOffset({ x: 0, y: 0 })
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [maxOffset])

  return { ref, offset }
}

// Minimal, low-effort fill for the empty strip at the bottom of the hero -
// just hints there's more below without adding real content/clutter.
function ScrollCue() {
  return (
    <div className="relative z-10 flex flex-none flex-col items-center gap-1.5 py-5 text-white/50">
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">Scroll to explore</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 animate-bounce">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  )
}

// Fine, sparse points scattered across the hero - reads as depth/atmosphere
// rather than a flat gradient. Fixed positions (not randomized) so server
// and client render identically.
const SPARKLE_POSITIONS = [
  { top: '18%', left: '12%' },
  { top: '28%', left: '82%' },
  { top: '68%', left: '8%' },
  { top: '76%', left: '90%' },
  { top: '14%', left: '48%' },
  { top: '85%', left: '55%' },
  { top: '52%', left: '95%' },
  { top: '40%', left: '3%' },
]

// Purely decorative - a handful of thin outlined "IT services" icons
// drifting slowly through the hero's open background space, each on its own
// timing. Reinforces the network/infrastructure theme without competing
// with the text (very low opacity, hidden on small screens where there's no
// spare room for them).
const FLOATING_ICONS: { Icon: LucideIcon; style: React.CSSProperties; duration: string; delay: string }[] = [
  { Icon: Cloud, style: { top: '12%', left: '62%' }, duration: '19s', delay: '0s' },
  { Icon: Wifi, style: { top: '18%', right: '8%' }, duration: '23s', delay: '-6s' },
  { Icon: ShieldCheck, style: { top: '62%', left: '68%' }, duration: '21s', delay: '-11s' },
  { Icon: Server, style: { bottom: '20%', left: '6%' }, duration: '25s', delay: '-4s' },
  { Icon: Network, style: { bottom: '16%', right: '28%' }, duration: '20s', delay: '-9s' },
]

function FloatingTechIcons() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {FLOATING_ICONS.map(({ Icon, style, duration, delay }, i) => (
        <Icon
          key={i}
          strokeWidth={1}
          className="animate-drift absolute h-9 w-9 text-white/[0.09]"
          style={{ ...style, animationDuration: duration, animationDelay: delay }}
        />
      ))}
    </div>
  )
}

// A single tiled SVG noise filter, layered over the gradient at very low
// opacity - the same "grain over a color wash" treatment that keeps a dark
// gradient hero from reading as a flat, generic AI-gradient blob.
const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// Splits the headline so the closing word(s) can be styled as the emphasis
// phrase - e.g. "IT Solutions That Keep Your Business Moving" reads as
// "...Your Business" + accent "Moving".
function splitHeadline(text: string, accentWordCount = 1) {
  const words = text.trim().split(/\s+/)
  if (words.length <= accentWordCount) return { lead: '', accent: text }
  return {
    lead: words.slice(0, -accentWordCount).join(' '),
    accent: words.slice(-accentWordCount).join(' '),
  }
}

export const HighImpactHero: React.FC<Page['hero']> = ({ links, HeroText, subText }) => {
  const { lead, accent } = splitHeadline(HeroText || '', 2)
  const parallaxNear = useParallax(22)
  const parallaxFar = useParallax(10)
  const scrollFade = useScrollFade()

  return (
    <section ref={parallaxNear.ref} className="relative w-full overflow-hidden">
      {/* Fills exactly the viewport height remaining below the sticky header
          (100px on mobile, 116px from sm up, where the top info bar shows),
          so the next section never peeks into view until the visitor
          scrolls - regardless of how short the content itself is. */}
      <div
        ref={scrollFade.ref}
        className="relative flex min-h-[calc(100vh-100px)] w-full flex-col sm:min-h-[calc(100vh-116px)]"
      >
        {/* Ambient background layer - fades and lifts slightly as the visitor
            scrolls past the hero (useScrollFade), continuous and separate
            from the one-time entrance animations on the text content below. */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 1 - scrollFade.progress * 0.7,
            transform: `translateY(${scrollFade.progress * -36}px)`,
          }}
        >
          {/* Dark atmospheric base - deep red bleeding to near-black, rather
              than a flat two-stop gradient. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'radial-gradient(120% 100% at 50% 0%, #6e0f18 0%, #2a0a0a 55%, #0c0505 100%)' }}
          />
          {/* Organic drifting color wash, off-center on either side rather than
              symmetric - each on its own timing so they never move in lockstep.
              Each blob sits in its own transform wrapper (mouse-parallax,
              nearer blobs move more) with the drift keyframe animation applied
              to the blob itself one level in - two independent transforms on
              different elements, so they compose instead of fighting for the
              same CSS property. */}
          <div
            className="pointer-events-none absolute -left-32 top-0 h-[36rem] w-[36rem] transition-transform duration-300 ease-out"
            style={{ transform: `translate3d(${parallaxFar.offset.x}px, ${parallaxFar.offset.y}px, 0)` }}
          >
            <div
              aria-hidden
              className="h-full w-full animate-drift rounded-full bg-primary_red/30 blur-[140px]"
              style={{ animationDuration: '18s' }}
            />
          </div>
          <div
            className="pointer-events-none absolute -right-24 bottom-0 h-[30rem] w-[30rem] transition-transform duration-300 ease-out"
            style={{ transform: `translate3d(${parallaxNear.offset.x * -1}px, ${parallaxNear.offset.y * -1}px, 0)` }}
          >
            <div
              aria-hidden
              className="h-full w-full animate-drift rounded-full bg-secondary_red/25 blur-[130px]"
              style={{ animationDuration: '22s', animationDelay: '-7s' }}
            />
          </div>
        <div
          className="pointer-events-none absolute left-1/2 top-1/4 h-[24rem] w-[24rem] transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(calc(-50% + ${parallaxNear.offset.x}px), ${parallaxNear.offset.y}px, 0)` }}
        >
          <div
            aria-hidden
            className="h-full w-full animate-drift rounded-full bg-white/[0.06] blur-[120px]"
            style={{ animationDuration: '26s', animationDelay: '-13s' }}
          />
        </div>
        {/* Grain, blended over the gradient - see GRAIN_BG comment above. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_BG }}
        />
        {/* Sparse sparkle points */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
          {SPARKLE_POSITIONS.map((pos, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 animate-gentle-pulse rounded-full bg-white/40"
              style={{ ...pos, animationDuration: `${4 + (i % 3)}s`, animationDelay: `-${i}s` }}
            />
          ))}
        </div>
        <FloatingTechIcons />
        </div>

        {/* flex-1 + items-center: content grows to fill whatever space is
            left above the scroll cue and centers itself within it - keeps
            the cue pinned at the bottom in normal flow, never overlapping
            the centered content even on very short viewports. */}
        <div className="container relative z-10 mx-auto flex flex-1 items-center justify-center px-4 py-10 text-center sm:px-6">
          <div className="mx-auto flex max-w-4xl flex-col items-center">
            <Reveal durationMs={450}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur">
                {/* A radiating ping ring behind the steady dot, like a radar/
                    signal sweep - the dot itself stays a fixed size so the
                    ring reads as something emitted FROM it. */}
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary_red opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary_red" />
                </span>
                IT Solutions & Technology Services
              </span>
            </Reveal>

            {/* Left un-animated on purpose - the hero's largest text and
                likely LCP candidate; a fade-in would delay its final paint.
                The accent phrase gets a slow shimmer instead (a moving
                background-position, not an opacity/transform change), which
                doesn't affect when the text itself is considered painted. */}
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              {lead && <>{lead}{' '}</>}
              <span
                className="hero-shimmer-text bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #FF3B4B 0%, #ffffff 35%, #FF3B4B 60%, #ffb3ba 80%, #FF3B4B 100%)',
                  backgroundSize: '250% 100%',
                }}
              >
                {accent}
              </span>
            </h1>
            <style>{`
              .hero-shimmer-text { animation: hero-shimmer 6s ease-in-out infinite; }
              @keyframes hero-shimmer {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              @media (prefers-reduced-motion: reduce) {
                .hero-shimmer-text { animation: none; }
              }
            `}</style>

            {subText && (
              <Reveal durationMs={450} delayMs={90}>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                  {subText}
                </p>
              </Reveal>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <Reveal durationMs={450} delayMs={180}>
                <ul className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
                  {links.map(({ link }, i) => {
                    const isPrimary = link.appearance !== 'outline'
                    return (
                      <li key={i} className={cn('relative w-full sm:w-auto', isPrimary && 'group')}>
                        {/* Ambient glow behind the primary CTA only - a separate
                            element rather than animating the button's own
                            box-shadow, so it doesn't fight the button's own
                            static shadow/hover-shadow utility classes. */}
                        {isPrimary && (
                          <span
                            aria-hidden
                            className="pointer-events-none absolute -inset-1.5 -z-10 animate-pulse rounded-full bg-secondary_red/50 blur-lg"
                          />
                        )}
                        <CMSLink
                          {...link}
                          size="lg"
                          appearance={isPrimary ? 'gradientArrow' : 'outline'}
                          className={cn(
                            'w-full sm:w-auto',
                            !isPrimary &&
                              'border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10',
                          )}
                        />
                      </li>
                    )
                  })}
                </ul>
              </Reveal>
            )}
          </div>
        </div>

        <ScrollCue />
      </div>
    </section>
  )
}
