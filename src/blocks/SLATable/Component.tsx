import type { SLATableBlock as SLATableBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { AlertTriangle, Headset, MapPinned, TimerReset, Info } from 'lucide-react'
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

        {/* Priority cards - one per severity tier, not a row/column table */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
          {rows.map((row, index) => {
            const styles = severityStyles[row.severity || 'blue']
            const SeverityIcon = styles.icon
            const examples = row.impactExamples || []
            const isFeatured = row.severity === 'red'
            return (
              <Reveal
                key={row.id || index}
                delayMs={100 + index * 110}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                  isFeatured && 'md:-translate-y-2 md:shadow-lg ring-1 ring-red-500/20',
                )}
              >
                {/* Header band */}
                <div className={cn('flex items-center justify-between gap-2 px-5 py-4', styles.bar)}>
                  <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                    {row.severity === 'red' ? (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                      </span>
                    ) : (
                      <SeverityIcon className="h-4 w-4" />
                    )}
                    {row.priority} Priority
                  </span>
                  {isFeatured && (
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Most Urgent
                    </span>
                  )}
                </div>

                <div className={cn('flex flex-1 flex-col gap-5 p-5', styles.rowBg)}>
                  {/* Business impact */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                      <AlertTriangle className="h-3 w-3" /> Business Impact
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-foreground">{row.impact}</p>
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

                  <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                        <Headset className="h-3 w-3" /> Remote
                      </div>
                      <span className={cn('mt-1.5 inline-flex items-center rounded-lg px-2.5 py-1 text-base font-bold', styles.chip)}>
                        {row.remoteSupportTime}
                      </span>
                      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{row.helpdeskAvailability}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                        <MapPinned className="h-3 w-3" /> Onsite
                      </div>
                      <span className={cn('mt-1.5 inline-flex items-center rounded-lg px-2.5 py-1 text-base font-bold', styles.chip)}>
                        {row.onsiteSupportTime}
                      </span>
                    </div>
                  </div>
                  {(row.remoteSupportNote || row.onsiteSupportNote) && (
                    <div className="-mt-3 grid grid-cols-2 gap-4 text-xs leading-relaxed text-gray-500">
                      <p>{row.remoteSupportNote}</p>
                      <p>{row.onsiteSupportNote}</p>
                    </div>
                  )}

                  {/* Target resolution */}
                  <div className="mt-auto border-t border-black/5 pt-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                      <TimerReset className="h-3 w-3" /> Target Resolution
                    </div>
                    <div className={cn('mt-1.5 text-2xl font-extrabold', styles.stat)}>{row.resolutionTarget}</div>
                    {row.resolutionApproach && (
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{row.resolutionApproach}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-8" />
      </div>
    </section>
  )
}
