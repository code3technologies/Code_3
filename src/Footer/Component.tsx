import { getCachedGlobal } from '@/utilities/getGlobals'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import type { Footer, Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { ScrollToTopButton } from './ScrollToTopButton'
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
                href={`tel:${contactInfo?.phone?.replace(/\s/g, '')}`}
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
                <iframe
                  src={contactInfo.mapEmbedUrl}
                  className="h-[220px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CODE3 location map"
                />
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
      </div>

      {/* Copyright strip */}
      <div className="bg-foreground">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-sm text-white/70">
          <div>
            {bottomBar?.copyrightText}
            {' | '}
            <Link href="/privacy-policy" className="hover:text-white hover:underline">
              Privacy Policy
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/about-us" className="hover:text-white hover:underline">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-white hover:underline">
              Contact Us
            </Link>
            <ScrollToTopButton
              className="hover:cursor-pointer transition-all duration-300 active:scale-95 rounded-full bg-white/10 hover:bg-white/20 w-max p-2"
              ariaLabel="Scroll to top"
            />
          </div>
        </div>
      </div>

    </footer>
  )
}
