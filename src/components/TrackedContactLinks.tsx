'use client'

import { useEffect } from 'react'
import { reportContactClickConversion } from '@/utilities/reportConversion'

// Fires a conversion event for ANY tel:/wa.me link on the site via a single
// delegated document listener, rather than wiring onClick into every place
// a phone/WhatsApp link appears (several of which - the top bar, footer,
// contact page info card - are server components that can't hold client
// event handlers, and new ones will keep getting added over time).
export function TrackedContactLinks() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement | null
      if (!link) return

      if (link.href.startsWith('tel:')) {
        reportContactClickConversion('phone')
      } else if (link.href.includes('wa.me')) {
        reportContactClickConversion('whatsapp')
      }
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return null
}
