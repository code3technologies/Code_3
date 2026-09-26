'use client'

import React, { useRef, useEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  type Variants,
} from 'framer-motion'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'

// Brand tokens for this hero specifically. Kept local rather than pushed
// into the global Tailwind theme - the rest of the site still runs on the
// existing primary_red/secondary_red tokens, and widening that sitewide
// wasn't part of this brief.
const CORAL = '#E13F4C'
const INK = '#1A1F29'

// ---------------------------------------------------------------------------
// Network-line background: a grid of nodes connected by lines that draw in
// and settle into a slow pulse - the one deliberate motion moment for this
// hero (not scattered fade-ins on every element). Evokes network
// infrastructure - literal connection lines forming, not generic particles.
// Fixed positions (not randomized) so server and client render identically
// and the layout never shifts between renders.
// ---------------------------------------------------------------------------
type Node = { x: number; y: number }
type Edge = [number, number]

const NODES: Node[] = [
  { x: 6, y: 18 }, { x: 22, y: 10 }, { x: 38, y: 22 }, { x: 30, y: 42 },
  { x: 52, y: 14 }, { x: 62, y: 34 }, { x: 46, y: 52 }, { x: 74, y: 20 },
  { x: 86, y: 40 }, { x: 68, y: 58 }, { x: 90, y: 70 }, { x: 78, y: 82 },
  { x: 54, y: 74 }, { x: 34, y: 66 }, { x: 14, y: 78 }, { x: 8, y: 52 },
]

const EDGES: Edge[] = [
  [0, 1], [1, 2], [2, 3], [0, 3], [2, 4], [4, 5], [5, 6], [3, 6],
  [4, 7], [7, 8], [5, 9], [8, 9], [9, 10], [10, 11], [9, 12], [11, 12],
  [6, 12], [12, 13], [3, 13], [13, 14], [13, 6], [14, 15], [0, 15], [15, 3],
]

function NetworkBackground({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      {EDGES.map(([a, b], i) => {
        const n1 = NODES[a]
        const n2 = NODES[b]
        return (
          <motion.line
            key={`e-${i}`}
            x1={n1.x}
            y1={n1.y}
            x2={n2.x}
            y2={n2.y}
            stroke={CORAL}
            strokeWidth={0.15}
            strokeOpacity={0.35}
            initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 1.1, delay: 0.5 + i * 0.045, ease: 'easeOut' }}
          />
        )
      })}
      {NODES.map((n, i) => (
        <motion.circle
          key={`n-${i}`}
          cx={n.x}
          cy={n.y}
          r={0.55}
          fill={CORAL}
          initial={reduceMotion ? { opacity: 0.7, scale: 1 } : { opacity: 0, scale: 0 }}
          animate={
            reduceMotion
              ? { opacity: 0.7, scale: 1 }
              : { opacity: [0, 0.9, 0.55], scale: [0, 1.3, 1] }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 1.6, delay: 0.4 + i * 0.05, ease: 'easeOut' }
          }
        />
      ))}
      {!reduceMotion &&
        NODES.map((n, i) => (
          <motion.circle
            key={`p-${i}`}
            cx={n.x}
            cy={n.y}
            r={0.55}
            fill="none"
            stroke={CORAL}
            strokeWidth={0.12}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0.5, 0], scale: [1, 3.2] }}
            transition={{
              duration: 3,
              delay: 2 + i * 0.35,
              repeat: Infinity,
              repeatDelay: NODES.length * 0.35,
              ease: 'easeOut',
            }}
          />
        ))}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Stat counters - plain numbers, no card chrome. Count up once when
// scrolled into view.
// ---------------------------------------------------------------------------
const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 30, suffix: '+', label: 'Experienced Professionals' },
  { value: 50, suffix: '+', label: 'Technology Partners' },
  { value: 1500, suffix: '+', label: 'Projects Delivered' },
  { value: 400, suffix: '+', label: 'Satisfied Customers' },
]

function StatCounter({
  value,
  suffix,
  label,
  reduceMotion,
  delay,
}: {
  value: number
  suffix: string
  label: string
  reduceMotion: boolean
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (!inView || reduceMotion) return
    const duration = 1200
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduceMotion, value])

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : delay, ease: 'easeOut' }}
    >
      <div className="font-sans text-3xl font-bold tabular-nums text-white sm:text-4xl">
        {display.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1 text-sm font-normal text-white/55">{label}</div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
const contentVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.15 + i * 0.09, ease: 'easeOut' },
  }),
}

export const HighImpactHero: React.FC<Page['hero']> = ({ links, HeroText, subText }) => {
  const reduceMotion = Boolean(useReducedMotion())
  const sectionRef = useRef<HTMLElement>(null)

  // Scroll-linked background: as the visitor scrolls past the hero, the
  // network pattern drifts and settles rather than just disappearing -
  // one continuous, orchestrated motion tied to scroll position instead of
  // a second unrelated animation.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60])
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.35])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: INK }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={reduceMotion ? undefined : { y: bgY, opacity: bgOpacity }}
      >
        <NetworkBackground reduceMotion={reduceMotion} />
      </motion.div>
      {/* Soft vignette so left-aligned text always sits on a readable, even
          field regardless of where the network lines happen to be dense. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(100deg, ${INK} 0%, ${INK}f2 32%, ${INK}b3 60%, ${INK}66 100%)` }}
      />

      <div className="relative z-10 flex min-h-[calc(100vh-100px)] w-full flex-col justify-center sm:min-h-[calc(100vh-116px)]">
        <div className="container mx-auto px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <motion.p
              custom={0}
              initial={reduceMotion ? 'show' : 'hidden'}
              animate="show"
              variants={contentVariants}
              className="text-sm font-medium tracking-wide"
              style={{ color: CORAL }}
            >
              IT Solutions & Technology Services
            </motion.p>

            <motion.h1
              custom={1}
              initial={reduceMotion ? 'show' : 'hidden'}
              animate="show"
              variants={contentVariants}
              className="font-mechano mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              {HeroText}
            </motion.h1>

            {subText && (
              <motion.p
                custom={2}
                initial={reduceMotion ? 'show' : 'hidden'}
                animate="show"
                variants={contentVariants}
                className="mt-5 max-w-xl text-base font-normal leading-relaxed text-white/65 md:text-lg"
              >
                {subText}
              </motion.p>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <motion.div
                custom={3}
                initial={reduceMotion ? 'show' : 'hidden'}
                animate="show"
                variants={contentVariants}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                {links.map(({ link }, i) => {
                  const isPrimary = link.appearance !== 'outline'
                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      size="lg"
                      appearance={isPrimary ? 'default' : 'outline'}
                      className={
                        isPrimary
                          ? 'w-full !border-0 !bg-[#E13F4C] !text-white hover:!bg-[#c9313d] sm:w-auto'
                          : 'w-full !border-white/25 !bg-transparent !text-white hover:!bg-white/10 sm:w-auto'
                      }
                    />
                  )
                })}
              </motion.div>
            )}

            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4 sm:gap-x-10">
              {STATS.map((stat, i) => (
                <StatCounter
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  reduceMotion={reduceMotion}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
