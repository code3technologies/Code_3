import type { PathCompareBlock as PathCompareBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & PathCompareBlockProps

// Two (or three) equal-weight paths side by side, each a numbered top-to-bottom
// step list on a connecting rail. Deliberately symmetrical — for "which of these
// are you?" journeys rather than a better/worse comparison.
export const PathCompareBlock: React.FC<Props> = ({ className, badge, title, subtitle, columns = [], note }) => {
  const safeColumns = (columns || []).filter((c) => (c.steps || []).length > 0)
  if (safeColumns.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl text-balance">
            {title}
          </h2>
          {subtitle && <p className="mt-2 leading-relaxed text-gray-600">{subtitle}</p>}
        </Reveal>

        <div
          className={cn(
            'mx-auto grid max-w-4xl gap-5',
            safeColumns.length === 2 && 'md:grid-cols-2',
            safeColumns.length >= 3 && 'md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {safeColumns.map((col, ci) => {
            const steps = col.steps || []
            return (
              <Reveal
                key={col.id || ci}
                delayMs={ci * 80}
                className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="mb-4 border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 flex-none rounded-full bg-primary_red" />
                    <h3 className="text-base font-bold text-foreground">{col.label}</h3>
                  </div>
                  {col.caption && <p className="mt-1 text-sm text-gray-500">{col.caption}</p>}
                </div>

                <ol className="relative ml-[11px] space-y-3 border-l-2 border-primary_red/15 pl-6">
                  {steps.map((step, si) => (
                    <li key={step.id || si} className="relative">
                      <span className="absolute -left-[31px] top-1/2 flex h-[22px] w-[22px] -translate-y-1/2 items-center justify-center rounded-full bg-primary_red text-[11px] font-bold text-white ring-4 ring-white">
                        {si + 1}
                      </span>
                      <span className="text-sm font-medium leading-snug text-foreground">{step.text}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )
          })}
        </div>

        {note && (
          <Reveal delayMs={120} className="mx-auto mt-6 max-w-2xl text-center">
            <p className="text-sm text-gray-500">{note}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
