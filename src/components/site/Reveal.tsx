'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'

type Direction = 'up' | 'down' | 'left' | 'right'

const OFFSET: Record<Direction, string> = {
  up: 'translate-y-7',
  down: '-translate-y-7',
  left: 'translate-x-7',
  right: '-translate-x-7',
}

export function Reveal({
  children,
  className,
  delayMs = 0,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  delayMs?: number
  direction?: Direction
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0 scale-[0.97] motion-reduce:opacity-100 motion-reduce:scale-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0',
        OFFSET[direction],
        // A gentle overshoot easing (a touch of "spring") reads as more
        // deliberate/cinematic than a linear ease-out, while staying subtle
        // enough not to feel bouncy on small UI text.
        'transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
        inView && 'opacity-100 scale-100 translate-x-0 translate-y-0',
        className,
      )}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  )
}
