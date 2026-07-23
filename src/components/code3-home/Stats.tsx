'use client'

import React, { useEffect, useRef, useState } from 'react'

export interface StatData {
  value: number
  suffix: string
  label: string
}

const DEFAULT_STATS: StatData[] = [
  { value: 1500, suffix: '+', label: 'Projects delivered' },
  { value: 12, suffix: '+', label: 'Years active in the UAE' },
  { value: 96, suffix: '%', label: 'Client retention rate' },
  { value: 50, suffix: '+', label: 'Technology partners' },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const duration = 1400
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(eased * target))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div
      ref={ref}
      className="font-jetmono flex items-baseline gap-0.5 text-[clamp(32px,4vw,52px)] font-semibold text-white"
    >
      <span>{value}</span>
      <span className="text-[0.55em] text-code3-signal">{suffix}</span>
    </div>
  )
}

export function Stats({ stats = DEFAULT_STATS }: { stats?: StatData[] }) {
  return (
    <section className="bg-code3-ink2">
      <div className="mx-auto max-w-[1240px] px-8 max-[760px]:px-5">
        <div className="grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="px-[30px] py-11">
              <Counter target={s.value} suffix={s.suffix} />
              <div className="font-inter mt-2 text-[13.5px] text-code3-slate-light">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
