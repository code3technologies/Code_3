import type { TransformationListBlock as TransformationListBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { ArrowRight, Check, X } from 'lucide-react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & TransformationListBlockProps

export const TransformationListBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  fromLabel,
  toLabel,
  pairs = [],
  ctaLabel,
  ctaUrl,
}) => {
  const safePairs = pairs || []
  if (safePairs.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-6 max-w-2xl text-center md:mb-7">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal delayMs={100} className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border shadow-sm">
          {(fromLabel || toLabel) && (
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border bg-gray-50/80 px-5 py-3 sm:px-8">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">{fromLabel}</span>
              <span className="w-4" />
              <span className="text-xs font-bold uppercase tracking-wide text-primary_red">{toLabel}</span>
            </div>
          )}
          <div className="divide-y divide-border">
            {safePairs.map((pair, index) => (
              <div
                key={pair.id || index}
                className={cn(
                  'grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 transition-colors sm:px-8',
                  index % 2 === 1 && 'bg-gray-50/60',
                )}
              >
                <span className="flex items-center gap-2.5 text-sm text-gray-500">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    <X className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {pair.from}
                </span>
                <ArrowRight className="h-4 w-4 flex-none text-primary_red/50" strokeWidth={2.5} />
                <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary_red text-white">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {pair.to}
                </span>
              </div>
            ))}
          </div>
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
