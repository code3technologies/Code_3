import type { PathCompareBlock as PathCompareBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & PathCompareBlockProps

// Two (or three) equal-weight paths. Each card has a solid coloured header.
// "flow" renders the items as numbered chips joined by chevrons (an ordered
// process); "list" renders them as a plain checklist (situations / criteria).
// Deliberately symmetrical — for "which of these are you?", not better/worse.
export const PathCompareBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  variant,
  columns = [],
  note,
}) => {
  const safeColumns = (columns || []).filter((c) => (c.steps || []).length > 0)
  if (safeColumns.length === 0) return null
  const isList = variant === 'list'

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
            'mx-auto grid gap-4',
            isList
              ? cn('max-w-4xl items-stretch', safeColumns.length === 2 && 'md:grid-cols-2', safeColumns.length >= 3 && 'md:grid-cols-2 lg:grid-cols-3')
              : 'max-w-6xl',
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
                {isList ? (
                  <>
                    <div className="bg-primary_red px-5 py-4 text-white">
                      <h3 className="text-base font-bold">{col.label}</h3>
                      {col.caption && <p className="mt-0.5 text-sm text-white/80">{col.caption}</p>}
                    </div>
                    <ul className="flex-1 space-y-2.5 p-5">
                      {steps.map((step, si) => (
                        <li key={step.id || si} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#FDEBEC] text-primary_red">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span className="text-sm font-medium leading-snug text-foreground">{step.text}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex-none rounded-lg bg-primary_red px-3.5 py-2.5 text-white sm:w-44">
                      <h3 className="text-xs font-bold uppercase tracking-wide">{col.label}</h3>
                      {col.caption && (
                        <p className="mt-0.5 hidden text-[11px] leading-snug text-white/80 sm:block">{col.caption}</p>
                      )}
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
                )}
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
