import type { ContactUsBlock as ContactUsBlockProps } from 'src/payload-types'
import type { Footer } from '@/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getLocale } from '@/utilities/getLocale'
import { getGoogleReviews } from '@/blocks/Testimonials/getGoogleReviews'
import { GoogleRatingBadge } from '@/blocks/Testimonials/GoogleRatingBadge'
import { ContactForm } from './ContactForm'

type Props = ContactUsBlockProps & {
  className?: string
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 flex-none">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0122 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 flex-none">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 6 10-6" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 flex-none">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 flex-none">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

const STEPS = [
  { title: 'You reach out', description: 'Submit the form or contact us directly - whichever is easiest for you.' },
  { title: 'We review your requirement', description: 'Our team looks at what you need and follows up to understand it properly.' },
  { title: 'We propose the right solution', description: "No generic pitch - a recommendation based on your actual business." },
]

export const ContactUsBlock: React.FC<Props> = async ({
  className,
  heading,
  subtitle,
  description,
  formFields,
  countryOptions,
  subjectOptions,
}) => {
  const locale = await getLocale()
  const [footerData, googleReviews] = await Promise.all([
    getCachedGlobal('footer', 1, locale)() as Promise<Footer>,
    getGoogleReviews(),
  ])

  const contactInfo = footerData?.contactInfo
  const phone = contactInfo?.phone
  const email = contactInfo?.email
  const address = contactInfo?.address
  const addressLine = [address?.building, address?.poBox].filter(Boolean).join(', ')
  const workingHours = contactInfo?.workingHours
  const hoursText =
    workingHours?.days && workingHours?.time
      ? `${workingHours.days} : ${workingHours.time}`
      : workingHours?.days || workingHours?.time

  const mapsSearchQuery = [address?.companyName, address?.building, address?.poBox].filter(Boolean).join(', ')
  const mapsSearchUrl = mapsSearchQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsSearchQuery)}`
    : undefined

  type InfoCard = { icon: React.ReactElement; label: string; value: string; href?: string }
  const infoCards: InfoCard[] = [
    phone ? { icon: <PhoneIcon />, label: 'Call Us', value: phone, href: `tel:${phone.replace(/\s/g, '')}` } : null,
    email ? { icon: <MailIcon />, label: 'Email Us', value: email, href: `mailto:${email}` } : null,
    addressLine ? { icon: <PinIcon />, label: 'Visit Us', value: addressLine, href: mapsSearchUrl } : null,
    hoursText ? { icon: <ClockIcon />, label: 'Working Hours', value: hoursText } : null,
  ].filter((c): c is InfoCard => c !== null)

  return (
    <section className={cn('bg-white py-8 md:py-10', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: heading + trust content */}
          <Reveal>
            {heading && <Eyebrow>{heading}</Eyebrow>}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
              {subtitle}
            </h1>
            {description && (
              <p className="mt-4 max-w-md text-gray-600 leading-relaxed">{description}</p>
            )}

            {typeof googleReviews?.rating === 'number' && (
              <GoogleRatingBadge
                rating={googleReviews.rating}
                userRatingsTotal={googleReviews.userRatingsTotal}
                mapsUrl={googleReviews.mapsUrl}
                className="mt-6"
              />
            )}

            {infoCards.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-4">
                {infoCards.map((card, i) => {
                  const content = (
                    <>
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#FDEBEC] text-primary_red">
                        {card.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {card.label}
                        </span>
                        <span
                          title={card.value}
                          className="block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-foreground sm:text-sm"
                        >
                          {card.value}
                        </span>
                      </span>
                    </>
                  )
                  const cardClassName =
                    'flex items-start gap-3 rounded-xl border border-border bg-gray-50/60 p-4 transition-colors'
                  return card.href ? (
                    <a
                      key={i}
                      href={card.href}
                      target={card.href.startsWith('http') ? '_blank' : undefined}
                      rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={cn(cardClassName, 'hover:border-primary_red/40 hover:bg-[#FDEBEC]/40')}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={i} className={cardClassName}>
                      {content}
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                What Happens Next
              </h2>
              <ol className="mt-4 space-y-4">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-foreground text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">{step.title}</span>
                      <span className="block text-sm text-gray-600">{step.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delayMs={100}>
            <ContactForm
              formFields={formFields}
              countryOptions={countryOptions}
              subjectOptions={subjectOptions}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
