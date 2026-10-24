'use client'

import type { StatsBlock as StatsBlockProps } from 'src/payload-types'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'
import { ServiceIcon } from '@/components/site/icons'
import { IconMedia } from '@/components/site/IconMedia'
import { ClearQuickEnquiry } from '@/components/site/ClearQuickEnquiry'

type Props = {
  className?: string
} & StatsBlockProps

function Counter({ target, suffix }: { target: number; suffix?: string | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let started = false
    const runCounter = () => {
      if (started) return
      started = true
      const duration = 1400
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setValue(Math.round(eased * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    // Some ad-blocking/privacy extensions stub out IntersectionObserver so it
    // never calls back. Fall back to an immediate visibility check plus a
    // short timer so the counter still animates instead of staying at 0.
    const isInViewport = () => {
      const rect = el.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom > 0
    }

    let observer: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            runCounter()
            observer?.unobserve(entry.target)
          })
        },
        { threshold: 0.5 },
      )
      observer.observe(el)
    }

    const removeFallbackListeners = () => {
      window.removeEventListener('scroll', checkFallback)
      window.removeEventListener('resize', checkFallback)
    }
    function checkFallback() {
      if (started) return removeFallbackListeners()
      if (isInViewport()) {
        runCounter()
        removeFallbackListeners()
      }
    }
    const fallbackTimer = window.setTimeout(checkFallback, 800)
    window.addEventListener('scroll', checkFallback, { passive: true })
    window.addEventListener('resize', checkFallback)

    return () => {
      observer?.disconnect()
      window.clearTimeout(fallbackTimer)
      removeFallbackListeners()
    }
  }, [target])

  return (
    <div ref={ref} className="flex items-baseline gap-0.5 text-[clamp(28px,4vw,44px)] font-semibold text-white">
      <span>{value}</span>
      <span className="text-[0.6em] text-white/90">{suffix}</span>
    </div>
  )
}

export const StatsBlock: React.FC<Props> = ({ className, stats = [] }) => {
  const safeStats = stats || []
  if (safeStats.length === 0) return null

  return (
    <>
      {/* No-op unless a floating quick-enquiry-style form (e.g. the Quick
          Enquiry or Meeting Room Assessment block) is present on the page -
          measures its real height at runtime so this section, which often
          sits right after the banner, doesn't render underneath it. */}
      <ClearQuickEnquiry />
      <section className={cn('bg-primary_red', className)}>
        <div className="container mx-auto px-4 sm:px-6">
          <div
            className={cn(
              'grid grid-cols-1 divide-y divide-white/20 border-y border-white/20 sm:divide-y-0 sm:divide-x',
              safeStats.length === 4 && 'sm:grid-cols-4',
              safeStats.length === 3 && 'sm:grid-cols-3',
              safeStats.length === 2 && 'sm:grid-cols-2',
            )}
          >
            {safeStats.map((stat, i) => (
              <div key={stat.id || i} className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/40 overflow-hidden">
                  {stat.iconMedia && typeof stat.iconMedia === 'object' ? (
                    <IconMedia resource={stat.iconMedia} className="h-6 w-6 object-contain" />
                  ) : (
                    <ServiceIcon preset={stat.icon || 'check'} className="h-5 w-5 text-white" />
                  )}
                </span>
                <Counter target={stat.value} suffix={stat.suffix} />
                <div className="text-sm text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
