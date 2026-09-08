import type { ComparisonTableBlock as ComparisonTableBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & ComparisonTableBlockProps

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5 flex-none">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function DashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5 flex-none">
      <path d="M5 12h14" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5 flex-none">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export const ComparisonTableBlock: React.FC<Props> = ({
  badge,
  className,
  title,
  subtitle,
  leftLabel,
  middleEnabled,
  middleLabel,
  rightLabel,
  rows = [],
  leftItems = [],
  rightItems = [],
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  // Independent lists (different lengths) take priority when present;
  // otherwise fall back to the original paired-rows layout.
  const safeRows = rows || []
  const hasIndependentLists = (leftItems && leftItems.length > 0) || (rightItems && rightItems.length > 0)
  const safeLeftItems = hasIndependentLists ? leftItems || [] : safeRows.map((row) => ({ id: row.id, text: row.left }))
  const safeRightItems = hasIndependentLists ? rightItems || [] : safeRows.map((row) => ({ id: row.id, text: row.right }))

  if (!hasIndependentLists && safeRows.length === 0) return null
  const showMiddle = Boolean(!hasIndependentLists && middleEnabled && middleLabel)

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
          className={cn(
            'grid grid-cols-1 gap-4 md:gap-0 md:rounded-2xl md:overflow-hidden md:shadow-lg',
            showMiddle ? 'md:grid-cols-3' : 'md:grid-cols-2',
          )}
        >
          {/* Left - muted (worst option) */}
          <div className="rounded-2xl bg-gray-100 p-6 md:rounded-none md:p-8">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-gray-500">{leftLabel}</h3>
            <ul className="space-y-4">
              {safeLeftItems.map((item, index) => (
                <li key={item.id || index} className="flex items-start gap-3 text-sm text-gray-500">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gray-300 text-gray-600">
                    <XIcon />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Middle - partial credit (optional, paired-rows mode only) */}
          {showMiddle && (
            <div className="rounded-2xl bg-amber-50 p-6 md:rounded-none md:p-8">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-amber-700">{middleLabel}</h3>
              <ul className="space-y-4">
                {safeRows.map((row, index) => (
                  <li key={row.id || index} className="flex items-start gap-3 text-sm text-amber-800">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amber-200 text-amber-700">
                      <DashIcon />
                    </span>
                    {row.middle}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Right - CODE3 (bold red, best option) */}
          <div className="rounded-2xl bg-primary_red p-6 md:rounded-none md:p-8">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-white/80">{rightLabel}</h3>
            <ul className="space-y-4">
              {safeRightItems.map((item, index) => (
                <li key={item.id || index} className="flex items-start gap-3 text-sm font-medium text-white">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white text-primary_red">
                    <CheckIcon />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {ctaText && ctaLabel && ctaUrl && (
          <div className="mt-8 flex flex-col items-center gap-3 text-center md:mt-10">
            <p className="text-sm font-medium text-gray-600">{ctaText}</p>
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 rounded-full bg-primary_red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
