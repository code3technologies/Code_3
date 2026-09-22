import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Locale } from '@/utilities/getLocale'
import type { Footer } from '@/payload-types'

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 flex-none">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0122 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 flex-none">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 6 10-6" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 flex-none">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 flex-none">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 flex-none">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12H3v-12zm7 0h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v6.31h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-4v-12z" />
    </svg>
  )
}

export async function TopBar({ locale }: { locale: Locale }) {
  const footerData = (await getCachedGlobal('footer', 1, locale)()) as Footer
  const contactInfo = footerData?.contactInfo
  const socialLinks = footerData?.socialLinks

  const phone = contactInfo?.phone
  const email = contactInfo?.email
  const workingHours = contactInfo?.workingHours
  const hoursText =
    workingHours?.days && workingHours?.time
      ? `${workingHours.days} : ${workingHours.time}`
      : workingHours?.days || workingHours?.time

  if (!phone && !email && !hoursText) return null

  return (
    <div className="sticky top-0 z-[60] bg-foreground text-white text-xs">
      <div className="container mx-auto px-4 sm:px-6 flex h-9 items-center justify-between gap-4">
        <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide">
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 whitespace-nowrap text-white/85 transition-colors hover:text-white"
            >
              <PhoneIcon />
              {phone}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 whitespace-nowrap text-white/85 transition-colors hover:text-white"
            >
              <MailIcon />
              {email}
            </a>
          )}
          {hoursText && (
            <span className="hidden items-center gap-1.5 whitespace-nowrap text-white/85 sm:flex">
              <ClockIcon />
              {hoursText}
            </span>
          )}
        </div>

        <div className="flex flex-none items-center gap-1.5 whitespace-nowrap text-white/85">
          <span className="relative flex h-2 w-2 flex-none">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          We&apos;re Online
          {(socialLinks?.instagram || socialLinks?.linkedin) && (
            <>
              <span className="hidden h-3.5 w-px bg-white/25 sm:inline-block" />
              <span className="hidden sm:inline">Follow Us On</span>
            </>
          )}
          {socialLinks?.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center opacity-90 transition-opacity hover:opacity-100"
            >
              <InstagramIcon />
            </a>
          )}
          {socialLinks?.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center opacity-90 transition-opacity hover:opacity-100"
            >
              <LinkedInIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
