import type { PathCompareBlock as PathCompareBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { ChevronDown } from 'lucide-react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & PathCompareBlockProps

// Two (or three) equal-weight paths side by side. Each card has a solid
// coloured header and a top-to-bottom stack of step chips joined by
// chevrons. Deliberately symmetrical — for "which of these are you?"
// journeys rather than a better/worse comparison.
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
            'mx-auto grid max-w-4xl items-stretch gap-5',
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
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <div className="bg-primary_red px-5 py-4 text-white sm:px-6">
                  <h3 className="text-base font-bold">{col.label}</h3>
                  {col.caption && <p className="mt-0.5 text-sm text-white/80">{col.caption}</p>}
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  {steps.map((step, si) => (
                    <React.Fragment key={step.id || si}>
                      <div className="flex items-center gap-3 rounded-xl border border-primary_red/15 bg-[#FDEBEC]/50 px-3.5 py-2.5">
                        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary_red text-[11px] font-bold text-white">
                          {si + 1}
                        </span>
                        <span className="text-sm font-semibold leading-snug text-foreground">{step.text}</span>
                      </div>
                      {si < steps.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ChevronDown className="h-4 w-4 text-primary_red/40" strokeWidth={2.5} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
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
