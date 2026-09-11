import type { FeatureListBlock as FeatureListBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  Activity,
  Bell,
  Car,
  DoorOpen,
  Eye,
  Factory,
  Fence,
  Gauge,
  Grid2x2,
  History,
  Infinity as InfinityIcon,
  Lock,
  Moon,
  Radar,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Unlink,
  UserCog,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per feature, matched by keyword.
function getFeatureIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('redundan')) return ShieldCheck
  if (t.includes('utiliz')) return Gauge
  if (t.includes('failover')) return RefreshCw
  if (t.includes('availab')) return Activity
  if (t.includes('continuity')) return InfinityIcon
  if (t.includes('dependency') || t.includes('provider')) return Unlink
  if (t.includes('live view')) return Eye
  if (t.includes('playback')) return History
  if (t.includes('remote')) return Smartphone
  if (t.includes('motion')) return Radar
  if (t.includes('night') || t.includes('low-light') || t.includes('low light')) return Moon
  if (t.includes('analytics')) return Sparkles
  if (t.includes('user management')) return UserCog
  if (t.includes('alert') || t.includes('notification')) return Bell
  if (t.includes('multi-camera') || t.includes('multi camera')) return Grid2x2
  if (t.includes('restricted zone')) return Lock
  if (t.includes('perimeter')) return Fence
  if (t.includes('entrance')) return DoorOpen
  if (t.includes('loading')) return Truck
  if (t.includes('parking')) return Car
  if (t.includes('warehouse')) return Warehouse
  if (t.includes('reception')) return Users
  if (t.includes('production')) return Factory
  return Eye
}

type Props = {
  className?: string
} & FeatureListBlockProps

// A clean, borderless icon list — no cards, no shadows — a lighter
// alternative to the bordered feature grids used elsewhere on the site.
export const FeatureListBlock: React.FC<Props> = ({ className, badge, title, intro, items = [], footer }) => {
  const safeItems = items || []
  if (safeItems.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {intro && <p className="mt-2 text-gray-600 leading-relaxed">{intro}</p>}
        </Reveal>

        <Reveal
          delayMs={100}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3"
        >
          {safeItems.map((item, index) => {
            const Icon = getFeatureIcon(item.title)
            return (
              <div key={item.id || index} className="flex gap-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="pt-0.5">
                  <h3 className="text-base font-semibold leading-snug text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
                </div>
              </div>
            )
          })}
        </Reveal>

        {footer && (
          <Reveal delayMs={150} className="mx-auto mt-10 max-w-2xl text-center md:mt-12">
            <p className="text-sm text-gray-500">{footer}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
