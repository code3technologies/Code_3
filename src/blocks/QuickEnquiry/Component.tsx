import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { MiniContactForm } from '@/components/site/MiniContactForm'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface QuickEnquiryBlockProps {
  title?: string
  description?: string | null
  className?: string
  promoEnabled?: boolean | null
  promoBadge?: string | null
  promoTitle?: string | null
  promoTagline?: string | null
  promoDescription?: string | null
  promoFeatures?: { text: string; id?: string | null }[] | null
  promoNote?: string | null
  promoCtaLabel?: string | null
  promoCtaUrl?: string | null
  sidebarImage?: (string | null) | MediaType
  formOnDark?: boolean | null
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M3 12v7a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M12 8c-1.5 0-3-1.2-3-3a2.5 2.5 0 015 0c0-1.5 1.5-3 3-3a2.5 2.5 0 010 5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5 flex-none">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export const QuickEnquiryBlock: React.FC<QuickEnquiryBlockProps> = ({
  title,
  description,
  className,
  promoEnabled,
  promoBadge,
  promoTitle,
  promoTagline,
  promoDescription,
  promoFeatures,
  promoNote,
  promoCtaLabel,
  promoCtaUrl,
  sidebarImage,
  formOnDark,
}) => {
  return (
    <div
      data-quick-enquiry-form
      className={cn('bg-white py-8 lg:absolute lg:inset-x-0 lg:top-0 lg:bg-transparent lg:py-0 lg:pointer-events-none', className)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:flex lg:flex-col lg:items-end">
        <MiniContactForm
          title={title}
          description={description}
          onDark={Boolean(formOnDark)}
          className="mx-auto max-w-md lg:pointer-events-auto lg:mx-0 lg:mt-8 lg:w-[360px]"
        />

        {promoEnabled && promoTitle && (
          <div className="relative mx-auto mt-4 max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-primary_red via-primary_red to-[#6d0b12] p-5 shadow-xl ring-1 ring-black/5 lg:pointer-events-auto lg:mx-0 lg:w-[360px]">
            {/* Decorative glow accents */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-black/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-3">
              {promoBadge && (
                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ring-1 ring-white/20">
                  {promoBadge}
                </span>
              )}
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-primary_red shadow-md">
                <GiftIcon />
              </span>
            </div>

            <h3 className="relative mt-3 text-2xl font-extrabold leading-tight text-white">{promoTitle}</h3>
            {promoTagline && <p className="relative mt-1 text-sm font-semibold italic text-white/90">{promoTagline}</p>}
            {promoDescription && (
              <p className="relative mt-2 text-sm leading-relaxed text-white/80">{promoDescription}</p>
            )}

            {promoFeatures && promoFeatures.length > 0 && (
              <ul className="relative mt-4 space-y-2 border-t border-white/15 pt-4">
                {promoFeatures.map((feature, index) => (
                  <li key={feature.id || index} className="flex items-start gap-2.5 text-sm font-medium text-white">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/20 text-white">
                      <CheckIcon />
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>
            )}

            {promoCtaLabel && promoCtaUrl && (
              <Link
                href={promoCtaUrl}
                className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-primary_red shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.98]"
              >
                {promoCtaLabel}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-none">
                  <path
                    d="M3.333 8h9.334M8.667 3.667L13 8l-4.333 4.333"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
            {promoNote && <p className="relative mt-2.5 text-center text-xs font-medium text-white/60">{promoNote}</p>}
          </div>
        )}

        {sidebarImage && (
          <div className="mx-auto mt-4 max-w-md overflow-hidden rounded-2xl lg:pointer-events-auto lg:mx-0 lg:w-[360px]">
            <Media resource={sidebarImage} imgClassName="h-auto w-full object-cover" />
          </div>
        )}
      </div>
    </div>
  )
}
