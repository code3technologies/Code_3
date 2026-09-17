'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { DeliveryProcessBlock as DeliveryProcessBlockProps } from 'src/payload-types'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { CtaButton } from '@/components/site/CtaButton'

type Props = {
  className?: string
} & DeliveryProcessBlockProps

type StepItem = NonNullable<DeliveryProcessBlockProps['steps']>[number]

function StepLabel({ step, index }: { step: StepItem; index: number }) {
  return step.stepLabel || `STEP ${String(index + 1).padStart(2, '0')}`
}

export const DeliveryProcessBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  description,
  steps = [],
  ctaText,
  ctaLabel,
  ctaUrl,
  ctaLabel2,
  ctaUrl2,
}) => {
  const safeSteps = steps || []
  const timelineRef = useRef<HTMLDivElement>(null)
  const [timelineInView, setTimelineInView] = useState(false)

  useEffect(() => {
    const el = timelineRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimelineInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (safeSteps.length === 0) return null

  return (
    <section className={cn('bg-white py-8 md:py-10', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-4xl mb-16">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-gray-600">{description}</p>
          )}
        </Reveal>

        <div ref={timelineRef}>
          {/* Desktop: horizontal timeline */}
          <div className="hidden md:flex items-start">
            {safeSteps.map((step, index) => (
              <Reveal
                key={step.id || index}
                delayMs={index * 100}
                className="relative flex-1 px-4 text-left first:pl-0 last:pr-0"
              >
                <div className="mb-6 flex items-center">
                  <div className="relative z-[1] h-3.5 w-3.5 flex-none rounded-full border-[3px] border-primary_red bg-white" />
                  {index < safeSteps.length - 1 && (
                    <div className="relative h-0.5 flex-1 overflow-hidden bg-border">
                      <div
                        className="absolute inset-y-0 left-0 w-full origin-left bg-primary_red transition-transform duration-700 ease-out"
                        style={{
                          transform: timelineInView ? 'scaleX(1)' : 'scaleX(0)',
                          transitionDelay: `${200 + index * 150}ms`,
                        }}
                      />
                    </div>
                  )}
                </div>
                <span className="mb-2 block text-xs font-semibold tracking-wider text-primary_red">
                  <StepLabel step={step} index={index} />
                </span>
                <h3 className="mb-2 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
              </Reveal>
            ))}
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden relative">
            <div className="absolute left-[6px] top-2 bottom-2 w-0.5 overflow-hidden bg-border">
              <div
                className="absolute inset-x-0 top-0 h-full w-full origin-top bg-primary_red transition-transform duration-[1200ms] ease-out"
                style={{ transform: timelineInView ? 'scaleY(1)' : 'scaleY(0)' }}
              />
            </div>
            <div className="space-y-8">
              {safeSteps.map((step, index) => (
                <Reveal key={step.id || index} delayMs={index * 80} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 h-3.5 w-3.5 flex-none rounded-full border-[3px] border-primary_red bg-white" />
                  <span className="mb-1 block text-xs font-semibold tracking-wider text-primary_red">
                    <StepLabel step={step} index={index} />
                  </span>
                  <h3 className="mb-1 text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {ctaLabel2 && ctaUrl2 ? (
          ctaLabel && ctaUrl && (
            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary_red/20 bg-primary_red/5 px-6 py-5 sm:flex-row">
              {ctaText && <p className="text-sm font-medium text-foreground sm:text-base">{ctaText}</p>}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={ctaUrl}
                  className="group inline-flex flex-none items-center gap-2.5 rounded-full bg-primary_red px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary_red/20 transition-all duration-300 hover:scale-[1.03] hover:bg-secondary_red hover:shadow-lg hover:shadow-primary_red/30 active:scale-[0.98]"
                >
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4 flex-none transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href={ctaUrl2}
                  className="group inline-flex flex-none items-center gap-2.5 rounded-full border border-primary_red px-6 py-3.5 text-sm font-semibold text-primary_red transition-all duration-300 hover:bg-[#FDEBEC]"
                >
                  {ctaLabel2}
                  <ArrowRight className="h-4 w-4 flex-none transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          )
        ) : (
          <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-10" />
        )}
      </div>
    </section>
  )
}
