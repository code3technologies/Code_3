'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ChevronDown, Search, Menu, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'

interface HeaderClientProps {
  data: Header
  navigationPages?: any[]
}

// Dynamic icon component
const DynamicIcon = ({ name, className = 'w-4 h-4' }: { name?: string; className?: string }) => {
  if (!name) return null

  const IconComponent = (LucideIcons as any)[name]
  if (!IconComponent) return null

  return <IconComponent className={className} />
}

// Navigation item component
const NavItem = ({ item, isMobile = false }: { item: any; isMobile?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)

  const linkProps = {
    href: item.link,
    ...(item.openInNewTab && { target: '_self', rel: 'noopener noreferrer' }),
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
              {item.subItems?.map((subItem: any, index: number) => (
                <Link
                  key={index}
                  href={subItem.link}
                  className={`block ${
                    isMobile ? 'text-sm py-1' : 'px-3 py-2 text-sm hover:bg-gray-100 rounded'
                  }`}
                  {...(subItem.openInNewTab && { target: '_self', rel: 'noopener noreferrer' })}
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

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left font-medium focus:outline-none"
      >
        <span className="text-base font-semibold text-white">{title}</span>
        <span className="ml-2 font-bold text-white">{open ? '-' : '+'}</span>
      </button>
      {open && <div className="pl-4 mt-1 text-sm space-y-1 text-white">{children}</div>}
    </div>
  )
}

function MenuItem({ children }: { children: React.ReactNode }) {
  return (
    <a href="#" className="block py-1 text-white">
      {children}
    </a>
  )
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, navigationPages = [] }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Extract data from CMS
  const logo = data?.logo
  const megaMenu = data?.megaMenu
  // Access custom CMS fields that may not yet be reflected in generated TS types
  const megaMenuSettings = data?.megaMenu as any
  const mobileMenu = data?.mobileMenu
  const ctaButtons = data?.ctaButtons
  const settings = data?.settings

  // Sort navigation items by order
  const sortedNavItems = (data?.navItems || [])
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .filter((item) => item.showInDesktop !== false)

  // Merge CMS navigation items with auto-generated ones
  const allNavItems = [...sortedNavItems, ...navigationPages]

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
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
          {allNavItems.map((item: any, index: number) => (
            <NavItem key={index} item={item} />
          ))}

          {/* Fallback Navigation Items */}
          {allNavItems.length === 0 && (
            <>
              <Link href="/about-us" className="hover:text-red-600 transition">
                About Us
              </Link>
              {/* <Link href="/infra-services" className="hover:text-red-600 transition">
                Infra Services
              </Link> */}
              <Link href="/careers" className="hover:text-red-600 transition">
                Careers
              </Link>
            </>
          )}

          {/* Digital Services Mega Menu */}
          {/* {(megaMenuSettings?.showMegaMenu ?? true) && (
            <div
              className=""
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <button className="hover:text-red-600 flex items-center">
                {(megaMenuSettings?.megaMenuLabel as string) || 'Digital services'}{' '}
                <span className="ml-1">+</span>
              </button>
              {showMegaMenu && (
                <div className="absolute left-0 lg:top-24 top-20 w-screen bg-gradient-to-br from-[#b0182a] to-[#45060a] text-white p-12 z-50">
                  <div className="max-w-7xl mx-auto grid grid-cols-4 gap-12">
                    <div className="">
                      <h2 className="text-white font-bold text-xl mb-12">
                        {megaMenu?.title ||
                          'Complete IT, Security & Digital Solutions for Businesses in UAE'}
                      </h2>
                      <span
                        className="mt-10 text-6xl font-bold tracking-widest"
                        style={{ fontFamily: 'monospace' }}
                      >
                        {megaMenu?.brandText || 'CODE3'}
                      </span>
                    </div>
                    <div></div>
                    {megaMenu?.serviceCategories
                      ?.slice(0, 3)
                      .map((category: any, index: number) => (
                        <div key={index}>
                          <h4 className="font-bold mb-2 text-white">{category.title}</h4>
                          <ul className="space-y-1 text-sm">
                            {category.services?.map((service: any, serviceIndex: number) => (
                              <li key={serviceIndex}>
                                {service.link ? (
                                  <a href={service.link} className="hover:text-gray-300">
                                    {service.name}
                                  </a>
                                ) : (
                                  service.name
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                  {megaMenu?.serviceCategories && megaMenu.serviceCategories.length > 3 && (
                    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-12 mt-8">
                      <div></div>
                      {megaMenu.serviceCategories
                        .slice(3, 6)
                        .map((category: any, index: number) => (
                          <div key={index}>
                            <h4 className="font-bold mb-2 text-white">{category.title}</h4>
                            <ul className="space-y-1 text-sm">
                              {category.services?.map((service: any, serviceIndex: number) => (
                                <li key={serviceIndex}>
                                  {service.link ? (
                                    <a href={service.link} className="hover:text-gray-300">
                                      {service.name}
                                    </a>
                                  ) : (
                                    service.name
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )} */}
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
          {/* {ctaButtons?.showLoginButton !== false && (
            <Link
              href={ctaButtons?.loginLink || '/login'}
              className={`ml-4 bg-black text-white px-4 py-1 ${
                ctaButtons?.buttonStyle === 'rounded'
                  ? 'rounded-lg'
                  : ctaButtons?.buttonStyle === 'pill'
                    ? 'rounded-full'
                    : ctaButtons?.buttonStyle === 'outline'
                      ? 'border border-black bg-transparent text-black hover:bg-black hover:text-white'
                      : 'rounded'
              }`}
            >
              {ctaButtons?.loginText || 'Login'}
            </Link>
          )} */}
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
        <div
          className="md:hidden fixed inset-0 min-h-screen z-40 flex flex-col "
          style={{
            background: 'linear-gradient(135deg,#d7213c 0%,#2d0e0e 100%)',
          }}
        >
          {/* Top bar: logo + close */}
          <div className="w-full mx-auto px-4 flex justify-between items-center bg-white z-50 h-16">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Logo loading="eager" priority="high" />
              </Link>
            </div>
            <button
              aria-label="Close menu"
              onClick={() => setShowMobileMenu(false)}
              className="text-gray-700 text-3xl absolute right-4 top-3"
            >
              &times;
            </button>
          </div>

          {/* Menu content */}
          <div className="flex-1 flex flex-col justify-start px-4 py-6 text-white space-y-2 overflow-auto">
            {/* Dynamic Navigation Items for Mobile */}
            {allNavItems
              .filter((item: any) => item.showInMobile !== false)
              .map((item: any, index: number) => (
                <NavItem key={index} item={item} isMobile={true} />
              ))}

            {/* Fallback Navigation Items for Mobile */}
            {allNavItems.length === 0 && (
              <>
                <Link href="/about-us" className="mb-3 text-base font-semibold">
                  About Us
                </Link>
                {/* <Link href="/infra-services" className="mb-3 text-base font-semibold">
                  Infra Services
                </Link> */}
                <Link href="/careers" className="mb-3 text-base font-semibold">
                  Careers
                </Link>
                <Link href="/contact" className="mb-3 text-base font-semibold">
                  Contact
                </Link>
              </>
            )}

            {/* Mobile Menu Sections */}
            {mobileMenu?.sections?.map((section: any, index: number) => (
              <MenuSection key={index} title={section.title}>
                {section.items?.map((item: any, itemIndex: number) => (
                  <MenuItem key={itemIndex}>
                    {item.link ? <span className="cursor-pointer">{item.name}</span> : item.name}
                  </MenuItem>
                ))}
              </MenuSection>
            ))}
          </div>

          {/* Buttons */}
          {/* <div className="flex items-center gap-3 px-4 pb-6 mt-auto">
            {ctaButtons?.showLoginButton !== false && (
              <Link
                href={ctaButtons?.loginLink || '/login'}
                className={`px-5 py-2 font-semibold shadow ${
                  ctaButtons?.buttonStyle === 'rounded'
                    ? 'rounded-lg bg-white text-black'
                    : ctaButtons?.buttonStyle === 'pill'
                      ? 'rounded-full bg-white text-black'
                      : ctaButtons?.buttonStyle === 'outline'
                        ? 'rounded border border-white text-white hover:bg-white hover:text-black'
                        : 'rounded-full bg-white text-black'
                }`}
              >
                {ctaButtons?.loginText || 'Login'}
              </Link>
            )}
            {ctaButtons?.showContactButton !== false && (
              <Link
                href={ctaButtons?.contactLink || '/contact'}
                className="px-5 py-2 rounded-full border border-white text-white font-semibold hover:bg-white hover:text-black transition"
              >
                {ctaButtons?.contactText || 'Contact'}
              </Link>
            )}
          </div> */}
        </div>
      )}
    </header>
  )
}
