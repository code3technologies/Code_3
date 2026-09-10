import type { SpecSheetBlock as SpecSheetBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & SpecSheetBlockProps

// A technical datasheet: numbered spec rows on a faint blueprint grid,
// two columns on desktop, hairline dividers. A deliberately "engineered"
// look, distinct from the card grids and timelines used elsewhere.
export const SpecSheetBlock: React.FC<Props> = ({ className, badge, title, intro, items = [], note }) => {
  const safeItems = items || []
  if (safeItems.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {intro && <p className="mt-2 text-gray-600 leading-relaxed">{intro}</p>}
        </Reveal>

        <Reveal
          delayMs={100}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_20px_45px_-24px_rgba(0,0,0,0.16)]"
        >
          {/* blueprint grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(201,14,29,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,14,29,0.05) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* datasheet header strip */}
          <div className="relative flex items-center gap-2 bg-gray-50/70 px-5 py-2.5 sm:px-6">
            <span className="h-2 w-2 rounded-full bg-primary_red" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              {String(safeItems.length).padStart(2, '0')} requirements
            </span>
          </div>

          <div className="relative -ml-px -mt-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {safeItems.map((item, index) => {
              return (
                <div
                  key={item.id || index}
                  className="flex gap-4 border-l border-t border-border px-5 py-4 sm:px-6"
                >
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md border border-primary_red/30 font-mono text-xs font-bold text-primary_red">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="text-sm font-bold leading-snug text-foreground">{item.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {note && (
            <div className="relative border-t border-border bg-gray-50/70 px-5 py-3 text-center sm:px-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gray-500">{note}</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
