'use client'

import { useState, useEffect } from 'react'
import { useDeviceCart } from '@/providers/DeviceCart'

const PHONE_NUMBER = '+971505042547'

export function PhoneButton() {
  const [visible, setVisible] = useState(false)
  const [isRtl, setIsRtl] = useState(false)
  const { isOpen: isCartOpen } = useDeviceCart()

  // Small delay so it doesn't pop in before the page settles
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600)
    setIsRtl(document.documentElement.dir === 'rtl')
    return () => clearTimeout(t)
  }, [])

  // Hidden while the quote cart drawer is open — it sits at a higher z-index
  // than the drawer and would otherwise cover its bottom action button.
  if (isCartOpen) return null

  return (
    <a
      href={`tel:${PHONE_NUMBER}`}
      aria-label="Call CODE3"
      style={{
        position: 'fixed',
        bottom: '155px',
        ...(isRtl ? { left: '24px' } : { right: '24px' }),
        zIndex: 9999,
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        backgroundColor: '#DF3341',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.6)',
        transition: 'opacity 0.35s ease, transform 0.35s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.35)'
        e.currentTarget.style.transform = 'scale(1.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.25)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
      </svg>
    </a>
  )
}
