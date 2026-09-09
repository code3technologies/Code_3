import type { FeatureListBlock as FeatureListBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  Bell,
  Eye,
  Grid2x2,
  History,
  Moon,
  Radar,
  Smartphone,
  Sparkles,
  UserCog,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per feature, matched by keyword.
function getFeatureIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('live view')) return Eye
  if (t.includes('playback')) return History
  if (t.includes('remote')) return Smartphone
  if (t.includes('motion')) return Radar
  if (t.includes('night') || t.includes('low-light') || t.includes('low light')) return Moon
  if (t.includes('analytics')) return Sparkles
  if (t.includes('user management')) return UserCog
  if (t.includes('alert') || t.includes('notification')) return Bell
  if (t.includes('multi-camera') || t.includes('multi camera')) return Grid2x2
  return Eye
}

type Props = {
  className?: string
} & FeatureListBlockProps

// A numbered, borderless list — a large translucent numeral sits behind each
// icon instead of the bordered/shadowed cards used by every other feature
// grid on the site (IconFeatureGrid, DetailedFeatureGrid, etc).
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
          className="mx-auto grid max-w-4xl grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2"
        >
          {safeItems.map((item, index) => {
            const Icon = getFeatureIcon(item.title)
            const number = String(index + 1).padStart(2, '0')
            return (
              <div key={item.id || index} className="relative flex gap-4">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-1.5 -top-5 select-none font-sans text-6xl font-black leading-none text-gray-100"
                >
                  {number}
                </span>
                <span className="relative z-10 flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="relative z-10 pt-0.5">
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
