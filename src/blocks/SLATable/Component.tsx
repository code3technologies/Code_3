import type { SLATableBlock as SLATableBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { AlertTriangle, CircleGauge, Headset, MapPinned, TimerReset, Info } from 'lucide-react'
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
    chip: 'bg-red-100 text-red-700',
    rowBg: 'bg-red-50/40',
    glow: 'shadow-[inset_0_0_0_1px_rgba(239,68,68,0.15)]',
    icon: AlertTriangle,
  },
  amber: {
    border: 'border-l-amber-500',
    bar: 'bg-amber-500',
    pill: 'bg-amber-500 text-white',
    stat: 'text-amber-600',
    chip: 'bg-amber-100 text-amber-700',
    rowBg: 'bg-amber-50/40',
    glow: '',
    icon: TimerReset,
  },
  blue: {
    border: 'border-l-blue-500',
    bar: 'bg-blue-500',
    pill: 'bg-blue-500 text-white',
    stat: 'text-blue-600',
    chip: 'bg-blue-100 text-blue-700',
    rowBg: 'bg-blue-50/40',
    glow: '',
    icon: Info,
  },
  green: {
    border: 'border-l-green-500',
    bar: 'bg-green-500',
    pill: 'bg-green-500 text-white',
    stat: 'text-green-600',
    chip: 'bg-green-100 text-green-700',
    rowBg: 'bg-green-50/40',
    glow: '',
    icon: Info,
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
            <div className="grid min-w-[900px] grid-cols-[110px_1.4fr_0.8fr_0.8fr_1.4fr] bg-slate-900 text-xs font-bold uppercase tracking-wide text-white/70">
              <div className="flex items-center gap-1.5 px-4 py-3.5">
                <CircleGauge className="h-3.5 w-3.5" /> Priority
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Business Impact
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3.5">
                <Headset className="h-3.5 w-3.5" /> Remote Support
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3.5">
                <MapPinned className="h-3.5 w-3.5" /> Onsite Support
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3.5">
                <TimerReset className="h-3.5 w-3.5" /> Target Resolution
              </div>
            </div>

            {rows.map((row, index) => {
              const styles = severityStyles[row.severity || 'blue']
              const SeverityIcon = styles.icon
              const examples = row.impactExamples || []
              const isLast = index === rows.length - 1
              return (
                <Reveal
                  key={row.id || index}
                  delayMs={150 + index * 90}
                  className={cn(
                    'grid min-w-[900px] grid-cols-[110px_1.4fr_0.8fr_0.8fr_1.4fr] border-l-[6px] border-t border-border transition-all duration-300 hover:z-10 hover:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.16)] hover:brightness-[0.99]',
                    styles.border,
                    styles.rowBg,
                    styles.glow,
                    isLast && 'rounded-b-2xl',
                  )}
                >
                  <div className="flex items-start px-4 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm',
                        styles.pill,
                      )}
                    >
                      {row.severity === 'red' ? (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                      ) : (
                        <SeverityIcon className="h-3 w-3" />
                      )}
                      {row.priority}
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <div className="text-sm font-semibold text-foreground">{row.impact}</div>
                    {examples.length > 0 && (
                      <ul className="mt-2 space-y-1.5">
                        {examples.map((ex, exIndex) => (
                          <li key={ex.id || exIndex} className="flex items-start gap-1.5 text-xs leading-relaxed text-gray-500">
                            <span className={cn('mt-1.5 h-1 w-1 flex-none rounded-full', styles.bar)} />
                            {ex.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-4 py-4">
                    <span className={cn('inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold', styles.chip)}>
                      {row.remoteSupportTime}
                    </span>
                    <div className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">{row.helpdeskAvailability}</div>
                    {row.remoteSupportNote && (
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{row.remoteSupportNote}</p>
                    )}
                  </div>
                  <div className="px-4 py-4">
                    <span className={cn('inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold', styles.chip)}>
                      {row.onsiteSupportTime}
                    </span>
                    {row.onsiteSupportNote && (
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{row.onsiteSupportNote}</p>
                    )}
                  </div>
                  <div className="px-4 py-4">
                    <div className="text-sm font-bold text-foreground">{row.resolutionTarget}</div>
                    {row.resolutionApproach && (
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{row.resolutionApproach}</p>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Reveal>

        {/* Mobile: stacked cards */}
        <div className="grid grid-cols-1 gap-5 md:hidden">
          {rows.map((row, index) => {
            const styles = severityStyles[row.severity || 'blue']
            const SeverityIcon = styles.icon
            const examples = row.impactExamples || []
            return (
              <Reveal
                key={row.id || index}
                delayMs={100 + index * 90}
                className={cn(
                  'relative overflow-hidden rounded-2xl border border-border pl-6 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
                  styles.rowBg,
                  styles.glow,
                )}
              >
                <div className={cn('absolute inset-y-0 left-0 w-2', styles.bar)} />

                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm',
                    styles.pill,
                  )}
                >
                  {row.severity === 'red' ? (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  ) : (
                    <SeverityIcon className="h-3 w-3" />
                  )}
                  {row.priority} Priority
                </span>

                <p className="mt-3 text-sm font-semibold text-foreground">{row.impact}</p>
                {examples.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {examples.map((ex, exIndex) => (
                      <li key={ex.id || exIndex} className="flex items-start gap-1.5 text-xs leading-relaxed text-gray-500">
                        <span className={cn('mt-1.5 h-1 w-1 flex-none rounded-full', styles.bar)} />
                        {ex.text}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-black/5 pt-4">
                  <div>
                    <span className={cn('inline-flex items-center rounded-lg px-2.5 py-1 text-lg font-bold', styles.chip)}>
                      {row.remoteSupportTime}
                    </span>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">Remote Support</div>
                    {row.remoteSupportNote && (
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">{row.remoteSupportNote}</p>
                    )}
                  </div>
                  <div>
                    <span className={cn('inline-flex items-center rounded-lg px-2.5 py-1 text-lg font-bold', styles.chip)}>
                      {row.onsiteSupportTime}
                    </span>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">Onsite Support</div>
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
              </Reveal>
            )
          })}
        </div>

        <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-6" />
      </div>
    </section>
  )
}
