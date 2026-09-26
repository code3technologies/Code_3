import { getCachedGlobal } from '@/utilities/getGlobals'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import type { Footer, Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { ScrollToTopButton, ScrollToTopButtonMobile } from './ScrollToTopButton'
import { MapFacade } from './MapFacade'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import type { Locale } from '@/utilities/getLocale'
import { hasPublishedCaseStudies } from '@/utilities/getCaseStudies'
import { NewsletterSignup } from '@/components/NewsletterSignup'

interface ServicePageData {
  id: string
  slug: string
  title: string
  serviceCategory: 'infrastructure' | 'digital'
  parentService: string | null
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 flex-none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 flex-none">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 flex-none">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0122 16.92z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 flex-none">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 6 10-6" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.6l8-9.2L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
    </svg>
  )
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z" />
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12H3v-12zm7 0h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v6.31h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-4v-12z" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M23 12s0-3.5-.45-5.2a3 3 0 00-2.1-2.1C18.7 4.2 12 4.2 12 4.2s-6.7 0-8.45.5a3 3 0 00-2.1 2.1C1 8.5 1 12 1 12s0 3.5.45 5.2a3 3 0 002.1 2.1c1.75.5 8.45.5 8.45.5s6.7 0 8.45-.5a3 3 0 002.1-2.1C23 15.5 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  )
}

// Only needs to refetch when a page's slug/category/parentService/status changes -
// piggyback on the 'pages-sitemap' tag the pages collection already revalidates on
// every publish/unpublish, instead of refetching on every request.
const getFooterServicePages = (locale: 'en' | 'ar') =>
  unstable_cache(
    async (): Promise<ServicePageData[]> => {
      const payload = await getPayload({ config: configPromise })
      const servicePagesRes = await payload.find({
        collection: 'pages',
        depth: 0,
        limit: 300,
        locale,
        sort: ['navOrder', 'title'],
        where: {
          and: [
            { serviceCategory: { equals: 'infrastructure' } },
            { _status: { equals: 'published' } },
          ],
        },
      })

      return (servicePagesRes.docs as Page[])
        .filter((p) => p.slug && p.serviceCategory && p.serviceCategory !== 'none')
        .map((p) => ({
          id: p.id,
          slug: p.slug as string,
          title: p.title,
          serviceCategory: p.serviceCategory as 'infrastructure' | 'digital',
          parentService:
            typeof p.parentService === 'object' && p.parentService
              ? p.parentService.id
              : (p.parentService as string | null) || null,
        }))
    },
    ['footer-service-pages', locale],
    { tags: ['pages-sitemap'] },
  )

