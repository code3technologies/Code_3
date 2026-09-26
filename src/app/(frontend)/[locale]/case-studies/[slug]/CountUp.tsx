'use client'

import React, { useEffect, useRef, useState } from 'react'

// Counts a leading number up on first view ("35%" -> 0%..35%). The server
// render (and anyone with reduced motion / no JS) sees the final value.
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/)
  const target = match ? parseFloat(match[1]) : null
  const suffix = match ? match[2] : ''
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0

  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState<number | null>(target)

  useEffect(() => {
    const el = ref.current
    if (!el || target === null) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const duration = 1400
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setDisplay(target * eased)
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        setDisplay(0)
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target])

  if (target === null) return <span className={className}>{value}</span>

  return (
    <span ref={ref} className={className}>
      {(display ?? target).toFixed(decimals)}
      {suffix}
    </span>
  )
}
