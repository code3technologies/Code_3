'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delayMs?: number
  as?: 'div' | 'span'
  style?: React.CSSProperties
  id?: string
}

export function Reveal({ children, className, delayMs = 0, as = 'div', style, id }: RevealProps) {
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

  const Tag = as
  return (
    <Tag
      ref={ref as never}
      id={id}
      className={cn('c3-reveal', inView && 'c3-in', className)}
      style={{ ...(delayMs ? { transitionDelay: `${delayMs}ms` } : undefined), ...style }}
    >
      {children}
    </Tag>
  )
}
