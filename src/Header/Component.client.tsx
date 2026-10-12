'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ChevronDown, Menu, ShoppingCart, X } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { CalendlyButton } from './CalendlyButton'
import { useDeviceCart } from '@/providers/DeviceCart'
import { LocaleToggle } from './LocaleToggle'
import { HeaderSearchBox } from './HeaderSearchBox'
import type {
  NavigationItem,
  NavigationPageData,
  ProductBrandData,
  TechPartnerData,
} from './types'

// ssr: false is correct for all three - they're gated behind boolean state
// that's false at SSR time regardless of code-splitting (nothing here was
// ever in the server-rendered HTML to begin with), and the Footer already
// links the same service pages server-side, so there's no crawlability
// regression. A minimal backdrop placeholder avoids a dead moment between
// clicking the toggle and the overlay appearing on a throttled connection.
const MobileMenu = dynamic(() => import('./MobileMenu'), {
  ssr: false,
  loading: () => <div className="lg:hidden fixed inset-0 h-screen z-40 bg-black/20" />,
})
const InfraMegaMenu = dynamic(() => import('./InfraMegaMenu'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 top-[7.25rem] z-40 bg-black/40" />,
})
const ProductsMegaMenu = dynamic(() => import('./ProductsMegaMenu'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 top-[5rem] z-40 bg-black/40" />,
})

interface HeaderClientProps {
  data: Header
  navigationPages?: NavigationPageData[]
  techPartners?: TechPartnerData[]
  productBrands?: ProductBrandData[]
}

