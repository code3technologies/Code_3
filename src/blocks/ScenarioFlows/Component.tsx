import type { ScenarioFlowsBlock as ScenarioFlowsBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ServiceIcon } from '@/components/site/icons'

type Props = {
  className?: string
} & ScenarioFlowsBlockProps

export const ScenarioFlowsBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  scenarios = [],
  ctaLabel,
  ctaUrl,
}) => {
  const safeScenarios = scenarios || []
  if (safeScenarios.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-6 max-w-2xl text-center md:mb-7">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal delayMs={100} className="mx-auto flex max-w-4xl flex-col gap-4">
          {safeScenarios.map((scenario, index) => {
            const steps = scenario.steps || []
            return (
              <div
                key={scenario.id || index}
                className="rounded-2xl border border-border bg-gray-50/60 p-5 transition-all duration-300 hover:border-primary_red/30 hover:shadow-md md:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary_red text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-semibold text-foreground">{scenario.label}</h3>
                </div>
                <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1">
                  {steps.map((step, stepIndex) => (
                    <span key={step.id || stepIndex} className="inline-flex flex-none items-center gap-2">
                      {stepIndex > 0 && (
                        <ArrowRight className="h-3.5 w-3.5 flex-none text-primary_red/40" strokeWidth={2.5} />
                      )}
                      <span className="inline-flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full border border-primary_red/20 bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                        {step.icon && (
                          <span className="flex h-4 w-4 flex-none items-center justify-center text-primary_red">
                            <ServiceIcon preset={step.icon} className="h-3.5 w-3.5" />
                          </span>
                        )}
                        {step.text}
                      </span>
                    </span>
                  ))}
                </div>
                {scenario.description && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">{scenario.description}</p>
                )}
              </div>
            )
          })}
        </Reveal>

        {ctaLabel && ctaUrl && (
          <div className="mt-6 flex justify-center md:mt-7">
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
