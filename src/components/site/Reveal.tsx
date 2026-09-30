import React from 'react'
import { cn } from '@/utilities/ui'

type Direction = 'up' | 'down' | 'left' | 'right'

const OFFSET: Record<Direction, string> = {
  up: 'translateY(28px)',
  down: 'translateY(-28px)',
  left: 'translateX(28px)',
  right: 'translateX(-28px)',
}

// Server component - the actual fade-in-on-scroll is done in CSS (see the
// `.reveal` rules in globals.css), so this is no longer a client component
// and carries zero hydration cost, however many times it's used on a page.
export function Reveal({
  children,
  className,
  delayMs = 0,
  direction = 'up',
  durationMs = 900,
}: {
  children: React.ReactNode
  className?: string
  delayMs?: number
  direction?: Direction
  // Above-the-fold content (a hero) needs a snappier duration than the
  // default - a slow fade-in on the page's largest/first element can push
  // back when the browser considers it "painted" for Largest Contentful
  // Paint, which this project has specifically worked to keep fast.
  durationMs?: number
}) {
  return (
    <div
      className={cn('reveal', className)}
      style={
        {
          '--reveal-offset': OFFSET[direction],
          '--reveal-duration': `${durationMs}ms`,
          '--reveal-delay': `${delayMs}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
