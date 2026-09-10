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

// A plain two-column table — factor on the left, what it affects on the
// right, zebra rows, a red header bar. No cards, no icons.
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

        <Reveal
          delayMs={100}
          className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_20px_45px_-24px_rgba(0,0,0,0.16)]"
        >
          <div className="hidden bg-gradient-to-r from-primary_red to-red-700 text-white sm:grid sm:grid-cols-[minmax(140px,220px)_1fr]">
            <div className="px-6 py-3 text-xs font-bold uppercase tracking-wide">Factor</div>
            <div className="border-l border-white/15 px-6 py-3 text-xs font-bold uppercase tracking-wide">
              What it affects
            </div>
          </div>

          {safeItems.map((item, index) => (
            <div
              key={item.id || index}
              className={cn(
                'grid grid-cols-1 border-t border-border sm:grid-cols-[minmax(140px,220px)_1fr]',
                index % 2 === 1 && 'bg-gray-50/70',
              )}
            >
              <div className="px-5 pb-1 pt-4 text-sm font-bold text-foreground sm:px-6 sm:py-4">{item.term}</div>
              <div className="px-5 pb-4 pt-0 text-sm leading-relaxed text-gray-600 sm:border-l sm:border-border sm:px-6 sm:py-4">
                {item.description}
              </div>
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
