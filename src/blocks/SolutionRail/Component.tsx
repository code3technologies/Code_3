'use client'

import type { SolutionRailBlock as SolutionRailBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef, useState } from 'react'
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
// pattern from the grid/list blocks used everywhere else on the site. The
// native scrollbar is hidden in favor of dot pagination that tracks scroll
// position and can also drive it (click a dot to jump to that card).
export const SolutionRailBlock: React.FC<Props> = ({ className, badge, title, intro, items = [], footer }) => {
  const safeItems = items || []
  const railRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    let raf = 0
    const handleScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const railLeft = rail.scrollLeft
        let closest = 0
        let closestDistance = Infinity
        cardRefs.current.forEach((card, index) => {
          if (!card) return
          const distance = Math.abs(card.offsetLeft - railLeft)
          if (distance < closestDistance) {
            closestDistance = distance
            closest = index
          }
        })
        setActiveIndex(closest)
      })
    }

    rail.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      rail.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (safeItems.length === 0) return null

  const goToCard = (index: number) => {
    const card = cardRefs.current[index]
    if (!card || !railRef.current) return
    railRef.current.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
  }

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
        <div
          ref={railRef}
          className="flex gap-5 overflow-x-auto px-4 pb-1 sm:px-6 [-ms-overflow-style:none] [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {safeItems.map((item, index) => {
            const Icon = getSolutionIcon(item.title)
            return (
              <div
                key={item.id || index}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
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

      {safeItems.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {safeItems.map((item, index) => (
            <button
              key={item.id || index}
              type="button"
              aria-label={`Go to ${item.title}`}
              onClick={() => goToCard(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === activeIndex ? 'w-6 bg-primary_red' : 'w-2 bg-gray-300 hover:bg-gray-400',
              )}
            />
          ))}
        </div>
      )}

      {footer && (
        <div className="container mx-auto px-4 sm:px-6">
          <Reveal delayMs={150} className="mx-auto mt-4 max-w-2xl text-center">
            <p className="text-sm text-gray-500">{footer}</p>
          </Reveal>
        </div>
      )}
    </section>
  )
}
