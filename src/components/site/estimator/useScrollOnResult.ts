'use client'

import { useEffect, useRef } from 'react'

// A multi-step estimator collapses from the tall step-by-step wizard layout
// down to the much shorter result panel the moment it's submitted. Browsers
// don't re-anchor scroll position when a page shrinks - they just clamp to
// the new (smaller) max scroll, which can leave the user looking at a mostly
// blank stretch of page with the result card only just peeking in from the
// bottom. Scrolling the section into view the moment the result appears
// keeps the whole card in frame instead.
export function useScrollOnResult<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!active) return
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [active])
  return ref
}
