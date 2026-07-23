'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

import type { Footer, Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

interface NavigationPageData {
  id: string
  slug: string | null | undefined
  title: string
  serviceCategory: 'none' | 'infrastructure' | 'digital' | null | undefined
  parentService: string | null
  isSubService: boolean
}

interface HeaderClientProps {
  data: Header
  navigationPages?: NavigationPageData[]
  contactInfo?: Footer['contactInfo'] | null
}

interface NavigationItem {
  id?: string | null
  label: string
  link: string
  type?: 'link' | 'dropdown' | 'mega' | 'anchor' | 'internal' | 'external' | null
  openInNewTab?: boolean | null
  order?: number | null
}

const getServiceLink = (page: NavigationPageData): string => {
  if (!page.slug) return '#'

  if (page.serviceCategory && page.serviceCategory !== 'none') {
    return `/service/${page.slug}`
  }

  return `/${page.slug}`
}

const MobileServiceSection = ({
  title,
  pages,
  subServices,
  getSubServices,
  onLinkClick,
  expandedServices,
  setExpandedServices,
}: {
  title: string
  pages: NavigationPageData[]
  subServices: NavigationPageData[]
  getSubServices: (parentId: string, subServices: NavigationPageData[]) => NavigationPageData[]
  onLinkClick: () => void
  expandedServices: Map<string, Set<string>>
  setExpandedServices: React.Dispatch<React.SetStateAction<Map<string, Set<string>>>>
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleService = (serviceId: string) => {
    const newExpanded = new Map(expandedServices)
    const currentSectionServices = newExpanded.get(title) || new Set<string>()

    if (currentSectionServices.has(serviceId)) {
      currentSectionServices.delete(serviceId)
    } else {
      currentSectionServices.clear()
      currentSectionServices.add(serviceId)
    }

    newExpanded.set(title, currentSectionServices)
    setExpandedServices(newExpanded)
  }

  return (
    <div className="w-full border-b border-white/10 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-jetmono flex w-full items-center justify-between py-3 text-left text-xs uppercase tracking-[0.1em] text-code3-signal focus:outline-none"
      >
        {title}
        <span className="ml-2 text-xl font-bold text-white transition-transform duration-300">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'mt-3 max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="space-y-3">
          {pages
            .filter((page: NavigationPageData) => page && page.id && page.slug)
            .map((page: NavigationPageData) => {
              const pageSubs = getSubServices(page.id, subServices)
              const hasSubServices = pageSubs.length > 0
              const currentSectionServices = expandedServices.get(title) || new Set<string>()
              const isExpanded = currentSectionServices.has(page.id)

              return (
                <div key={page.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={getServiceLink(page)}
                      className="font-grotesk flex-1 text-white transition-colors duration-300"
                      onClick={onLinkClick}
                    >
                      {page.title}
                    </Link>
                    {hasSubServices && (
                      <button
                        onClick={() => toggleService(page.id)}
                        className="ml-2 text-xl font-bold text-white transition-transform duration-300"
                      >
                        {isExpanded ? '−' : '+'}
                      </button>
                    )}
                  </div>

                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-500 ease-in-out',
                      isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
                    )}
                  >
                    {hasSubServices && (
                      <ul className="ml-4 space-y-2">
                        {pageSubs
                          .filter((sub: NavigationPageData) => sub && sub.id && sub.slug)
                          .map((sub: NavigationPageData) => (
                            <li key={sub.id}>
                              <Link
                                href={getServiceLink(sub)}
                                className="font-inter block text-[15px] text-code3-slate-light transition-colors duration-300"
                                onClick={onLinkClick}
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  data,
  navigationPages = [],
  contactInfo,
}) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [showInfraMegaMenu, setShowInfraMegaMenu] = useState(false)
  const [showDigitalMegaMenu, setShowDigitalMegaMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [expandedServices, setExpandedServices] = useState<Map<string, Set<string>>>(new Map())

  const logo = data?.logo
  const links = data?.links

  const allNavItems = (data?.navItems || []).sort(
    (a: NavigationItem, b: NavigationItem) => (a.order || 0) - (b.order || 0),
  )

  const servicePages = navigationPages as NavigationPageData[]
  const infraPages = servicePages.filter(
    (p: NavigationPageData) => p.serviceCategory === 'infrastructure' && !p.isSubService,
  )
  const digitalPages = servicePages.filter(
    (p: NavigationPageData) => p.serviceCategory === 'digital' && !p.isSubService,
  )
  const infraSubServices = servicePages.filter(
    (p: NavigationPageData) => p.serviceCategory === 'infrastructure' && p.isSubService,
  )
  const digitalSubServices = servicePages.filter(
    (p: NavigationPageData) => p.serviceCategory === 'digital' && p.isSubService,
  )

  const getSubServices = (
    parentId: string,
    subServices: NavigationPageData[],
  ): NavigationPageData[] => {
    return subServices.filter((sub: NavigationPageData) => sub.parentService === parentId)
  }

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) {
      setTheme(headerTheme)
    }
  }, [headerTheme, theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowInfraMegaMenu(false)
        setShowDigitalMegaMenu(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    setShowInfraMegaMenu(false)
    setShowDigitalMegaMenu(false)
    setShowMobileMenu(false)
  }, [pathname])

  const closeMobileMenu = () => setShowMobileMenu(false)

  const toggleInfraMegaMenu = () => {
    setShowInfraMegaMenu(!showInfraMegaMenu)
    setShowDigitalMegaMenu(false)
  }

  const toggleDigitalMegaMenu = () => {
    setShowDigitalMegaMenu(!showDigitalMegaMenu)
    setShowInfraMegaMenu(false)
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-[100] border-b border-white/10 bg-code3-ink transition-shadow duration-[400ms]',
          scrolled && 'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]',
        )}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        {/* Top bar */}
        <div className="border-b border-white/10 max-[1024px]:hidden">
          <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-5 px-8 py-2">
            <div className="flex items-center gap-6">
              <span className="font-jetmono flex items-center gap-1.5 text-xs font-medium text-code3-signal">
                <span className="relative h-2 w-2 rounded-full bg-code3-signal">
                  <span className="c3-status-dot absolute inset-0 rounded-full" />
                </span>
                We&apos;re Online
              </span>
              {contactInfo?.phone && (
                <a
                  href={`tel:${contactInfo.phone.replace(/[^+\d]/g, '')}`}
                  className="font-jetmono flex items-center gap-1.5 text-xs text-code3-slate-light transition-colors hover:text-code3-signal"
                >
                  <PhoneIcon />
                  {contactInfo.phone}
                </a>
              )}
              {contactInfo?.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="font-jetmono flex items-center gap-1.5 text-xs text-code3-slate-light transition-colors hover:text-code3-signal"
                >
                  <MailIcon />
                  {contactInfo.email}
                </a>
              )}
            </div>
            <div className="flex items-center gap-6">
              {contactInfo?.workingHours?.days && contactInfo?.workingHours?.time && (
                <span className="font-jetmono flex items-center gap-1.5 text-xs text-code3-slate-light">
                  <ClockIcon />
                  {contactInfo.workingHours.days}, {contactInfo.workingHours.time}
                </span>
              )}
              {contactInfo?.address?.building && (
                <span className="font-jetmono flex items-center gap-1.5 text-xs text-code3-slate-light">
                  <PinIcon />
                  {contactInfo.address.building}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div
          className={cn(
            'mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-8 transition-[padding] duration-[400ms] max-[1024px]:px-5',
            scrolled ? 'py-3.5' : 'py-5',
          )}
        >
          <div className="flex w-32 flex-shrink-0 items-center lg:w-40">
            <Logo logo={logo} href="/" width={130} height={40} loading="eager" priority="high" alt="CODE3" />
          </div>

          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            <div className="group relative">
              <button className="font-inter flex items-center gap-1.5 text-[14.5px] font-medium text-code3-slate-light transition-colors group-hover:text-white group-focus-within:text-white">
                Company
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-40 min-w-[200px] -translate-x-1/2 translate-y-2 rounded-xl border border-white/10 bg-code3-ink2 p-5 opacity-0 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.5)] transition-all duration-200 group-hover:visible group-hover:translate-y-3.5 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-3.5 group-focus-within:opacity-100">
                <span className="font-jetmono mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-code3-signal">
                  Company
                </span>
                <ul className="space-y-0.5">
                  <li>
                    <Link href="/about-us" className="font-inter block py-1.5 text-[14.5px] text-code3-slate-light transition-colors hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="font-inter block py-1.5 text-[14.5px] text-code3-slate-light transition-colors hover:text-white">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/posts" className="font-inter block py-1.5 text-[14.5px] text-code3-slate-light transition-colors hover:text-white">
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <Link href="/#industries" className="font-inter block py-1.5 text-[14.5px] text-code3-slate-light transition-colors hover:text-white">
                      Industries We Serve
                    </Link>
                  </li>
                  <li>
                    <Link href="/#accreditations" className="font-inter block py-1.5 text-[14.5px] text-code3-slate-light transition-colors hover:text-white">
                      Technology Partners
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {allNavItems.map((item: NavigationItem, index: number) => (
              <Link
                key={item.id || index}
                href={item.link}
                {...(item.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
                className="font-inter relative py-1 text-[14.5px] font-medium text-code3-slate-light transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            {infraPages.length > 0 && (
              <button
                onClick={toggleInfraMegaMenu}
                className="font-inter flex items-center gap-1.5 text-[14.5px] font-medium text-code3-slate-light transition-colors hover:text-white"
              >
                Infra Services
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform duration-300',
                    showInfraMegaMenu && 'rotate-180',
                  )}
                />
              </button>
            )}

            {digitalPages.length > 0 && (
              <button
                onClick={toggleDigitalMegaMenu}
                className="font-inter flex items-center gap-1.5 text-[14.5px] font-medium text-code3-slate-light transition-colors hover:text-white"
              >
                Digital Services
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform duration-300',
                    showDigitalMegaMenu && 'rotate-180',
                  )}
                />
              </button>
            )}
          </div>

          <div className="hidden items-center gap-3.5 lg:flex">
            <Link
              href="/#contact"
              className="font-jetmono mr-1 whitespace-nowrap text-[12.5px] text-code3-slate-light transition-colors hover:text-code3-signal"
            >
              Let&apos;s be in touch
            </Link>
            <Link
              href="/admin"
              className="font-inter rounded-full border border-white/10 px-[22px] py-[11px] text-sm font-semibold text-white transition-all duration-300 hover:border-code3-signal hover:text-code3-signal"
            >
              Login
            </Link>
            {links && links.length > 0 ? (
              <div className="flex items-center gap-3.5 [&_a]:font-inter [&_a]:rounded-full [&_a]:px-[22px] [&_a]:py-[11px] [&_a]:text-sm [&_a]:font-semibold">
                {links.map(({ link }, i) => {
                  const isOutline = link?.appearance === 'outline'
                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      className={cn(
                        'transition-all duration-300',
                        isOutline
                          ? 'border border-white/10 text-white hover:border-code3-signal hover:text-code3-signal'
                          : 'bg-code3-amber text-white hover:-translate-y-0.5',
                      )}
                    />
                  )
                })}
              </div>
            ) : (
              <Link
                href="/#contact"
                className="font-inter rounded-full bg-code3-amber px-[22px] py-[11px] text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle menu"
              className="text-white"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 top-0 z-40 h-screen bg-code3-ink lg:hidden">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <Logo logo={logo} href="/" width={100} height={32} loading="eager" priority="high" alt="CODE3" />
                <button onClick={closeMobileMenu} aria-label="Close menu" className="text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-2 border-b border-white/10 pb-3">
                  <span className="font-jetmono mb-2 block text-xs uppercase tracking-[0.1em] text-code3-signal">
                    Company
                  </span>
                  <div className="space-y-2">
                    <Link href="/about-us" className="font-grotesk block text-white" onClick={closeMobileMenu}>
                      About Us
                    </Link>
                    <Link href="/careers" className="font-grotesk block text-white" onClick={closeMobileMenu}>
                      Careers
                    </Link>
                    <Link href="/posts" className="font-grotesk block text-white" onClick={closeMobileMenu}>
                      Blogs
                    </Link>
                    <Link href="/#industries" className="font-grotesk block text-white" onClick={closeMobileMenu}>
                      Industries We Serve
                    </Link>
                    <Link href="/#accreditations" className="font-grotesk block text-white" onClick={closeMobileMenu}>
                      Technology Partners
                    </Link>
                  </div>
                </div>

                <div className="mb-2 space-y-1">
                  {allNavItems.map((item: NavigationItem, index: number) => (
                    <Link
                      key={item.id || index}
                      href={item.link}
                      className="font-grotesk block border-b border-white/10 py-3 text-lg text-white"
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {infraPages.length > 0 && (
                  <MobileServiceSection
                    title="Infra Services"
                    pages={infraPages}
                    subServices={infraSubServices}
                    getSubServices={getSubServices}
                    onLinkClick={closeMobileMenu}
                    expandedServices={expandedServices}
                    setExpandedServices={setExpandedServices}
                  />
                )}

                {digitalPages.length > 0 && (
                  <MobileServiceSection
                    title="Digital Services"
                    pages={digitalPages}
                    subServices={digitalSubServices}
                    getSubServices={getSubServices}
                    onLinkClick={closeMobileMenu}
                    expandedServices={expandedServices}
                    setExpandedServices={setExpandedServices}
                  />
                )}

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/admin"
                    className="font-inter block w-full rounded-full border border-white/20 py-3 text-center font-semibold text-white"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  {links && links.length > 0 ? (
                    links.map(({ link }, i) => (
                      <div key={i} onClick={closeMobileMenu}>
                        <CMSLink
                          {...link}
                          className={
                            link?.appearance === 'outline'
                              ? 'block w-full rounded-full border border-white/20 py-3 text-center font-inter font-semibold text-white'
                              : 'block w-full rounded-full bg-code3-amber py-3 text-center font-inter font-semibold text-white'
                          }
                        />
                      </div>
                    ))
                  ) : (
                    <Link
                      href="/#contact"
                      className="font-inter block w-full rounded-full bg-code3-amber py-3 text-center font-semibold text-white"
                      onClick={closeMobileMenu}
                    >
                      Contact Us
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Infra Services Mega Menu */}
      {showInfraMegaMenu && (
        <div className="fixed inset-0 top-[5rem] z-40 h-[calc(100vh-5rem)] overflow-auto bg-code3-ink p-16 text-white max-[1024px]:hidden">
          <div className="mx-auto flex h-full max-w-7xl justify-between gap-24">
            <div className="mb-12 max-w-xs flex-none">
              <p className="font-inter mb-6 text-lg font-semibold text-code3-slate-light">
                Complete IT, Security
                <br />
                &amp; Infrastructure Solutions for
                <br />
                Businesses in UAE
              </p>
            </div>

            <div className="h-full max-w-3xl overflow-auto">
              <div className="grid gap-x-16 gap-y-16 lg:grid-cols-2 xl:grid-cols-3">
                {infraPages
                  .filter((page: NavigationPageData) => page && page.id && page.slug)
                  .map((page: NavigationPageData) => {
                    const subServices = getSubServices(page.id, infraSubServices).filter(
                      (sub: NavigationPageData) => sub && sub.id && sub.slug,
                    )
                    return (
                      <div key={page.id}>
                        <Link
                          href={getServiceLink(page)}
                          className="font-grotesk mb-6 block text-xl font-bold uppercase text-white transition hover:text-code3-signal"
                          onClick={() => setShowInfraMegaMenu(false)}
                        >
                          <h2>{page.title}</h2>
                        </Link>
                        {subServices.length > 0 && (
                          <ul className="space-y-3 text-sm">
                            {subServices.map((sub: NavigationPageData) => (
                              <li key={sub.id}>
                                <Link
                                  href={getServiceLink(sub)}
                                  className="font-inter text-code3-slate-light transition hover:text-white"
                                  onClick={() => setShowInfraMegaMenu(false)}
                                >
                                  {sub.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital Services Mega Menu */}
      {showDigitalMegaMenu && (
        <div className="fixed inset-0 top-[5rem] z-40 h-[calc(100vh-5rem)] overflow-auto bg-code3-ink p-16 text-white max-[1024px]:hidden">
          <div className="mx-auto flex h-full max-w-7xl justify-between gap-24">
            <div className="mb-12 max-w-xs flex-none">
              <p className="font-inter mb-6 text-lg font-semibold text-code3-slate-light">
                Complete IT, Security
                <br />
                &amp; Digital Solutions for
                <br />
                Businesses in UAE
              </p>
            </div>

            <div className="h-full max-w-3xl overflow-auto">
              <div className="grid gap-x-16 gap-y-16 lg:grid-cols-2 xl:grid-cols-3">
                {digitalPages
                  .filter((page: NavigationPageData) => page && page.id && page.slug)
                  .map((page: NavigationPageData) => {
                    const subServices = getSubServices(page.id, digitalSubServices).filter(
                      (sub: NavigationPageData) => sub && sub.id && sub.slug,
                    )
                    return (
                      <div key={page.id}>
                        <Link
                          href={getServiceLink(page)}
                          className="font-grotesk mb-6 block text-xl font-bold uppercase text-white transition hover:text-code3-signal"
                          onClick={() => setShowDigitalMegaMenu(false)}
                        >
                          <h2>{page.title}</h2>
                        </Link>
                        {subServices.length > 0 && (
                          <ul className="space-y-3 text-sm">
                            {subServices.map((sub: NavigationPageData) => (
                              <li key={sub.id}>
                                <Link
                                  href={getServiceLink(sub)}
                                  className="font-inter text-code3-slate-light transition hover:text-white"
                                  onClick={() => setShowDigitalMegaMenu(false)}
                                >
                                  {sub.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 flex-shrink-0">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0122 16.92z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 flex-shrink-0">
      <path d="M4 4h16v16H4z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 flex-shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 flex-shrink-0">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
