'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Cloud, Network, Server, ShieldCheck, Wifi, type LucideIcon } from 'lucide-react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Reveal } from '@/components/site/Reveal'
import { cn } from '@/utilities/ui'

// Subtle mouse-parallax for the ambient background blobs (desktop only - a
// touch device never fires mousemove, so this is inert there, not just
// hidden). Small, capped offsets so it reads as the background responding
// gently to the cursor rather than the page feeling unstable.
function useParallax(maxOffset = 18) {
  const ref = useRef<HTMLElement>(null)
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

// A soft light that follows the cursor across the whole hero - a separate
// effect from the blob parallax (which moves existing background shapes);
// this adds a new light source of its own. Positioned in pixels relative to
// the section, not normalized, since it needs to sit exactly under the
// cursor rather than at a capped offset.
function useSpotlight() {
  const ref = useRef<HTMLElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    const handleLeave = () => setPos(null)
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return { ref, pos }
}

// Small magnetic tilt on the primary CTA - follows the cursor with a capped
// rotation/lift while hovered, then springs back to flat. Desktop-only in
// effect (touch devices never fire mousemove on a hovered element the same
// way, so this stays inert rather than needing a separate check).
function useMagneticTilt(maxTilt = 8) {
  const ref = useRef<HTMLLIElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  const handleMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(400px) rotateX(${-py * maxTilt}deg) rotateY(${px * maxTilt}deg) translateY(-2px)`,
    })
  }
  const handleLeave = () => setStyle({ transform: 'perspective(400px) rotateX(0) rotateY(0) translateY(0)' })

  return { ref, style, handleMove, handleLeave }
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

// Connects a couple of the floating icons with a thin dashed line whose
// dash pattern travels along it - reads as a signal/data pulse moving
// between two nodes rather than a static wire, tying back to the
// "network infrastructure" positioning without a full diagram.
function NetworkConnector() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="hero-network-line pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
    >
      <line x1="62" y1="12" x2="72" y2="84" stroke="#FF3B4B" strokeOpacity="0.25" strokeWidth="0.15" strokeDasharray="2 3" />
    </svg>
  )
}

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
      <NetworkConnector />
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

// Cycles the accent word through a few close synonyms instead of sitting on
// one word forever - content-level motion rather than another background
// decoration. The CMS-provided word is always shown first (and is what's in
// the DOM at first paint, un-animated - see the note where this is used),
// so this only changes what's on screen a couple of seconds later. These
// words are hardcoded here rather than pulled from the CMS; swap the array
// if the wording should say something different.
const ACCENT_ALTERNATES = ['Secure', 'Efficient', 'Reliable']

function RotatingAccent({ base }: { base: string }) {
  const words = React.useMemo(() => [base, ...ACCENT_ALTERNATES.filter((w) => w !== base)], [base])
  const [index, setIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mql.matches)
    if (mql.matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2600)
    return () => clearInterval(id)
  }, [words.length])

  // Longest word in the rotation reserves the line's width up front (as an
  // invisible copy) so the headline never reflows/jumps as shorter or longer
  // words swap in - only the visible word crossfades.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  // The shimmer gradient has to live on the same element as the text node
  // itself - background-clip/background-image aren't inherited CSS
  // properties, so setting them once on a wrapper and nesting plain child
  // spans inside it (as an earlier version of this did) leaves the actual
  // words with transparent color and no gradient to clip against, i.e.
  // invisible. Each stacked word span below carries its own copy instead.
  const gradientStyle: React.CSSProperties = {
    backgroundImage: 'linear-gradient(90deg, #FF3B4B 0%, #ffffff 35%, #FF3B4B 60%, #ffb3ba 80%, #FF3B4B 100%)',
    backgroundSize: '250% 100%',
  }

  return (
    <span className="relative inline-grid">
      <span aria-hidden className="hero-shimmer-text invisible bg-clip-text text-transparent" style={gradientStyle}>
        {longest}
      </span>
      {/* All of the rotating words are decorative to assistive tech - the
          one stable, non-changing announcement is the sr-only span below,
          carrying the actual CMS-authored word rather than whichever
          alternate happens to be visible at the moment a screen reader
          reaches this point. */}
      <span aria-hidden="true" className="contents">
        {words.map((word, i) => (
          <span
            key={word}
            className="hero-shimmer-text col-start-1 row-start-1 bg-clip-text text-transparent transition-opacity duration-500 ease-in-out"
            style={{ ...gradientStyle, opacity: reduceMotion ? (i === 0 ? 1 : 0) : i === index ? 1 : 0 }}
          >
            {word}
          </span>
        ))}
      </span>
      <span className="sr-only">{base}</span>
    </span>
  )
}

export const HighImpactHero: React.FC<Page['hero']> = ({ links, HeroText, subText }) => {
  const { lead, accent } = splitHeadline(HeroText || '', 1)
  const parallaxNear = useParallax(22)
  const parallaxFar = useParallax(10)
  const spotlight = useSpotlight()
  const tilt = useMagneticTilt(8)

  return (
    <section
      ref={(node) => {
        parallaxNear.ref.current = node
        spotlight.ref.current = node
      }}
      className="relative w-full overflow-hidden"
    >
      {/* Fills exactly the viewport height remaining below the sticky header
          (100px on mobile, 116px from sm up, where the top info bar shows),
          so the next section never peeks into view until the visitor
          scrolls - regardless of how short the content itself is. */}
      <div className="relative flex min-h-[calc(100vh-100px)] w-full flex-col sm:min-h-[calc(100vh-116px)]">
        {/* hero-bg-breathe: a very slow, subtle scale on the whole background
            layer - a "Ken Burns" breathe rather than anything that reads as
            movement on its own, just keeps the frame from ever sitting
            perfectly still. */}
        <div className="hero-bg-breathe absolute inset-0">
          {/* Dark atmospheric base - deep red bleeding to near-black, rather
              than a flat two-stop gradient. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'radial-gradient(120% 100% at 50% 0%, #6e0f18 0%, #2a0a0a 55%, #0c0505 100%)' }}
          />
          {/* Diagonal light streaks, swaying slowly - angled bars of light
              rather than a flat gradient, each on its own timing (staggered
              negative delays start them mid-cycle rather than all in sync).
              Reuses the sitewide animate-streak-sway keyframe. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-1/4 left-[10%] h-[180%] w-16 animate-streak-sway bg-gradient-to-b from-transparent via-white/[0.05] to-transparent"
              style={{ animationDuration: '14s' }}
            />
            <div
              className="absolute -top-1/4 left-[70%] h-[180%] w-24 animate-streak-sway bg-gradient-to-b from-transparent via-secondary_red/[0.18] to-transparent"
              style={{ animationDuration: '16s', animationDelay: '-8s' }}
            />
          </div>
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
        {/* Soft light that follows the cursor (desktop only - null position
            until the first mousemove, so nothing renders for touch visitors). */}
        {spotlight.pos && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden sm:block"
            style={{
              background: `radial-gradient(420px circle at ${spotlight.pos.x}px ${spotlight.pos.y}px, rgba(255,255,255,0.08), transparent 70%)`,
            }}
          />
        )}
        {/* Grain, blended over the gradient - see GRAIN_BG comment above.
            Slowly panned (background-position, not transform, so it doesn't
            need its own extra wrapper element) rather than held static -
            reads as a living texture instead of a flat filter. */}
        <div
          aria-hidden
          className="hero-grain-pan pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_BG, backgroundSize: '160% 160%' }}
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
              {/* Rotating conic-gradient ring standing in for the badge's
                  border: an oversized gradient square, centered and spinning
                  inside an overflow-hidden pill, clipped down to a 1px ring
                  by the badge surface sitting on top of it (p-px reserves
                  that 1px). Rotating the oversized square (rather than the
                  pill itself) keeps the badge's own text from spinning too. */}
              <span className="relative inline-flex overflow-hidden rounded-full p-px">
                <span
                  aria-hidden
                  className="hero-badge-spin absolute inset-[-50%]"
                  style={{ background: 'conic-gradient(from 0deg, transparent 0%, #FF3B4B 15%, transparent 35%)' }}
                />
                <span className="relative inline-flex items-center gap-2 rounded-full bg-[#3a1418] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur">
                  {/* A radiating ping ring behind the steady dot, like a radar/
                      signal sweep - the dot itself stays a fixed size so the
                      ring reads as something emitted FROM it. */}
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary_red opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary_red" />
                  </span>
                  IT Solutions & Technology Services
                </span>
              </span>
            </Reveal>

            {/* Left un-animated on purpose - the hero's largest text and
                likely LCP candidate; a fade-in would delay its final paint.
                The accent phrase gets a slow shimmer instead (a moving
                background-position, not an opacity/transform change), which
                doesn't affect when the text itself is considered painted. */}
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              {lead && <>{lead}{' '}</>}
              <RotatingAccent base={accent} />
            </h1>
            <style>{`
              .hero-shimmer-text { animation: hero-shimmer 6s ease-in-out infinite; }
              @keyframes hero-shimmer {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .hero-grain-pan { animation: hero-grain-pan 40s linear infinite; }
              @keyframes hero-grain-pan {
                0% { background-position: 0% 0%; }
                100% { background-position: 100% 100%; }
              }
              .hero-badge-spin { animation: hero-badge-spin 4s linear infinite; }
              @keyframes hero-badge-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .hero-bg-breathe { animation: hero-bg-breathe 14s ease-in-out infinite; }
              @keyframes hero-bg-breathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.04); }
              }
              .hero-network-line line { animation: hero-network-line 1.5s linear infinite; }
              @keyframes hero-network-line {
                to { stroke-dashoffset: -20; }
              }
              @media (prefers-reduced-motion: reduce) {
                .hero-shimmer-text, .hero-grain-pan, .hero-badge-spin, .hero-bg-breathe, .hero-network-line line { animation: none; }
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
                      <li
                        key={i}
                        ref={isPrimary ? tilt.ref : undefined}
                        onMouseMove={isPrimary ? tilt.handleMove : undefined}
                        onMouseLeave={isPrimary ? tilt.handleLeave : undefined}
                        className={cn('relative w-full transition-transform duration-200 ease-out sm:w-auto', isPrimary && 'group')}
                        style={isPrimary ? tilt.style : undefined}
                      >
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
