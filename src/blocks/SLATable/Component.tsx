import type { SLATableBlock as SLATableBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { CtaButton } from '@/components/site/CtaButton'

type Props = {
  className?: string
} & SLATableBlockProps

const severityStyles = {
  red: {
    border: 'border-l-red-500',
    bar: 'bg-red-500',
    pill: 'bg-red-500 text-white',
    stat: 'text-red-600',
    rowBg: 'bg-red-50/40',
  },
  amber: {
    border: 'border-l-amber-500',
    bar: 'bg-amber-500',
    pill: 'bg-amber-500 text-white',
    stat: 'text-amber-600',
    rowBg: 'bg-amber-50/40',
  },
  blue: {
    border: 'border-l-blue-500',
    bar: 'bg-blue-500',
    pill: 'bg-blue-500 text-white',
    stat: 'text-blue-600',
    rowBg: 'bg-blue-50/40',
  },
  green: {
    border: 'border-l-green-500',
    bar: 'bg-green-500',
    pill: 'bg-green-500 text-white',
    stat: 'text-green-600',
    rowBg: 'bg-green-50/40',
  },
} as const

export const SLATableBlock: React.FC<Props> = ({
  badge,
  className,
  title,
  subtitle,
  rows = [],
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  if (!rows || rows.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-6">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        {/* Desktop: full table with impact examples and resolution approach */}
        <Reveal delayMs={100} className="hidden overflow-hidden rounded-2xl border border-border shadow-sm md:block">
          <div className="overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-[110px_1.4fr_0.8fr_0.8fr_1.4fr] bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
              <div className="px-4 py-3">Priority</div>
              <div className="px-4 py-3">Business Impact</div>
              <div className="px-4 py-3">Remote Support</div>
              <div className="px-4 py-3">Onsite Support</div>
              <div className="px-4 py-3">Target Resolution</div>
            </div>

            {rows.map((row, index) => {
              const styles = severityStyles[row.severity || 'blue']
              const examples = row.impactExamples || []
              const isLast = index === rows.length - 1
              return (
                <div
                  key={row.id || index}
                  className={cn(
                    'grid min-w-[900px] grid-cols-[110px_1.4fr_0.8fr_0.8fr_1.4fr] border-l-4 border-t border-border',
                    styles.border,
                    styles.rowBg,
                    isLast && 'rounded-b-2xl',
                  )}
                >
                  <div className="flex items-start px-4 py-4">
                    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide', styles.pill)}>
                      {row.priority}
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <div className="text-sm font-semibold text-foreground">{row.impact}</div>
                    {examples.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {examples.map((ex, exIndex) => (
                          <li key={ex.id || exIndex} className="text-xs leading-relaxed text-gray-500">
                            {ex.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-4 py-4">
                    <div className={cn('text-sm font-bold', styles.stat)}>{row.remoteSupportTime}</div>
                    <div className="mt-0.5 text-xs text-gray-500">{row.helpdeskAvailability}</div>
                    {row.remoteSupportNote && (
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{row.remoteSupportNote}</p>
                    )}
                  </div>
                  <div className="px-4 py-4">
                    <div className={cn('text-sm font-bold', styles.stat)}>{row.onsiteSupportTime}</div>
                    {row.onsiteSupportNote && (
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{row.onsiteSupportNote}</p>
                    )}
                  </div>
                  <div className="px-4 py-4">
                    <div className="text-sm font-semibold text-foreground">{row.resolutionTarget}</div>
                    {row.resolutionApproach && (
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{row.resolutionApproach}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>

        {/* Mobile: stacked cards */}
        <Reveal delayMs={100} className="grid grid-cols-1 gap-5 md:hidden">
          {rows.map((row, index) => {
            const styles = severityStyles[row.severity || 'blue']
            const examples = row.impactExamples || []
            return (
              <div
                key={row.id || index}
                className={cn('relative overflow-hidden rounded-2xl border border-border pl-6 p-5 shadow-sm', styles.rowBg)}
              >
                <div className={cn('absolute inset-y-0 left-0 w-1.5', styles.bar)} />

                <span className={cn('inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide', styles.pill)}>
                  {row.priority} Priority
                </span>

                <p className="mt-3 text-sm font-semibold text-foreground">{row.impact}</p>
                {examples.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {examples.map((ex, exIndex) => (
                      <li key={ex.id || exIndex} className="text-xs leading-relaxed text-gray-500">
                        • {ex.text}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-black/5 pt-4">
                  <div>
                    <div className={cn('text-2xl font-bold', styles.stat)}>{row.remoteSupportTime}</div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Remote Support</div>
                    {row.remoteSupportNote && (
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{row.remoteSupportNote}</p>
                    )}
                  </div>
                  <div>
                    <div className={cn('text-2xl font-bold', styles.stat)}>{row.onsiteSupportTime}</div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Onsite Support</div>
                    {row.onsiteSupportNote && (
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{row.onsiteSupportNote}</p>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{row.helpdeskAvailability}</div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Helpdesk</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{row.resolutionTarget}</div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Resolution</div>
                  </div>
                </div>
                {row.resolutionApproach && (
                  <p className="mt-3 border-t border-black/5 pt-3 text-xs leading-relaxed text-gray-500">{row.resolutionApproach}</p>
                )}
              </div>
            )
          })}
        </Reveal>

        <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-6" />
      </div>
    </section>
  )
}
