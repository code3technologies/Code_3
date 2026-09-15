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

        {/* Escalation ladder - a connected vertical line from most urgent (top) to least urgent (bottom) */}
        <div className="relative pl-9 md:pl-11">
          <div
            className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-red-500 via-amber-500 to-blue-500 opacity-30 md:left-[15px]"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {rows.map((row, index) => {
              const styles = severityStyles[row.severity || 'blue']
              const SeverityIcon = styles.icon
              const examples = row.impactExamples || []
              return (
                <Reveal key={row.id || index} delayMs={100 + index * 110} className="relative">
                  <div
                    className={cn(
                      'absolute -left-9 top-1 flex h-[26px] w-[26px] items-center justify-center rounded-full ring-4 ring-white md:-left-11',
                      styles.bar,
                    )}
                  >
                    {row.severity === 'red' ? (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                      </span>
                    ) : (
                      <SeverityIcon className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>

                  <div className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg md:p-6">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                        styles.pill,
                      )}
                    >
                      {row.priority} Priority
                    </span>

                    <p className="mt-3 text-base font-bold text-foreground">{row.impact}</p>
                    {examples.length > 0 && (
                      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                        {examples.map((ex, exIndex) => (
                          <li key={ex.id || exIndex} className="flex items-start gap-1.5 text-xs leading-relaxed text-gray-500">
                            <span className={cn('mt-1.5 h-1 w-1 flex-none rounded-full', styles.bar)} />
                            {ex.text}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-5 border-t border-black/5 pt-4 sm:grid-cols-3">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                            <Headset className="h-3 w-3" /> Remote Support
                          </div>
                          {row.helpdeskAvailability && (
                            <span className="text-[10px] font-semibold text-gray-400">{row.helpdeskAvailability}</span>
                          )}
                        </div>
                        <span
                          className={cn(
                            'mt-1.5 inline-flex w-fit items-center rounded-lg px-2.5 py-1 text-base font-bold',
                            styles.chip,
                          )}
                        >
                          {row.remoteSupportTime}
                        </span>
                        {row.remoteSupportNote && <p className="mt-1.5 text-xs leading-snug text-gray-500">{row.remoteSupportNote}</p>}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                          <MapPinned className="h-3 w-3" /> Onsite Support
                        </div>
                        <span
                          className={cn(
                            'mt-1.5 inline-flex w-fit items-center rounded-lg px-2.5 py-1 text-base font-bold',
                            styles.chip,
                          )}
                        >
                          {row.onsiteSupportTime}
                        </span>
                        {row.onsiteSupportNote && <p className="mt-1.5 text-xs leading-snug text-gray-500">{row.onsiteSupportNote}</p>}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                          <TimerReset className="h-3 w-3" /> Target Resolution
                        </div>
                        <span
                          className={cn(
                            'mt-1.5 inline-flex w-fit items-center rounded-lg px-2.5 py-1 text-base font-bold',
                            styles.chip,
                          )}
                        >
                          {row.resolutionTarget}
                        </span>
                        {row.resolutionApproach && <p className="mt-1.5 text-xs leading-snug text-gray-500">{row.resolutionApproach}</p>}
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-8" />
      </div>
    </section>
  )
}
