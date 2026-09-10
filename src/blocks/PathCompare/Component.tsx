import type { PathCompareBlock as PathCompareBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & PathCompareBlockProps

// Two (or three) equal-weight paths, stacked full-width. Each card has a
// solid coloured header and a left-to-right row of step chips joined by
// chevrons (wrapping on narrow screens). Deliberately symmetrical — for
// "which of these are you?" journeys, not a better/worse comparison.
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

        <div className="mx-auto grid max-w-6xl gap-4">
          {safeColumns.map((col, ci) => {
            const steps = col.steps || []
            return (
              <Reveal
                key={col.id || ci}
                delayMs={ci * 80}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex-none rounded-lg bg-primary_red px-3.5 py-2.5 text-white sm:w-44">
                    <h3 className="text-xs font-bold uppercase tracking-wide">{col.label}</h3>
                    {col.caption && <p className="mt-0.5 hidden text-[11px] leading-snug text-white/80 sm:block">{col.caption}</p>}
                  </div>

                  <div className="-mx-4 flex min-w-0 flex-1 flex-nowrap items-center gap-x-1 overflow-x-auto px-4 pb-1 [scrollbar-width:thin] sm:mx-0 sm:px-0 sm:pb-0">
                    {steps.map((step, si) => (
                      <React.Fragment key={step.id || si}>
                        <span className="inline-flex flex-none items-center gap-1.5 rounded-md border border-primary_red/15 bg-[#FDEBEC]/50 px-2.5 py-1.5">
                          <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-primary_red text-[9px] font-bold text-white">
                            {si + 1}
                          </span>
                          <span className="whitespace-nowrap text-xs font-semibold leading-none text-foreground">
                            {step.text}
                          </span>
                        </span>
                        {si < steps.length - 1 && (
                          <ChevronRight className="h-3.5 w-3.5 flex-none text-primary_red/40" strokeWidth={2.5} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
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
