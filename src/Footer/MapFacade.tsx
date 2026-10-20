'use client'

import React, { useState } from 'react'

// The live Google Maps embed pulls in ~250KB of the Maps JS SDK inside its
// iframe on every single page load, even though almost nobody interacts with
// it. Show a static placeholder instead and only mount the real iframe once
// the visitor actually asks for it.
export function MapFacade({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        src={src}
        className="h-[220px] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="CODE3 location map"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="group relative flex h-[220px] w-full flex-col items-center justify-center gap-2 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
        <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      <span className="text-sm font-medium">Click to load map</span>
    </button>
  )
}
