'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'

// Define the simplified data structure for navigation pages
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
}

interface NavigationItem {
  id?: string | null
  label: string
  link: string
  type?: 'link' | 'dropdown' | 'mega' | 'anchor' | 'internal' | 'external' | null
  openInNewTab?: boolean | null
  order?: number | null
  subItems?: SubNavigationItem[] | null
}

interface SubNavigationItem {
  label: string
  link: string
  icon?: string | null
  description?: string | null
  openInNewTab?: boolean | null
}

// Navigation item component
const NavItem = ({ item, isMobile = false }: { item: NavigationItem; isMobile?: boolean }) => {
  const linkProps = {
    href: item.link,
    ...(item.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' }),
    className: `flex items-center gap-2 ${
      isMobile ? 'text-base font-semibold py-2' : 'hover:text-red-600 transition'
    }`,
  }

  return (
    <Link {...linkProps}>
      {item.label}
    </Link>
  )
}

// Mobile Service Section Component
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
      // Close all other services in this section
      currentSectionServices.clear()
      currentSectionServices.add(serviceId)
    }

    newExpanded.set(title, currentSectionServices)
    setExpandedServices(newExpanded)
  }

  return (
    <div className="w-full pb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left focus:outline-none transition-all duration-300"
      >
        <span className="text-lg font-semibold text-white">{title}</span>
        <span className="ml-2 text-2xl font-bold text-white transition-transform duration-300">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
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
                  <div className="flex items-center justify-between ml-4">
                    <Link
                      href={`/${page.slug || '#'}`}
                      className="text-white font-medium transition-colors duration-300 flex-1"
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
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {hasSubServices && (
                      <ul className="ml-8 space-y-2">
                        {pageSubs
                          .filter((sub: NavigationPageData) => sub && sub.id && sub.slug)
                          .map((sub: NavigationPageData) => (
                            <li key={sub.id}>
                              <Link
                                href={`/${sub.slug || '#'}`}
                                className="text-white/80 text-md transition-colors duration-300 block"
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

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, navigationPages = [] }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [showInfraMegaMenu, setShowInfraMegaMenu] = useState(false)
  const [showDigitalMegaMenu, setShowDigitalMegaMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [expandedServices, setExpandedServices] = useState<Map<string, Set<string>>>(new Map())

  // Extract data from CMS
  const logo = data?.logo
  const links = data?.links

  // Sort navigation items by order
  const allNavItems = (data?.navItems || []).sort((a: NavigationItem, b: NavigationItem) => (a.order || 0) - (b.order || 0))

  // Convert navigationPages to NavigationPageData[]
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
    return subServices.filter((sub: NavigationPageData) => {
      return sub.parentService === parentId
    })
  }

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) {
      setTheme(headerTheme)
    }
  }, [headerTheme, theme])

  // Close mega menus when clicking outside or pressing Escape
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

  // Close mega menus when pathname changes
  useEffect(() => {
    setShowInfraMegaMenu(false)
    setShowDigitalMegaMenu(false)
  }, [pathname])

  const closeMobileMenu = () => {
    setShowMobileMenu(false)
  }

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
        className={`bg-white/80 w-full backdrop-blur-lg max-w-[2000px] mx-auto z-50 lg:py-6 py-4 sticky top-0`}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div
          className={`w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-8`}
        >
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 w-[8rem] lg:w-[10rem]">
            <Logo
              logo={logo}
              href="/"
              width={100}
              height={69}
              loading="eager"
              priority="high"
              alt="Company Logo"
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex flex-1 justify-center space-x-8 items-center">
            {/* Dynamic Navigation Items */}
            {allNavItems.map((item: NavigationItem, index: number) => (
              <NavItem key={index} item={item} />
            ))}

            {/* Infra Services Button with +/- icon */}
            {infraPages.length > 0 && (
              <button
                onClick={toggleInfraMegaMenu}
                className="hover:text-red-600 transition flex items-center gap-1"
              >
                Infra Services
                <span className="text-xl font-bold transition-transform duration-300">
                  {showInfraMegaMenu ? '−' : '+'}
                </span>
              </button>
            )}

            {/* Digital Services Button with +/- icon */}
            {digitalPages.length > 0 && (
              <button
                onClick={toggleDigitalMegaMenu}
                className="hover:text-red-600 transition flex items-center gap-1"
              >
                Digital Services
                <span className="text-xl font-bold transition-transform duration-300">
                  {showDigitalMegaMenu ? '−' : '+'}
                </span>
              </button>
            )}

            {/* Fallback Navigation Items */}
            {allNavItems.length === 0 && (
              <>
                <Link href="/about-us" className="hover:text-red-600 transition">
                  About Us
                </Link>
                <Link href="/careers" className="hover:text-red-600 transition">
                  Careers
                </Link>
              </>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {links && links.length > 0 && (
              <div className="flex gap-4 items-center">
                {links.map(({ link }, i) => {
                  return <CMSLink key={i} {...link} />
                })}
              </div>
            )}

          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center space-x-2">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label="Toggle menu">
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 h-screen z-40">
            <div className="space-y-3 flex flex-col h-full"
              style={{
                  background: 'linear-gradient(-135deg, #8b0f1f 0%, #d7213c 20%, #2d0e0e 100%)',
                }}
            >
              {/* Mobile Logo and Close Button */}
              <div className="px-6 py-3 flex items-center justify-between bg-white">
                <Logo
                  logo={logo}
                  href="/"
                  width={70}
                  height={45}
                  loading="eager"
                  priority="high"
                  alt="Company Logo"
                />
                <button
                  onClick={closeMobileMenu}
                  className="text-black transition-transform duration-300 hover:scale-110"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div
                className="p-6 flex-1 flex flex-col scrollbar-hide overflow-y-auto"
              >
                {/* Dynamic Navigation Items for Mobile */}
                <div className="space-y-2">
                  {allNavItems.map((item: NavigationItem, index: number) => (
                    <div key={index} className="pb-2">
                      <Link
                        href={item.link}
                        className="text-white text-lg font-semibold block transition-colors duration-300"
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </div>
               
                {/* Infra Services Section */}
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

                {/* Mobile Contact Button */}
                <div className="pt-4 mt-auto">
                  {links && links.length > 0 && (
                    <div className="flex flex-col gap-4 items-center">
                      {links.map(({ link }, i) => {
                        return <CMSLink key={i} className='w-full text-center' {...link} />
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Infra Services Mega Menu */}
      {showInfraMegaMenu && (
        <div
          className="fixed inset-0 top-[5rem] p-16 z-40 h-[calc(100vh-5rem)] scrollbar-hide overflow-auto text-white"
          style={{ background: 'linear-gradient(-135deg, #8b0f1f 0%, #d7213c 20%, #2d0e0e 100%)' }}
        >
          <div className="max-w-7xl h-full mx-auto flex gap-[6rem] justify-between">
            {/* Logo and Header */}
            <div className="mb-12">
              <p className="text-lg font-semibold mb-6">
                Complete IT, Security
                <br />
                & Infrastructure Solutions for
                <br />
                Businesses in UAE
              </p>
              <h1 className="text-7xl font-bold tracking-wide" style={{ fontFamily: 'monospace' }}>
                CODE3
              </h1>
            </div>

            {/* Services Grid */}
            <div className="h-full max-w-3xl scrollbar-hide overflow-auto">
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-[4rem] gap-y-[4rem]">
                {infraPages
                  .filter((page: NavigationPageData) => page && page.id && page.slug)
                  .map((page: NavigationPageData) => {
                    const subServices = getSubServices(page.id, infraSubServices).filter(
                      (sub: NavigationPageData) => sub && sub.id && sub.slug,
                    )
                    return (
                      <div key={page.id}>
                        {/* Parent Service - Now Clickable */}
                        <Link
                          href={`/${page.slug || '#'}`}
                          className="text-xl font-bold mb-6 uppercase transition block"
                          onClick={() => setShowInfraMegaMenu(false)}
                        >
                          <h2>{page.title}</h2>
                        </Link>

                        {/* Sub Services */}
                        {subServices.length > 0 && (
                          <ul className="space-y-3 text-sm">
                            {subServices.map((sub: NavigationPageData) => (
                              <li key={sub.id}>
                                <Link
                                  href={`/${sub.slug || '#'}`}
                                  className="transition"
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
        <div
          className="fixed inset-0 top-[5rem] p-16 z-40 h-[calc(100vh-5rem)] scrollbar-hide overflow-auto text-white"
          style={{ background: 'linear-gradient(-135deg, #8b0f1f 0%, #d7213c 20%, #2d0e0e 100%)' }}
        >
          <div className="max-w-7xl h-full mx-auto flex gap-[6rem] justify-between">
            {/* Logo and Header */}
            <div className="mb-12">
              <p className="text-lg font-semibold mb-6">
                Complete IT, Security
                <br />
                & Digital Solutions for
                <br />
                Businesses in UAE
              </p>
              <h1
                className="text-7xl font-bold tracking-wide"
                style={{ fontFamily: 'monospace' }}
              >
                CODE3
              </h1>
            </div>

            {/* Services Grid */}
            <div className="h-full max-w-3xl scrollbar-hide overflow-auto">
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-[4rem] gap-y-[4rem]">
                {digitalPages
                  .filter((page: NavigationPageData) => page && page.id && page.slug)
                  .map((page: NavigationPageData) => {
                    const subServices = getSubServices(page.id, digitalSubServices).filter(
                      (sub: NavigationPageData) => sub && sub.id && sub.slug,
                    )
                    return (
                      <div key={page.id}>
                        {/* Parent Service - Now Clickable */}
                        <Link
                          href={`/${page.slug || '#'}`}
                          className="text-xl font-bold mb-6 uppercase transition block"
                          onClick={() => setShowDigitalMegaMenu(false)}
                        >
                          <h2>{page.title}</h2>
                        </Link>

                        {/* Sub Services */}
                        {subServices.length > 0 && (
                          <ul className="space-y-3 text-sm">
                            {subServices.map((sub: NavigationPageData) => (
                              <li key={sub.id}>
                                <Link
                                  href={`/${sub.slug || '#'}`}
                                  className="transition"
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
