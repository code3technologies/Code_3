'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/ui'

// The live Google Maps embed pulls in ~250KB of the Maps JS SDK inside its
// iframe on every single page load, even though almost nobody interacts with
// it. Show a static placeholder instead and only mount the real iframe once
// the visitor actually asks for it.
export function MapFacade({
  src,
  height = 220,
  theme = 'dark',
}: {
  src: string
  height?: number
  theme?: 'dark' | 'light'
}) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        src={src}
        className="w-full"
        style={{ height }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="CODE3 location map"
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      style={{ height }}
      className={cn(
        'group relative flex w-full flex-col items-center justify-center gap-2 transition-colors',
        isDark ? 'bg-white/5 text-white/80 hover:bg-white/10' : 'bg-gray-50 text-foreground hover:bg-gray-100',
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
        <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      <span className="text-sm font-medium">Click to load map</span>
    </button>
  )
}
