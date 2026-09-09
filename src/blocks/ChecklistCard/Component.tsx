import type { ChecklistCardBlock as ChecklistCardBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { Info } from 'lucide-react'

type Props = {
  className?: string
} & ChecklistCardBlockProps

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3.5 w-3.5 flex-none">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

// A single unified card holding every item as a striped, two-column row
// list — a deliberately different treatment from the separate bordered
// cards (IconFeatureGrid/DetailedFeatureGrid), borderless list (FeatureList)
// or scroll rail (SolutionRail) used elsewhere on the site.
export const ChecklistCardBlock: React.FC<Props> = ({ className, badge, title, intro, items = [], note }) => {
  const safeItems = items || []
  if (safeItems.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-6 max-w-2xl text-center md:mb-7">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {intro && <p className="mt-2 text-gray-600 leading-relaxed">{intro}</p>}
        </Reveal>

        <Reveal
          delayMs={100}
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_24px_50px_-24px_rgba(0,0,0,0.18)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {safeItems.map((item, index) => {
              const rowIndex = Math.floor(index / 2)
              const shaded = rowIndex % 2 === 1
              const isRightCol = index % 2 === 1
              return (
                <div
                  key={item.id || index}
                  className={cn(
                    'flex items-start gap-3 px-5 py-4 sm:px-6',
                    shaded && 'bg-gray-50/70',
                    index > 1 && 'border-t border-border',
                    isRightCol && 'sm:border-l sm:border-border',
                  )}
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#FDEBEC] text-primary_red">
                    <CheckIcon />
                  </span>
                  <div>
                    <div className="text-sm font-semibold leading-snug text-foreground">{item.title}</div>
                    {item.description && (
                      <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{item.description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {note && (
            <div className="flex items-start gap-2.5 border-t border-amber-200 bg-amber-50 px-5 py-3.5 sm:px-6">
              <Info className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-800">{note}</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
