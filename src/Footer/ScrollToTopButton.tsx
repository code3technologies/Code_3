'use client'

import React from 'react'

interface ScrollToTopButtonProps {
  className?: string
  ariaLabel?: string
}

export function ScrollToTopButton({ 
  className = 'hidden md:block hover:cursor-pointer md:col-span-2 mt-auto transition-all duration-300 active:scale-95 rounded-full bg-[#CB101F] w-max p-3',
  ariaLabel = 'Scroll to top'
}: ScrollToTopButtonProps) {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={className}
      aria-label={ariaLabel}
    >
      <svg
        width="14"
        height="16"
        viewBox="0 0 14 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 16L7 2M7 2L1 8M7 2L13 8" stroke="#ECEEEC" strokeWidth="1.5" />
      </svg>
    </button>
  )
}

export function ScrollToTopButtonMobile({ 
  className = 'mt-auto hover:cursor-pointer transition-all duration-300 active:scale-95 rounded-full bg-[#CB101F] w-max p-3',
  ariaLabel = 'Scroll to top'
}: ScrollToTopButtonProps) {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={className}
      aria-label={ariaLabel}
    >
      <svg
        width="14"
        height="16"
        viewBox="0 0 14 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 16L7 2M7 2L1 8M7 2L13 8" stroke="#ECEEEC" strokeWidth="1.5" />
      </svg>
    </button>
  )
}
