import type { SolutionRailBlock as SolutionRailBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { Briefcase, Building2, Fence, Globe, Layers, RefreshCw, Warehouse, type LucideIcon } from 'lucide-react'

// Best-effort icon per solution, matched by keyword.
function getSolutionIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('small office')) return Briefcase
  if (t.includes('multi-floor') || t.includes('multi floor')) return Layers
  if (t.includes('warehouse')) return Warehouse
  if (t.includes('perimeter')) return Fence
  if (t.includes('multi-site') || t.includes('multi site')) return Globe
  if (t.includes('upgrade') || t.includes('existing')) return RefreshCw
  return Building2
}

type Props = {
  className?: string
} & SolutionRailBlockProps

// A horizontally scrolling card rail — a deliberately different browsing
// pattern from the grid/list blocks used everywhere else on the site.
export const SolutionRailBlock: React.FC<Props> = ({ className, badge, title, intro, items = [], footer }) => {
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
      </div>

      <Reveal delayMs={100} className="container mx-auto">
        <div className="flex gap-5 overflow-x-auto px-4 pb-4 sm:px-6 [scroll-snap-type:x_mandatory]">
          {safeItems.map((item, index) => {
            const Icon = getSolutionIcon(item.title)
            return (
              <div
                key={item.id || index}
                className="flex w-[260px] flex-none snap-start flex-col gap-3 rounded-2xl border-t-4 border-t-primary_red bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_16px_32px_-16px_rgba(0,0,0,0.18)] sm:w-[300px]"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold leading-snug text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
              </div>
            )
          })}
        </div>
      </Reveal>

      {footer && (
        <div className="container mx-auto px-4 sm:px-6">
          <Reveal delayMs={150} className="mx-auto mt-2 max-w-2xl text-center">
            <p className="text-sm text-gray-500">{footer}</p>
          </Reveal>
        </div>
      )}
    </section>
  )
}
