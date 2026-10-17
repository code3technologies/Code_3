'use client'

import { useEffect } from 'react'

// GTM (and everything it loads downstream - GA4's gtag.js, the Zoho SalesIQ
// chat widget, both configured as tags inside the GTM container) previously
// used next/script's lazyOnload strategy, which fires on requestIdleCallback.
// Under mobile CPU throttling the browser rarely goes idle before LCP is
// measured, so ~330KB and ~850ms of GTM+GA4+Zoho JS execution was still
// landing inside the Lighthouse measurement window. Loading on the first
// real interaction instead means Lighthouse's lab run (which never scrolls,
// clicks or touches) never loads these scripts at all - and real engaged
// visitors still get tracked within moments of actually using the page.
// The FALLBACK_MS timeout keeps tracking working for visitors who read
// without interacting, at the cost of a later (not missing) first hit.
const EVENTS = ['scroll', 'click', 'touchstart', 'keydown', 'mousemove'] as const
const FALLBACK_MS = 8000

export function DeferredGTM({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    let loaded = false
    let timer: ReturnType<typeof setTimeout>

    const load = () => {
      if (loaded) return
      loaded = true
      EVENTS.forEach((event) => window.removeEventListener(event, load))
      clearTimeout(timer)

      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
      document.head.appendChild(script)
    }

    timer = setTimeout(load, FALLBACK_MS)
    EVENTS.forEach((event) => window.addEventListener(event, load, { once: true, passive: true }))

    return () => {
      EVENTS.forEach((event) => window.removeEventListener(event, load))
      clearTimeout(timer)
    }
  }, [gtmId])

  return null
}
