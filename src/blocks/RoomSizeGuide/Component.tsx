import type { RoomSizeGuideBlock as RoomSizeGuideBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowRight,
  Briefcase,
  Building2,
  Camera,
  Car,
  CreditCard,
  DoorOpen,
  Factory,
  Fingerprint,
  Globe,
  GraduationCap,
  KeySquare,
  Layers,
  Monitor,
  Presentation,
  ScanFace,
  Smartphone,
  Sparkles,
  Store,
  Sun,
  Users,
  Warehouse,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per room type, matched by keyword.
function getRoomIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('dome')) return Building2
  if (t.includes('bullet')) return Sun
  if (t.includes('ptz')) return ZoomIn
  if (t.includes('turret')) return Camera
  if (t.includes('ai camera') || t.includes('ai-camera')) return Sparkles
  if (t.includes('anpr')) return Car
  if (t.includes('huddle')) return Users
  if (t.includes('boardroom')) return Briefcase
  if (t.includes('training')) return GraduationCap
  if (t.includes('venue')) return Building2
  if (t.includes('reception') || t.includes('small office')) return DoorOpen
  if (t.includes('command centre') || t.includes('command center') || t.includes('showroom')) return Monitor
  if (t.includes('meeting')) return Presentation
  if (t.includes('retail') || t.includes('hospitality')) return Store
  if (t.includes('enterprise') || t.includes('multi-location') || t.includes('multi location')) return Globe
  if (t.includes('commercial')) return Building2
  if (t.includes('industrial')) return Factory
  if (t.includes('warehouse')) return Warehouse
  if (t.includes('open-ceiling') || t.includes('open ceiling')) return Warehouse
  if (t.includes('outdoor')) return Sun
  if (t.includes('office')) return Briefcase
  if (t.includes('simple') || t.includes('employee access')) return CreditCard
  if (t.includes('high-security') || t.includes('high security')) return Fingerprint
  if (t.includes('touchless')) return ScanFace
  if (t.includes('low-cost') || t.includes('low cost')) return KeySquare
  if (t.includes('workforce')) return Users
  if (t.includes('modern workplace')) return Smartphone
  if (t.includes('mixed')) return Layers
  return Presentation
}

type Props = {
  className?: string
} & RoomSizeGuideBlockProps

export const RoomSizeGuideBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  rows = [],
  note,
  ctaLabel,
  ctaUrl,
}) => {
  const safeRows = rows || []
  if (safeRows.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-6 max-w-2xl text-center md:mb-7">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal
          delayMs={100}
          className={cn(
            'mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4',
            safeRows.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3',
          )}
        >
          {safeRows.map((row, index) => {
            const Icon = getRoomIcon(row.room)
            return (
              <div
                key={row.id || index}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary_red/30 hover:shadow-md"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold leading-snug text-foreground">{row.room}</span>
                <span className="inline-flex items-center rounded-full bg-primary_red px-3.5 py-1.5 text-sm font-bold text-white">
                  {row.recommended}
                </span>
              </div>
            )
          })}
        </Reveal>

        {note && (
          <Reveal delayMs={150} className="mx-auto mt-6 max-w-2xl text-center">
            <p className="text-sm text-gray-500">{note}</p>
          </Reveal>
        )}

        {ctaLabel && ctaUrl && (
          <div className="mt-6 flex justify-center md:mt-7">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 rounded-full bg-primary_red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
