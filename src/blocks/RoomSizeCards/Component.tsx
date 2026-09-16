import type { RoomSizeCardsBlock as RoomSizeCardsBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { CtaButton } from '@/components/site/CtaButton'

type Props = {
  className?: string
} & RoomSizeCardsBlockProps

const GRID_COLS: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2',
  5: 'sm:grid-cols-2 lg:grid-cols-5',
  6: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}

// Pricing-tier style color ramp: white -> light red -> brand red -> dark red,
// so card background itself carries the small-to-large progression.
const STOPS: [number, number, number][] = [
  [255, 255, 255],
  [252, 205, 209],
  [223, 51, 65],
  [109, 11, 18],
]

function colorAtProgress(progress: number): [number, number, number] {
  const segments = STOPS.length - 1
  const scaled = Math.min(Math.max(progress, 0), 1) * segments
  const idx = Math.min(Math.floor(scaled), segments - 1)
  const localT = scaled - idx
  const [r1, g1, b1] = STOPS[idx]
  const [r2, g2, b2] = STOPS[idx + 1]
  return [Math.round(r1 + (r2 - r1) * localT), Math.round(g1 + (g2 - g1) * localT), Math.round(b1 + (b2 - b1) * localT)]
}

function luminance([r, g, b]: [number, number, number]) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

function CableIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M4 9a2 2 0 002 2h1a2 2 0 002-2V4M17 9a2 2 0 01-2 2h-1a2 2 0 01-2-2V4M9 14a2 2 0 002 2h2a2 2 0 002-2M12 16v4" />
    </svg>
  )
}

function NetworkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v6M12 13l-6 4M12 13l6 4" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M5 12.5a11 11 0 0114 0M8 16a6.5 6.5 0 018 0" />
      <circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ServerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  )
}

const ICONS: Record<string, () => React.JSX.Element> = {
  users: UsersIcon,
  cable: CableIcon,
  network: NetworkIcon,
  wifi: WifiIcon,
  server: ServerIcon,
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-none transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        d="M3.333 8h9.334M8.667 3.667L13 8l-4.333 4.333"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const RoomSizeCardsBlock: React.FC<Props> = ({
  badge,
  className,
  title,
  subtitle,
  unitLabel,
  icon,
  tiers = [],
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  if (!tiers || tiers.length === 0) return null
  const Icon = ICONS[icon || 'users'] || UsersIcon
  const safeUnitLabel = unitLabel || 'People'

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-6">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal
          delayMs={100}
          className={cn('grid grid-cols-1 gap-4', GRID_COLS[tiers.length] || 'sm:grid-cols-2 lg:grid-cols-4')}
        >
          {tiers.map((tier, index) => {
            const progress = tiers.length > 1 ? index / (tiers.length - 1) : 1
            const capacityLabel =
              tier.valueLabel || (tier.maxCapacity ? `${tier.minCapacity}-${tier.maxCapacity}` : `${tier.minCapacity}+`)

            const rgb = colorAtProgress(progress)
            const isDark = luminance(rgb) < 140
            const bgColor = `rgb(${rgb.join(',')})`

            const iconBg = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(223,51,65,0.12)'
            const iconColor = isDark ? '#fff' : 'rgb(223,51,65)'
            const labelColor = isDark ? 'rgba(255,255,255,0.65)' : undefined
            const descColor = isDark ? 'rgba(255,255,255,0.8)' : undefined
            const arrowColor = isDark ? '#fff' : 'rgb(223,51,65)'
            const titleClassName = isDark ? 'text-white' : 'text-foreground'

            const cardClassName = cn(
              'group flex flex-col rounded-2xl p-5 shadow-sm transition-all duration-300',
              !isDark && 'border border-border',
              tier.url && 'hover:-translate-y-1 hover:shadow-xl',
            )

            const cardBody = (
              <>
                <span
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full"
                  style={{ backgroundColor: iconBg, color: iconColor }}
                >
                  <Icon />
                </span>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className={cn('text-3xl font-bold tracking-tight', isDark ? 'text-white' : 'text-foreground')}>
                    {capacityLabel}
                  </span>
                  <span
                    className={cn('text-xs font-semibold uppercase tracking-wide', !isDark && 'text-gray-400')}
                    style={labelColor ? { color: labelColor } : undefined}
                  >
                    {safeUnitLabel}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-1.5">
                  <h3 className={cn('text-base font-semibold', titleClassName)}>{tier.label}</h3>
                  {tier.url && (
                    <span style={{ color: arrowColor }}>
                      <ArrowIcon />
                    </span>
                  )}
                </div>
                <p
                  className={cn('mt-1.5 text-sm leading-relaxed', !isDark && 'text-gray-600')}
                  style={descColor ? { color: descColor } : undefined}
                >
                  {tier.description}
                </p>
              </>
            )

            if (tier.url) {
              return (
                <Link key={tier.id || index} href={tier.url} className={cardClassName} style={{ backgroundColor: bgColor }}>
                  {cardBody}
                </Link>
              )
            }

            return (
              <div key={tier.id || index} className={cardClassName} style={{ backgroundColor: bgColor }}>
                {cardBody}
              </div>
            )
          })}
        </Reveal>

        <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-6" />
      </div>
    </section>
  )
}
