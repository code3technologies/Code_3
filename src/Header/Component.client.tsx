'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ChevronDown, Search, Menu, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'

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
  icon?: string | null
  cssClass?: string | null
  openInNewTab?: boolean | null
  showInDesktop?: boolean | null
  showInMobile?: boolean | null
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

// Dynamic icon component
const DynamicIcon = ({ name, className = 'w-4 h-4' }: { name?: string; className?: string }) => {
  if (!name) return null

  const IconComponent = (
    LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>
  )[name]
  if (!IconComponent) return null

  return <IconComponent className={className} />
}

// Navigation item component
const NavItem = ({ item, isMobile = false }: { item: NavigationItem; isMobile?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)

  const linkProps = {
    href: item.link,
    ...(item.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' }),
    className: `flex items-center gap-2 ${item.cssClass || ''} ${
      isMobile ? 'text-base font-semibold py-2' : 'hover:text-red-600 transition'
    }`,
  }

  if (item.type === 'dropdown' || item.type === 'mega') {
    return (
      <div className="relative group">
        <button
          className={`flex items-center gap-2 ${item.cssClass || ''} ${
            isMobile ? 'text-base font-semibold py-2' : 'hover:text-red-600 transition'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {item.icon && <DynamicIcon name={item.icon} />}
          {item.label}
          <ChevronDown className="w-4 h-4" />
        </button>

        {isOpen && (
          <div
            className={`absolute top-full left-0 z-50 ${isMobile ? 'relative w-full' : 'min-w-48'}`}
          >
            <div
              className={`${
                isMobile ? 'bg-transparent space-y-1' : 'bg-white shadow-lg rounded-md border p-2'
              }`}
            >
              {item.subItems?.map((subItem: SubNavigationItem, index: number) => (
                <Link
                  key={index}
                  href={subItem.link}
                  className={`block ${
                    isMobile ? 'text-sm py-1' : 'px-3 py-2 text-sm hover:bg-gray-100 rounded'
                  }`}
                  {...(subItem.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <div className="flex items-center gap-2">
                    {subItem.icon && <DynamicIcon name={subItem.icon} className="w-3 h-3" />}
                    <div>
                      <div className="font-medium">{subItem.label}</div>
                      {subItem.description && (
                        <div className="text-xs text-gray-500">{subItem.description}</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Link {...linkProps}>
      {item.icon && <DynamicIcon name={item.icon} />}
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
}: {
  title: string
  pages: NavigationPageData[]
  subServices: NavigationPageData[]
  getSubServices: (parentId: string, subServices: NavigationPageData[]) => NavigationPageData[]
  onLinkClick: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set())

  const toggleService = (serviceId: string) => {
    const newExpanded = new Set(expandedServices)
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId)
    } else {
      newExpanded.add(serviceId)
    }
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
            .filter((page: NavigationPageData) => page && page.id && page.slug) // Filter out pages without slug
            .map((page: NavigationPageData) => {
              const pageSubs = getSubServices(page.id, subServices)
              const hasSubServices = pageSubs.length > 0
              const isExpanded = expandedServices.has(page.id)

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
                          .filter((sub: NavigationPageData) => sub && sub.id && sub.slug) // Filter out subs without slug
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

  // Extract data from CMS
  const logo = data?.logo
  const megaMenu = data?.megaMenu
  const ctaButtons = data?.ctaButtons
  const settings = data?.settings

  // Sort navigation items by order
  const sortedNavItems = (data?.navItems || [])
    .sort((a: NavigationItem, b: NavigationItem) => (a.order || 0) - (b.order || 0))
    .filter((item: NavigationItem) => item.showInDesktop !== false)

  const allNavItems = [...sortedNavItems]

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
        className={`${settings?.backgroundColor || 'bg-white/80'} w-full backdrop-blur-2xl relative z-50 lg:px-16 lg:py-6 py-4 ${
          settings?.stickyHeader ? 'sticky top-0' : ''
        }`}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div
          className={`w-full mx-auto px-4 flex justify-between items-center ${settings?.headerHeight || 'h-auto'}`}
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
          <div className="hidden md:flex flex-1 justify-center space-x-8 items-center">
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

          <div className="hidden md:flex items-center space-x-4">
            {settings?.showSearchIcon && (
              <Link
                href={settings?.searchLink || '/search'}
                className="hover:text-red-600 transition"
              >
                <Search className="w-5 h-5" />
              </Link>
            )}
            {ctaButtons?.showContactButton !== false && (
              <Link
                href={ctaButtons?.contactLink || '/contact'}
                className={`${settings?.hoverColor || 'hover:text-red-600'} transition`}
              >
                {ctaButtons?.contactText || 'Contact'}
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            {settings?.showSearchIcon && (
              <Link
                href={settings?.searchLink || '/search'}
                className="hover:text-red-600 transition"
              >
                <Search className="w-5 h-5" />
              </Link>
            )}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label="Toggle menu">
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 min-h-screen z-40 overflow-y-auto">
            <div className="bg-white space-y-3 flex flex-col h-full">
              {/* Mobile Logo and Close Button */}
              <div className="px-6 py-3 flex items-center justify-between">
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
                className="p-6 h-[calc(100vh-5rem)] flex flex-col"
                style={{
                  background: 'linear-gradient(-135deg, #8b0f1f 0%, #d7213c 20%, #2d0e0e 100%)',
                }}
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
                  />
                )}

                {/* Digital Services Section */}
                {digitalPages.length > 0 && (
                  <MobileServiceSection
                    title="Digital Services"
                    pages={digitalPages}
                    subServices={digitalSubServices}
                    getSubServices={getSubServices}
                    onLinkClick={closeMobileMenu}
                  />
                )}

                {/* Mobile Contact Button */}
                {ctaButtons?.showContactButton !== false && (
                  <div className="pt-4 mt-auto">
                    <Link
                      href={ctaButtons?.contactLink || '/contact'}
                      className="block w-full text-center bg-white text-red-600 py-3 rounded-full font-semibold hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
                      onClick={closeMobileMenu}
                    >
                      {ctaButtons?.contactText || 'Contact'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Infra Services Mega Menu */}
      {showInfraMegaMenu && (
        <div
          className="fixed inset-0 top-[5rem] p-16 z-40 h-[calc(100vh-5rem)] overflow-auto text-white"
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
              <h1 className="text-7xl font-bold" style={{ fontFamily: 'monospace' }}>
                {megaMenu?.brandText || 'CODE3'}
              </h1>
            </div>

            {/* Services Grid */}
            <div className="h-full max-w-3xl overflow-auto">
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
          className="fixed inset-0 top-[5rem] p-16 z-40 h-[calc(100vh-5rem)] overflow-auto text-white"
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
                className="text-7xl font-bold tracking-widest"
                style={{ fontFamily: 'monospace' }}
              >
                {megaMenu?.brandText || 'CODE3'}
              </h1>
            </div>

            {/* Services Grid */}
            <div className="h-full max-w-3xl overflow-auto">
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
