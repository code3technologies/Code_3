'use client'

import type { RoomClassificationBlock as RoomClassificationBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { ServiceIcon } from '@/components/site/icons'

type Props = {
  className?: string
} & RoomClassificationBlockProps

export const RoomClassificationBlock: React.FC<Props> = ({ className, badge, title, description, rooms = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!rooms || rooms.length === 0) return null

  const active = rooms[Math.min(activeIndex, rooms.length - 1)]

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        {(badge || title) && (
          <Reveal className="mx-auto max-w-3xl text-center">
            {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
            {title && <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>}
          </Reveal>
        )}

        {description && (
          <Reveal className="mx-auto mt-3 max-w-3xl text-center">
            <RichText data={description} enableGutter={false} enableProse={false} className="text-gray-600 leading-relaxed [&_strong]:text-foreground [&_strong]:font-semibold" />
          </Reveal>
        )}

        <Reveal delayMs={100} className="mt-8 flex justify-center">
          <div className="flex flex-wrap justify-center gap-1 border-b border-border">
            {rooms.map((room, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={room.id || index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'relative px-4 py-3 text-sm font-medium transition-colors',
                    isActive ? 'text-primary_red' : 'text-gray-500 hover:text-foreground',
                  )}
                >
                  {room.label}
                  {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary_red" />}
                </button>
              )
            })}
          </div>
        </Reveal>

        <Reveal delayMs={150} className="mt-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border shadow-sm md:aspect-[21/9]">
            {active.image && typeof active.image === 'object' ? (
              <Media resource={active.image} fill imgClassName="h-full w-full object-cover" />
            ) : active.icon ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#FDEBEC] via-white to-gray-50 px-6 text-center">
                <span className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-primary_red text-white shadow-lg md:h-20 md:w-20">
                  <ServiceIcon preset={active.icon} className="h-8 w-8 md:h-10 md:w-10" />
                </span>
                <h3 className="text-xl font-semibold text-foreground md:text-2xl">{active.label}</h3>
              </div>
            ) : null}
          </div>
          {active.caption && (
            <p className="mx-auto mt-4 max-w-xl text-center text-sm text-gray-500">{active.caption}</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
