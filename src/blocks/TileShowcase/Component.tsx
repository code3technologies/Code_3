import type { TileShowcaseBlock as TileShowcaseBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  Briefcase,
  Building2,
  Car,
  Factory,
  Fence,
  GraduationCap,
  Home,
  Hotel,
  Lock,
  ShieldCheck,
  Store,
  Truck,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per business environment, matched by keyword.
function getEnvironmentIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('office')) return Briefcase
  if (t.includes('warehouse')) return Warehouse
  if (t.includes('retail')) return Store
  if (t.includes('industrial')) return Factory
  if (t.includes('residential')) return Home
  if (t.includes('commercial')) return Building2
  if (t.includes('school') || t.includes('educational')) return GraduationCap
  if (t.includes('hospitality')) return Hotel
  if (t.includes('perimeter')) return Fence
  if (t.includes('restricted')) return Lock
  if (t.includes('parking')) return Car
  if (t.includes('logistics')) return Truck
  return ShieldCheck
}

type Props = {
  className?: string
} & TileShowcaseBlockProps

// A bold, high-contrast checkerboard of alternating dark/red tiles — a
// deliberately different visual register from the white-card grids, lists
// and diagrams used everywhere else on the site.
export const TileShowcaseBlock: React.FC<Props> = ({ className, badge, title, intro, items = [] }) => {
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
          className="mx-auto grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {safeItems.map((item, index) => {
            const Icon = getEnvironmentIcon(item.title)
            const isRed = index % 2 === 1
            return (
              <div
                key={item.id || index}
                className={cn(
                  'flex flex-col gap-2.5 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6',
                  isRed ? 'bg-primary_red' : 'bg-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 flex-none items-center justify-center rounded-xl',
                    isRed ? 'bg-white/15 text-white' : 'bg-white/10 text-white',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-bold leading-snug text-white">{item.title}</h3>
                <p className={cn('text-sm leading-relaxed', isRed ? 'text-white/85' : 'text-white/65')}>
                  {item.description}
                </p>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