const NavDropdown = ({
  item,
  isOpen,
  onToggle,
  onClose,
  techPartners = [],
}: {
  item: NavigationItem
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  techPartners?: TechPartnerData[]
}) => {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)

  const subItems = item.subItems || []
  if (subItems.length === 0) return null

  const hasTechPartnersPanel =
    techPartners.length > 0 &&
    subItems.some((s) => s.label.trim().toLowerCase() === 'technology partners')
  const showPartnersGrid = hasTechPartnersPanel && hoveredLabel?.trim().toLowerCase() === 'technology partners'

  return (
    <div className="relative">
      <button onClick={onToggle} className="hover:text-red-600 transition flex items-center gap-1">
        {item.label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen &&
        (hasTechPartnersPanel ? (
          <div className="absolute left-1/2 top-full z-20 mt-3 flex -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
            <div className="w-56 flex-none bg-foreground py-3" onMouseLeave={() => setHoveredLabel(null)}>
              {subItems.map((sub, i) => (
                <Link
                  key={i}
                  href={sub.link}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredLabel(sub.label)}
                  {...(sub.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
                  className={`group flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${
                    sub.label.trim().toLowerCase() === 'technology partners' && hoveredLabel === sub.label
                      ? 'bg-primary_red text-white'
                      : 'text-white/90 hover:bg-primary_red hover:text-white'
                  }`}
                >
                  {sub.label}
                  <span
                    className={`transition-opacity ${
                      sub.label.trim().toLowerCase() === 'technology partners'
                        ? hoveredLabel === sub.label
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                        : 'opacity-0'
                    }`}
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
            {showPartnersGrid && (
              <div className="w-[34rem] flex-none p-5">
                <div className="grid grid-cols-6 gap-2">
                  {techPartners.map((p, i) => (
                    <div
                      key={i}
                      className="flex h-14 items-center justify-center rounded-md border border-border bg-white p-1.5 transition-all duration-200 hover:scale-105 hover:border-primary_red/40 hover:shadow-sm"
                    >
                      {p.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.logoUrl}
                          alt={p.name}
                          className="h-8 w-auto max-w-full object-contain grayscale transition-all duration-200 hover:grayscale-0"
                        />
                      ) : (
                        <span className="text-center text-[10px] font-bold leading-tight text-black">
                          {p.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <Link
                  href="/technology-partners"
                  onClick={onClose}
                  className="mt-4 inline-block text-xs font-semibold text-primary_red hover:underline"
                >
                  View all technology partners →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute left-1/2 top-full mt-3 w-56 -translate-x-1/2 rounded-xl border border-border bg-white py-2 shadow-lg">
            {subItems.map((sub, i) => (
              <Link
                key={i}
                href={sub.link}
                onClick={onClose}
                {...(sub.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
                className="block px-4 py-2 text-sm text-foreground hover:bg-gray-50 hover:text-red-600 transition"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        ))}
    </div>
  )
}

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

export const HeaderClient: React.FC<HeaderClientProps> = ({
  data,
  navigationPages = [],
  techPartners = [],
  productBrands = [],
}) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [showInfraMegaMenu, setShowInfraMegaMenu] = useState(false)
  const [showProductsMegaMenu, setShowProductsMegaMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null)
  const [openMobileDropdownIndex, setOpenMobileDropdownIndex] = useState<number | null>(null)
  const [expandedServices, setExpandedServices] = useState<Map<string, Set<string>>>(new Map())
  const { items: cartItems, openCart } = useDeviceCart()

  const logo = data?.logo
  const links = data?.links
  const calendlyUrl = data?.calendlyUrl

  // Memoized: these re-derive from the full sitewide nav-pages list (grows with
  // every published page) and were previously recomputed on every render,
  // including unrelated re-renders like hover/menu-toggle state changes.
  const allNavItems = React.useMemo(
    () => [...(data?.navItems || [])].sort((a: NavigationItem, b: NavigationItem) => (a.order || 0) - (b.order || 0)),
    [data?.navItems],
  )

  const servicePages = navigationPages as NavigationPageData[]
  const infraPages = React.useMemo(
    () => servicePages.filter((p: NavigationPageData) => p.serviceCategory === 'infrastructure' && !p.isSubService),
    [servicePages],
  )
  const infraSubServices = React.useMemo(
    () => servicePages.filter((p: NavigationPageData) => p.serviceCategory === 'infrastructure' && p.isSubService),
    [servicePages],
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowInfraMegaMenu(false)
        setOpenDropdownIndex(null)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    setShowInfraMegaMenu(false)
    setOpenDropdownIndex(null)
  }, [pathname])

  const closeMobileMenu = () => {
    setShowMobileMenu(false)
  }

  const toggleInfraMegaMenu = () => {
    setShowInfraMegaMenu(!showInfraMegaMenu)
    setShowProductsMegaMenu(false)
    setOpenDropdownIndex(null)
  }

  const toggleProductsMegaMenu = () => {
    setShowProductsMegaMenu(!showProductsMegaMenu)
    setShowInfraMegaMenu(false)
    setOpenDropdownIndex(null)
  }

  const anyMegaMenuOpen = showInfraMegaMenu || showProductsMegaMenu

  useEffect(() => {
    if (!anyMegaMenuOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowInfraMegaMenu(false)
        setShowProductsMegaMenu(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [anyMegaMenuOpen])

  const [menuSearchQuery, setMenuSearchQuery] = useState('')
  useEffect(() => {
    if (!anyMegaMenuOpen) setMenuSearchQuery('')
  }, [anyMegaMenuOpen])

  // Which brand's products are shown by default (before any search) - defaults to
  // the first brand with products whenever the Products menu opens, so it's never
  // showing five brands' worth of thumbnails at once.
  const [activeProductBrand, setActiveProductBrand] = useState<string | null>(null)
  useEffect(() => {
    if (showProductsMegaMenu) {
      setActiveProductBrand(productBrands.find((b) => b.devices.length > 0)?.brand || null)
    }
  }, [showProductsMegaMenu, productBrands])

  // Which infra category is shown in the detail pane - defaults to the first
  // category whenever the menu opens, so only one category's services show at a time.
  const [activeInfraCategory, setActiveInfraCategory] = useState<string | null>(null)
  useEffect(() => {
    if (showInfraMegaMenu) {
      const first = servicePages.find(
        (p) => p.serviceCategory === 'infrastructure' && !p.isSubService,
      )
      setActiveInfraCategory(first?.id || null)
    }
  }, [showInfraMegaMenu, servicePages])

  return (
    <>
      <header
        className={`bg-white/80 w-full backdrop-blur-lg max-w-[2000px] mx-auto z-50 lg:py-6 py-4 sticky top-9`}
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
          <div className="hidden lg:flex flex-1 min-w-0 justify-center space-x-5 rtl:space-x-reverse items-center">
            {/* Dynamic Navigation Items */}
            {allNavItems.map((item: NavigationItem, index: number) =>
              item.type === 'dropdown' ? (
                <NavDropdown
                  key={index}
                  item={item}
                  isOpen={openDropdownIndex === index}
                  onToggle={() => {
                    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
                    setShowInfraMegaMenu(false)
                  }}
                  onClose={() => setOpenDropdownIndex(null)}
                  techPartners={techPartners}
                />
              ) : (
                <NavItem key={index} item={item} />
              ),
            )}

            {/* Infra Services Button with chevron icon */}
            {infraPages.length > 0 && (
              <button
                onClick={toggleInfraMegaMenu}
                className="hover:text-red-600 transition flex items-center gap-1 whitespace-nowrap"
              >
                IT Infra Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${showInfraMegaMenu ? 'rotate-180' : ''}`}
                />
              </button>
            )}

            {/* Products Button with chevron icon */}
            {productBrands.length > 0 && (
              <button
                onClick={toggleProductsMegaMenu}
                className="hover:text-red-600 transition flex items-center gap-1 whitespace-nowrap"
              >
                Products
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${showProductsMegaMenu ? 'rotate-180' : ''}`}
                />
              </button>
            )}

            <HeaderSearchBox productBrands={productBrands} />

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

          <div className="hidden lg:flex flex-shrink-0 items-center gap-3">
            <LocaleToggle />
            {links && links.length > 0 && (
              <div className="flex gap-4 items-center">
                {links.map(({ link }, i) => {
                  if (calendlyUrl && link?.label?.trim().toLowerCase() === "let's keep in touch") {
                    return (
                      <CalendlyButton
                        key={i}
                        label={link.label}
                        url={calendlyUrl}
                        appearance={link.appearance || undefined}
                      />
                    )
                  }
                  return <CMSLink key={i} {...link} />
                })}
              </div>
            )}

            {cartItems.length > 0 && (
              <button
                onClick={openCart}
                aria-label="Open quote cart"
                className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary_red hover:text-primary_red"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary_red text-[10px] font-bold text-white">
                  {cartItems.length}
                </span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label="Toggle menu">
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <MobileMenu
            logo={logo}
            allNavItems={allNavItems}
            openMobileDropdownIndex={openMobileDropdownIndex}
            setOpenMobileDropdownIndex={setOpenMobileDropdownIndex}
            closeMobileMenu={closeMobileMenu}
            productBrands={productBrands}
            infraPages={infraPages}
            infraSubServices={infraSubServices}
            getSubServices={getSubServices}
            expandedServices={expandedServices}
            setExpandedServices={setExpandedServices}
            links={links}
            calendlyUrl={calendlyUrl}
            cartItems={cartItems}
            openCart={openCart}
          />
        )}
      </header>

      {/* Infra Services Mega Menu */}
      {showInfraMegaMenu && (
        <InfraMegaMenu
          infraPages={infraPages}
          infraSubServices={infraSubServices}
          getSubServices={getSubServices}
          setShowInfraMegaMenu={setShowInfraMegaMenu}
          menuSearchQuery={menuSearchQuery}
          setMenuSearchQuery={setMenuSearchQuery}
          activeInfraCategory={activeInfraCategory}
          setActiveInfraCategory={setActiveInfraCategory}
        />
      )}

      {/* Products Mega Menu */}
      {showProductsMegaMenu && (
        <ProductsMegaMenu
          productBrands={productBrands}
          setShowProductsMegaMenu={setShowProductsMegaMenu}
          activeProductBrand={activeProductBrand}
          setActiveProductBrand={setActiveProductBrand}
          menuSearchQuery={menuSearchQuery}
          setMenuSearchQuery={setMenuSearchQuery}
        />
      )}
    </>
  )
}