export async function Footer({ locale }: { locale: Locale }) {
  const [footerData, servicePages] = await Promise.all([
    getCachedGlobal('footer', 1, locale)() as Promise<Footer>,
    getFooterServicePages(locale)(),
  ])

  const navItems = footerData?.navItems || []
  // Only link Case Studies once one is published (avoids a footer link to a 404).
  const showCaseStudies = await hasPublishedCaseStudies()
  const description = footerData?.description
  const contactInfo = footerData?.contactInfo
  const bottomBar = footerData?.bottomBar
  const logo = footerData?.logo
  const socialLinks = footerData?.socialLinks

  const parentServices = servicePages.filter((p) => !p.parentService)
  const subServices = servicePages.filter((p) => p.parentService)
  const subServicesByParent: Record<string, ServicePageData[]> = {}
  for (const sub of subServices) {
    const key = sub.parentService as string
    if (!subServicesByParent[key]) subServicesByParent[key] = []
    subServicesByParent[key].push(sub)
  }

  const socialItems = [
    { url: socialLinks?.twitter, Icon: TwitterIcon, label: 'X (Twitter)' },
    { url: socialLinks?.facebook, Icon: FacebookIcon, label: 'Facebook' },
    { url: socialLinks?.linkedin, Icon: LinkedInIcon, label: 'LinkedIn' },
    { url: socialLinks?.instagram, Icon: InstagramIcon, label: 'Instagram' },
    { url: socialLinks?.youtube, Icon: YoutubeIcon, label: 'YouTube' },
  ].filter((s) => s.url)

  return (
    <footer className="bg-primary_red text-white relative">
      {/* Top Icon Bar */}
      <div className="border-b border-white/20">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_0.9fr] gap-6 lg:divide-x lg:divide-white/20">
          <div className="flex items-start gap-3 lg:pe-6">
            <PinIcon />
            <div className="text-sm">
              <div className="font-semibold">Address</div>
              <div className="text-white/75">{contactInfo?.address?.companyName}</div>
              <div className="text-white/75">{contactInfo?.address?.building}</div>
              <div className="text-white/75">{contactInfo?.address?.poBox}</div>
            </div>
          </div>
          <div className="flex items-start gap-3 lg:px-6">
            <ClockIcon />
            <div className="text-sm">
              <div className="font-semibold">Working Hours</div>
              <div className="text-white/75 whitespace-nowrap">
                {contactInfo?.workingHours?.days}: {contactInfo?.workingHours?.time}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 lg:px-6">
            <PhoneIcon />
            <div className="text-sm">
              <div className="font-semibold">Call Us</div>
              <a
                href={`tel:${contactInfo?.phone}`}
                className="text-white/75 hover:text-white transition-colors whitespace-nowrap"
              >
                {contactInfo?.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 lg:px-6">
            <MailIcon />
            <div className="text-sm">
              <div className="font-semibold">Mail Us</div>
              <a href={`mailto:${contactInfo?.email}`} className="text-white/75 hover:text-white transition-colors">
                {contactInfo?.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 lg:ps-6">
            <div className="text-sm">
              <div className="font-semibold mb-2">Follow Us</div>
              <div className="flex items-center gap-3">
                {socialLinks?.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white hover:text-primary_red transition-colors"
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
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white hover:text-primary_red transition-colors"
                  >
                    <LinkedInIcon />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Logo href="/" logo={logo} width={180} height={58} alt="Company Logo" variant="white" />
            </div>
            <p className="text-white/75 text-sm leading-relaxed max-w-sm">{description}</p>
            <NewsletterSignup source="footer" variant="footer" locale={locale} className="mt-8 max-w-sm" />
          </div>

          {/* Quick Links */}
          {navItems.length > 0 && (
            <div className="lg:col-span-4">
              <h3 className="inline-block text-xs font-semibold text-white uppercase tracking-wide mb-6 pb-2 border-b border-white/30">
                Quick Links
              </h3>
              <nav className="grid grid-cols-2 gap-x-6 gap-y-3">
                {navItems.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    className="text-white/80 hover:text-white hover:underline transition-colors text-sm"
                    {...link}
                  />
                ))}
                {showCaseStudies && (
                  <Link
                    href="/case-studies"
                    className="text-white/80 hover:text-white hover:underline transition-colors text-sm"
                  >
                    Case Studies
                  </Link>
                )}
              </nav>
            </div>
          )}

          {/* Map */}
          {contactInfo?.mapEmbedUrl && (
            <div className="lg:col-span-4">
              <h3 className="inline-block text-xs font-semibold text-white uppercase tracking-wide mb-6 pb-2 border-b border-white/30">
                Find Us
              </h3>
              <div className="overflow-hidden rounded-xl border-2 border-white/30">
                <MapFacade src={contactInfo.mapEmbedUrl} />
              </div>
            </div>
          )}
        </div>

        {/* All Services (fully expanded) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10">
          {parentServices.map((parent) => (
            <div key={parent.id}>
              <Link
                href={`/service/${parent.slug}`}
                className="block text-sm font-semibold text-white hover:underline mb-3"
              >
                {parent.title}
              </Link>
              {(subServicesByParent[parent.id] || []).length > 0 && (
                <ul className="space-y-2">
                  {(subServicesByParent[parent.id] || []).map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/service/${sub.slug}`}
                        className="text-xs text-white/70 hover:text-white hover:underline transition-colors"
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="grid gap-8 md:gap-4 max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 border-t border-white/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          <ScrollToTopButton />

          <div className="hidden md:block text-white/70 mt-auto text-sm">
            {bottomBar?.copyrightText}
          </div>

          {socialItems.length > 0 && (
            <div className="hidden md:flex items-center gap-3 md:col-start-4 md:justify-self-end">
              {socialItems.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white hover:text-primary_red transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          )}
        </div>

        <Link href="/services">
          <div className="w-full relative overflow-hidden active:scale-[0.995] transition-all">
            {bottomBar?.exploreServicesImage ? (
              <Media
                resource={bottomBar.exploreServicesImage}
                imgClassName="w-full h-[80px] lg:h-[120px] rounded-xl object-cover"
              />
            ) : (
              <div className="w-full h-26 rounded-xl bg-foreground"></div>
            )}

            <div className="absolute inset-0 flex items-center justify-between gap-5 px-5 sm:px-10 xl:px-14">
              <span>{bottomBar?.exploreServicesText}</span>
              <div className="rotate-45">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 16L7 2M7 2L1 8M7 2L13 8" stroke="#ECEEEC" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <div className="md:hidden flex justify-between items-center">
          <div className="text-white/70 text-sm">{bottomBar?.copyrightText}</div>
          <div className="flex items-center gap-3">
            {socialItems.map(({ url, Icon, label }) => (
              <a
                key={label}
                href={url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white"
              >
                <Icon />
              </a>
            ))}
            <ScrollToTopButtonMobile />
          </div>
        </div>
      </div>
    </footer>
  )
}
