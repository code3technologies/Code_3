import type { ProcessTimelineBlock as ProcessTimelineBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import Link from 'next/link'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ServiceIcon } from '@/components/site/icons'

type Props = {
  className?: string
} & ProcessTimelineBlockProps

export const ProcessTimelineBlock: React.FC<Props> = ({
  badge,
  className,
  title,
  subtitle,
  startLabel,
  emphasizeFinalStep,
  steps = [],
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  if (!steps || steps.length === 0) return null

  const columnCount = steps.length + (startLabel ? 1 : 0)

  const markerClassName = (filled: boolean) =>
    cn(
      'relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 text-sm font-bold shadow-[0_0_0_6px_white]',
      filled ? 'border-primary_red bg-primary_red text-white' : 'border-primary_red bg-white text-primary_red',
    )

  // A step with an icon set shows that icon instead of its plain number -
  // lets a milestone-style timeline (e.g. "Our Journey") match the
  // icon-forward language used everywhere else on the site, while a
  // step with no icon (every existing use of this block) renders exactly
  // as before.
  const StepMarker = ({ step, index, filled }: { step: (typeof steps)[number]; index: number; filled: boolean }) => (
    <div className={markerClassName(filled)}>
      {step.icon ? <ServiceIcon preset={step.icon} className="h-4 w-4" /> : index + 1}
    </div>
  )

  return (
    <section className={cn('bg-white py-14 md:py-20', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal delayMs={100}>
          {/* Desktop: horizontal connected timeline */}
          <div className="relative hidden md:block">
            <div className="absolute left-0 right-0 top-5 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="grid" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
              {startLabel && (
                <div className="relative px-4 text-center first:pl-0">
                  <div className="relative z-10 mx-auto flex h-10 items-center justify-center">
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-600 shadow-[0_0_0_6px_white]">
                      {startLabel}
                    </span>
                  </div>
                </div>
              )}
              {steps.map((step, index) => (
                <div key={step.id || index} className="relative px-4 text-center last:pr-0">
                  <StepMarker step={step} index={index} filled={!!emphasizeFinalStep && index === steps.length - 1} />
                  <h3 className="mt-5 text-base font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical connected timeline */}
          <div className="relative md:hidden">
            <div className="absolute bottom-0 left-5 top-5 w-[2px] bg-border" />
            <div className="space-y-8">
              {startLabel && (
                <div className="relative flex items-center gap-4">
                  <div className="relative z-10 flex h-10 w-10 flex-none items-center justify-center">
                    <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-600 shadow-[0_0_0_6px_white]">
                      {startLabel}
                    </span>
                  </div>
                </div>
              )}
              {steps.map((step, index) => (
                <div key={step.id || index} className="relative flex gap-4 pl-0">
                  <StepMarker step={step} index={index} filled={!!emphasizeFinalStep && index === steps.length - 1} />
                  <div className="pt-1.5">
                    <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {ctaText && ctaLabel && ctaUrl && (
            <div className="mt-12 flex flex-col items-center gap-3 text-center md:mt-16">
              <p className="text-sm font-medium text-gray-600">{ctaText}</p>
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 rounded-full bg-primary_red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                {ctaLabel}
              </Link>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
