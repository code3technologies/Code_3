import type { ParameterListBlock as ParameterListBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & ParameterListBlockProps

// A borderless reference list — term on the left with a red rule, description
// on the right, hairline dividers between rows. No cards, no icons: a
// deliberately plainer, more editorial treatment.
export const ParameterListBlock: React.FC<Props> = ({ className, badge, title, intro, items = [], ctaLabel, ctaUrl }) => {
  const safeItems = items || []
  if (safeItems.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {intro && <p className="mt-2 text-gray-600 leading-relaxed">{intro}</p>}
        </Reveal>

        <Reveal delayMs={100} className="mx-auto max-w-3xl divide-y divide-border border-y border-border">
          {safeItems.map((item, index) => (
            <div
              key={item.id || index}
              className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[220px_1fr]"
            >
              <div className="flex items-start">
                <span className="border-l-2 border-primary_red pl-3 text-sm font-bold uppercase tracking-wide text-foreground">
                  {item.term}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 sm:pt-px">{item.description}</p>
            </div>
          ))}
        </Reveal>

        {ctaLabel && ctaUrl && (
          <div className="mt-8 flex justify-center">
            <Link
              href={ctaUrl}
              className="group inline-flex items-center gap-2.5 rounded-full bg-primary_red px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary_red/20 transition-all duration-300 hover:scale-[1.03] hover:bg-secondary_red"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
