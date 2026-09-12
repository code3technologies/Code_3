'use client'

import type { RoomTypeShowcaseBlock as RoomTypeShowcaseBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  Briefcase,
  Building2,
  BookOpen,
  DoorOpen,
  GraduationCap,
  Landmark,
  MessageSquare,
  Presentation,
  Store,
  Users,
  type LucideIcon,
} from 'lucide-react'

type Props = {
  className?: string
} & RoomTypeShowcaseBlockProps

// Best-effort icon per space type, matched by keyword.
function getSpaceIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('huddle')) return Users
  if (t.includes('boardroom')) return Briefcase
  if (t.includes('conference')) return Presentation
  if (t.includes('meeting')) return MessageSquare
  if (t.includes('training')) return GraduationCap
  if (t.includes('classroom')) return BookOpen
  if (t.includes('auditorium')) return Landmark
  if (t.includes('reception') || t.includes('lobby')) return DoorOpen
  if (t.includes('retail')) return Store
  return Building2
}

export const RoomTypeShowcaseBlock: React.FC<Props> = ({ className, badge, title, subtitle, items = [], note }) => {
  const safeItems = items || []
  if (safeItems.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-7 max-w-2xl text-center">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal delayMs={100} className="relative -mx-4 sm:-mx-6">
          <div className="pointer-events-none absolute -left-1 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent sm:w-16" />
          <div className="pointer-events-none absolute -right-1 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent sm:w-16" />

          <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6">
            {safeItems.map((item, index) => {
              const Icon = getSpaceIcon(item.title)
              return (
                <div
                  key={item.id || index}
                  className="flex w-[240px] flex-none snap-start flex-col gap-3 rounded-2xl border border-border bg-gray-50/60 p-5 transition-colors hover:border-primary_red/40 hover:bg-[#FDEBEC]/40 md:w-[260px]"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-base font-semibold leading-snug text-foreground">{item.title}</span>
                  <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                </div>
              )
            })}
          </div>
        </Reveal>

        {note && <p className="mt-5 text-center text-sm text-gray-500">{note}</p>}
      </div>
    </section>
  )
}
