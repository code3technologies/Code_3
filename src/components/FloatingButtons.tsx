'use client'

import { useEffect, useState } from 'react'

const WHATSAPP_NUMBER = '971505042547' // no + or spaces, country code included
const PHONE_NUMBER = '+971505042547'
const DEFAULT_MESSAGE = "Hi CODE3, I'd like to know more about your services."

/**
 * Stacked bottom-right, above the Zoho SalesIQ chat launcher (injected separately
 * via GTM, not in this codebase). Matches Zoho's own `.zsiq-float` values exactly:
 * right: 10px, bottom: 10px, 55px circle.
 */
const ZOHO_RIGHT = 10
const ZOHO_BOTTOM = 10
const ZOHO_SIZE = 55
const GAP = 12
export function FloatingButtons() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <>
      <FabButton
        href={`tel:${PHONE_NUMBER}`}
        ariaLabel="Call CODE3"
        bottom={ZOHO_BOTTOM + ZOHO_SIZE * 2 + GAP * 2}
        bg="#DF3341"
        visible={visible}
        delayMs={0}
      >
        <PhoneIcon />
      </FabButton>
      <FabButton
        href={whatsappHref}
        ariaLabel="Chat with CODE3 on WhatsApp"
        bottom={ZOHO_BOTTOM + ZOHO_SIZE + GAP}
        bg="#25D366"
        visible={visible}
        delayMs={120}
        external
      >
        <WhatsAppIcon />
      </FabButton>
    </>
  )
}

function FabButton({
  href,
  ariaLabel,
  bottom,
  bg,
  visible,
  delayMs,
  external,
  children,
}: {
  href: string
  ariaLabel: string
  bottom: number
  bg: string
  visible: boolean
  delayMs: number
  external?: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{
        position: 'fixed',
        bottom: `${bottom}px`,
        right: `${ZOHO_RIGHT}px`,
        zIndex: 9999,
        width: `${ZOHO_SIZE}px`,
        height: `${ZOHO_SIZE}px`,
        borderRadius: '50%',
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.6)',
        transition: `opacity 0.35s ease ${delayMs}ms, transform 0.35s ease ${delayMs}ms, box-shadow 0.2s ease`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)'
        e.currentTarget.style.transform = 'scale(1.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.3)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {children}
    </a>
  )
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0122 16.92z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.61.84 5.03 2.27 7.01L4.9 28.1a1 1 0 0 0 1.22 1.19l6.28-1.65A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.628 3 16.001 3Zm0 21.8c-1.94 0-3.75-.53-5.3-1.46l-.38-.22-4.06 1.07 1.08-3.96-.25-.4A9.77 9.77 0 0 1 5.8 15c0-5.63 4.57-10.2 10.2-10.2S26.2 9.37 26.2 15 21.63 24.8 16 24.8Z" />
      <path d="M21.62 17.53c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.45s1.06 2.85 1.2 3.05c.15.2 2.09 3.2 5.08 4.48.71.31 1.26.49 1.69.62.71.23 1.35.2 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  )
}
