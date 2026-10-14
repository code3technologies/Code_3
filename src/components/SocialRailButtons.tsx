'use client'

import { useEffect, useState } from 'react'
import { useDeviceCart } from '@/providers/DeviceCart'

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12H3v-12zm7 0h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v6.31h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-4v-12z" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

// Sitewide fixed social rail, stacked directly above PhoneButton (bottom:
// 155px, 58px tall) with the same 16px gap PhoneButton itself keeps above
// WhatsAppButton - so bottom: 155 + 58 + 16 = 229px. min(..., 25vh) (matched
// by 17vh/9vh in PhoneButton/WhatsAppButton) scales all three down together
// on short viewports instead of staying pinned 229px up regardless of window
// height - on a short/non-maximized window the fixed 229px pushed this rail
// high enough to collide with hero content on pages like the device category
// pages, whose quote-enquiry card sits in that same top-right corner. Each
// pill is sized by its own content (inline-flex), so the label reveal on
// hover is a pure CSS max-width transition on the label span rather than
// animating the link itself to/from "auto" width, which CSS can't tween
// directly.
export function SocialRailButtons({ socialLinks }: { socialLinks?: Record<string, string | null | undefined> }) {
  const [visible, setVisible] = useState(false)
  const [isRtl, setIsRtl] = useState(false)
  const { isOpen: isCartOpen } = useDeviceCart()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600)
    setIsRtl(document.documentElement.dir === 'rtl')
    return () => clearTimeout(t)
  }, [])

  const items = [
    { url: socialLinks?.linkedin, Icon: LinkedInIcon, label: 'LinkedIn' },
    { url: socialLinks?.instagram, Icon: InstagramIcon, label: 'Instagram' },
  ].filter((item): item is { url: string; Icon: typeof LinkedInIcon; label: string } => Boolean(item.url))

  if (items.length === 0 || isCartOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'min(229px, 25vh)',
        ...(isRtl ? { left: '24px' } : { right: '24px' }),
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isRtl ? 'flex-start' : 'flex-end',
        gap: '16px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.6)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}
    >
      {items.map(({ url, Icon, label }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="group/social inline-flex h-[58px] items-center justify-end rounded-full border border-white/15 bg-black/35 text-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors duration-300 hover:border-white/40 hover:bg-white hover:text-primary_red"
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-xs font-bold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover/social:max-w-[6rem] group-hover/social:pl-4 group-hover/social:opacity-100">
            {label}
          </span>
          <span className="flex h-[58px] w-[58px] flex-none items-center justify-center">
            <Icon />
          </span>
        </a>
      ))}
    </div>
  )
}
