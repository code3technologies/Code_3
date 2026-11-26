'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/utilities/ui'

export type SideCard = {
  badge?: string | null
  heading: string
  description?: string | null
  linkText?: string | null
  linkHref?: string | null
}

const ROTATE_MS = 5000

const Arrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
)

function CardBody({ card, dark, hidden }: { card: SideCard; dark?: boolean; hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined}>
      {card.badge && (
        <span
          className={cn(
            'text-sm md:text-base font-semibold uppercase tracking-[0.12em]',
            dark ? 'text-red-300' : 'text-primary_red',
          )}
        >
          {card.badge}
        </span>
      )}
      <h2 className={cn('mt-3 text-2xl md:text-3xl font-bold tracking-tight', dark ? 'text-white' : 'text-foreground')}>
        {card.heading}
      </h2>
      {card.description && (
        <p className={cn('mt-4 leading-relaxed', dark ? 'text-white/75' : 'text-gray-600')}>{card.description}</p>
      )}
      {card.linkText && card.linkHref && (
        <a
          href={card.linkHref}
          tabIndex={hidden ? -1 : undefined}
          className={cn(
            'mt-6 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
            dark
              ? 'border-white/20 bg-white/10 text-white hover:border-white/50'
              : 'border-border bg-white text-foreground hover:border-primary_red hover:text-primary_red',
          )}
        >
          {card.linkText}
          <Arrow />
        </a>
      )}
    </div>
  )
}

// The banner's side card. With one card it renders as before; with several it
// becomes a carousel. All cards stay in the HTML (stacked in one grid cell, so
// the box keeps the height of the tallest card and nothing jumps) and only the
// active one is visible. Auto-rotation pauses on hover/focus and is skipped
// for visitors who prefer reduced motion.
export function SideCards({ cards, dark }: { cards: SideCard[]; dark?: boolean }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const many = cards.length > 1

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!many || paused || reduceMotion) return
    const t = setInterval(() => setActive((i) => (i + 1) % cards.length), ROTATE_MS)
    return () => clearInterval(t)
  }, [many, paused, reduceMotion, cards.length])

  const box = cn(
    'rounded-2xl p-8 md:p-10',
    dark ? 'border border-white/15 bg-white/10 backdrop-blur-sm' : 'bg-gray-50',
  )

  if (!many) return <div className={box}>{cards[0] && <CardBody card={cards[0]} dark={dark} />}</div>

  return (
    <div
      className={box}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured services"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid">
        {cards.map((card, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${cards.length}`}
            className={cn(
              '[grid-area:1/1] transition-opacity duration-500',
              i === active ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <CardBody card={card} dark={dark} hidden={i !== active} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2">
        {cards.map((card, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${card.heading}`}
            aria-current={i === active ? 'true' : undefined}
            className={cn(
              'h-2 rounded-full transition-all',
              i === active ? 'w-6' : 'w-2',
              dark
                ? i === active
                  ? 'bg-white'
                  : 'bg-white/35 hover:bg-white/60'
                : i === active
                  ? 'bg-primary_red'
                  : 'bg-gray-300 hover:bg-gray-400',
            )}
          />
        ))}
      </div>
    </div>
  )
}
