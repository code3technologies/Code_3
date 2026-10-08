'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown, ChevronRight, Menu, Search, ShoppingCart, X } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { CalendlyButton } from './CalendlyButton'
import { useDeviceCart } from '@/providers/DeviceCart'
import { ServiceIcon } from '@/components/site/icons'
import { getIconForServiceTitle } from '@/components/site/serviceIconMap'

interface NavigationPageData {
  id: string
  slug: string | null | undefined
  title: string
  serviceCategory: 'none' | 'infrastructure' | 'digital' | null | undefined
  parentService: string | null
  isSubService: boolean
}

interface TechPartnerData {
  name: string
  logoUrl?: string | null
}

interface ProductDeviceData {
  id: string
  title: string
  slug: string
  imageUrl: string | null
  category?: string | null
}

interface ProductBrandData {
  brand: string
  devices: ProductDeviceData[]
}

interface HeaderClientProps {
  data: Header
  navigationPages?: NavigationPageData[]
  techPartners?: TechPartnerData[]
  productBrands?: ProductBrandData[]
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

function LocaleToggle({ className = '' }: { className?: string }) {
  const pathname = usePathname()
  const isArabic = pathname === '/ar' || pathname.startsWith('/ar/')
  const enPath = isArabic ? pathname.replace(/^\/ar/, '') || '/' : pathname
  const arPath = isArabic ? pathname : `/ar${pathname === '/' ? '' : pathname}`

  return (
    <div
      className={`inline-flex items-center rounded-full border border-foreground bg-background p-0.5 text-xs font-semibold sm:text-sm ${className}`}
    >
      {/* Plain <a> tags (not next/link) so switching locale always forces a full
          page navigation. Middleware rewrites both /ar and non-/ar paths to the
          same underlying route, so Next's client-side soft navigation can reuse
          the previous locale's cached RSC payload and appear "stuck" until a
          hard reload — this sidesteps that entirely. */}
      <a
        href={enPath}
        data-locale-link="en"
        aria-current={!isArabic ? 'page' : undefined}
        aria-label="Switch to English"
        className={`rounded-full px-3 py-1 transition-all duration-300 ${
          !isArabic ? 'bg-primary_red text-white' : 'text-foreground hover:text-primary_red'
        }`}
      >
        EN
      </a>
      <a
        href={arPath}
        aria-current={isArabic ? 'page' : undefined}
        aria-label="التبديل إلى العربية"
        className={`rounded-full px-3 py-1 transition-all duration-300 ${
          isArabic ? 'bg-primary_red text-white' : 'text-foreground hover:text-primary_red'
        }`}
      >
        العربية
      </a>
    </div>
  )
}

const HeaderSearchBox = ({
  className = 'w-28 lg:w-36',
  productBrands = [],
}: {
  className?: string
  productBrands?: ProductBrandData[]
}) => {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    const allDevices = productBrands.flatMap((b) => b.devices)
    const trimmedLower = trimmed.toLowerCase()

    // An exact product name (e.g. "Yealink MeetingBar A20") wins first and goes
    // straight to that device's own page - more specific than a brand match.
    const exactDevice = allDevices.find((d) => d.title.trim().toLowerCase() === trimmedLower)
    if (exactDevice) {
      router.push(`/service/device/${exactDevice.slug}`)
      return
    }

    // Otherwise, any other query that's clearly about one specific product -
    // the query appears inside the product name, or vice versa (e.g. "MVC640",
    // "meetingbar a20", "yealink ctp25 touch panel") - also goes straight to
    // that product's page. Guarded to queries of a few characters so a single
    // letter doesn't grab an arbitrary product. Ties broken by picking the
    // shortest matching title, i.e. the closest/most specific match.
    if (trimmedLower.length >= 3) {
      const partialMatches = allDevices.filter((d) => {
        const title = d.title.toLowerCase()
        return title.includes(trimmedLower) || trimmedLower.includes(title)
      })
      if (partialMatches.length > 0) {
        const closest = partialMatches.sort((a, b) => a.title.length - b.title.length)[0]
        router.push(`/service/device/${closest.slug}`)
        return
      }
    }

    // Otherwise, a product brand name - on its own or as part of a phrase like
    // "cisco products" or "buy yealink phones" - goes straight to that brand's
    // product page instead of the generic site search results. Matched as a
    // whole word so e.g. "poly" doesn't fire on unrelated words like "polygon".
    const matchedBrand = productBrands.find((b) =>
      new RegExp(`\\b${b.brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(trimmed),
    )
    if (matchedBrand) {
      router.push(`/service/${matchedBrand.brand.toLowerCase()}-video-conferencing-devices-dubai-uae`)
      return
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={onSubmit} className={`flex items-center rounded-full border border-border bg-white ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        aria-label="Search"
        className="w-full min-w-0 flex-1 bg-transparent px-4 py-1.5 text-sm text-foreground outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="flex-none pe-3 text-gray-500 hover:text-red-600 transition"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  )
}

const getServiceLink = (page: NavigationPageData): string => {
  if (!page.slug) return '#'
  
  if (page.serviceCategory && page.serviceCategory !== 'none') {
    return `/service/${page.slug}`
  }
  
  return `/${page.slug}`
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

// Falls back to a generic icon if the image URL 404s/fails to load - some device
// records have a broken externalUrl (e.g. renamed blob file), and a blank white
// box reads as a bug while an icon reads as "no photo yet".
const ProductThumbnail = ({ imageUrl, title }: { imageUrl: string | null; title: string }) => {
  const [failed, setFailed] = useState(false)

  if (!imageUrl || failed) {
    return <ServiceIcon preset="box" className="h-5 w-5 text-primary_red" />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={title}
      className="h-full w-full object-contain p-1"
      onError={() => setFailed(true)}
    />
  )
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
    <div className="w-full pb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-start focus:outline-none transition-all duration-300"
      >
        <span className="text-lg font-semibold text-white">{title}</span>
        <span className="ms-2 text-2xl font-bold text-white transition-transform duration-300">
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
                  <div className="flex items-center justify-between ms-4">
                    <Link
                      href={getServiceLink(page)}
                      className="text-white font-medium transition-colors duration-300 flex-1"
                      onClick={onLinkClick}
                    >
                      {page.title}
                    </Link>
                    {hasSubServices && (
                      <button
                        onClick={() => toggleService(page.id)}
                        className="ms-2 text-xl font-bold text-white transition-transform duration-300"
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
                      <ul className="ms-8 space-y-2">
                        {pageSubs
                          .filter((sub: NavigationPageData) => sub && sub.id && sub.slug)
                          .map((sub: NavigationPageData) => (
                            <li key={sub.id}>
                              <Link
                                href={getServiceLink(sub)}
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

  const highlightMatch = (text: string, query: string, light = false) => {
    if (!query.trim()) return text
    const i = text.toLowerCase().indexOf(query.toLowerCase())
    if (i === -1) return text
    return (
      <>
        {text.slice(0, i)}
        <mark className={light ? 'rounded bg-primary_red/15 text-primary_red' : 'rounded bg-white/25 text-white'}>
          {text.slice(i, i + query.length)}
        </mark>
        {text.slice(i + query.length)}
      </>
    )
  }

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
                <HeaderSearchBox className="mb-6 w-full" productBrands={productBrands} />
                <LocaleToggle className="mb-6" />

                {/* Dynamic Navigation Items for Mobile */}
                <div className="space-y-2">
                  {allNavItems.map((item: NavigationItem, index: number) =>
                    item.type === 'dropdown' ? (
                      <div key={index} className="pb-2">
                        <button
                          onClick={() =>
                            setOpenMobileDropdownIndex(openMobileDropdownIndex === index ? null : index)
                          }
                          className="flex items-center justify-between w-full text-start text-white text-lg font-semibold py-2"
                        >
                          {item.label}
                          <span className="ms-2 text-2xl font-bold">
                            {openMobileDropdownIndex === index ? '−' : '+'}
                          </span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            openMobileDropdownIndex === index ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <ul className="ms-4 space-y-3">
                            {(item.subItems || []).map((sub, i) => (
                              <li key={i}>
                                <Link
                                  href={sub.link}
                                  className="text-white/80 text-md block transition-colors duration-300"
                                  onClick={closeMobileMenu}
                                  {...(sub.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div key={index} className="pb-2">
                        <Link
                          href={item.link}
                          className="text-white text-lg font-semibold block transition-colors duration-300"
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </Link>
                      </div>
                    ),
                  )}
                </div>

                {/* Infra Services Section */}
                {infraPages.length > 0 && (
                  <MobileServiceSection
                    title="IT Infra Services"
                    pages={infraPages}
                    subServices={infraSubServices}
                    getSubServices={getSubServices}
                    onLinkClick={closeMobileMenu}
                    expandedServices={expandedServices}
                    setExpandedServices={setExpandedServices}
                  />
                )}

                {/* Products Section */}
                {productBrands.length > 0 && (
                  <div className="pb-2">
                    <p className="mb-2 text-white text-lg font-semibold">Products</p>
                    <div className="flex flex-col gap-2 pl-3">
                      {productBrands
                        .filter((b) => b.devices.length > 0)
                        .map((b) => (
                          <Link
                            key={b.brand}
                            href={`/service/${b.brand.toLowerCase()}-video-conferencing-devices-dubai-uae`}
                            className="text-white/80 text-base transition-colors duration-300 hover:text-white"
                            onClick={closeMobileMenu}
                          >
                            {b.brand}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}

                {/* Mobile Contact Button */}
                <div className="pt-4 mt-auto">
                  {links && links.length > 0 && (
                    <div className="flex flex-col gap-4 items-center">
                      {links.map(({ link }, i) => {
                        if (
                          calendlyUrl &&
                          link?.label?.trim().toLowerCase() === "let's keep in touch"
                        ) {
                          return (
                            <div key={i} onClick={closeMobileMenu} className="w-full">
                              <CalendlyButton
                                label={link.label}
                                url={calendlyUrl}
                                appearance={link.appearance || undefined}
                                className="w-full text-center"
                              />
                            </div>
                          )
                        }
                        return (
                          <div key={i} onClick={closeMobileMenu} className="w-full">
                            <CMSLink className="w-full text-center" {...link} />
                          </div>
                        )
                      })}
                      {cartItems.length > 0 && (
                        <button
                          onClick={() => {
                            openCart()
                            closeMobileMenu()
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Quote Cart ({cartItems.length})
                        </button>
                      )}
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
          onClick={() => setShowInfraMegaMenu(false)}
          className="fixed inset-0 top-[7.25rem] z-40 animate-in overflow-y-auto bg-black/40 fade-in p-4 backdrop-blur-sm duration-200 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-auto flex w-full max-w-5xl animate-in overflow-hidden rounded-2xl bg-white shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] slide-in-from-top-2 duration-300 md:max-h-[75vh]"
          >
            {(() => {
              const query = menuSearchQuery.trim().toLowerCase()
              const allEntries = infraPages
                .filter((page: NavigationPageData) => page && page.id && page.slug)
                .map((page: NavigationPageData) => ({
                  page,
                  subServices: getSubServices(page.id, infraSubServices).filter(
                    (sub: NavigationPageData) => sub && sub.id && sub.slug,
                  ),
                }))

              // Always filter to actual matches - a category name matching the
              // query shouldn't dump its whole unfiltered service list in too.
              const matched = query
                ? allEntries
                    .map(({ page, subServices }) => {
                      const parentMatches = page.title.toLowerCase().includes(query)
                      const matchingSubs = subServices.filter((sub: NavigationPageData) =>
                        sub.title.toLowerCase().includes(query),
                      )
                      if (!parentMatches && matchingSubs.length === 0) return null
                      return { page, subServices: matchingSubs }
                    })
                    .filter((e): e is { page: NavigationPageData; subServices: NavigationPageData[] } => e !== null)
                : null

              // Browse mode: a category rail on the left, that category's full
              // service list on the right - one category in focus at a time.
              const active = allEntries.find((e) => e.page.id === activeInfraCategory) || allEntries[0]

              // The sidebar (and its search input) stays mounted in the same place
              // regardless of search state - swapping it out for a different layout
              // on the first keystroke was unmounting the input and killing focus,
              // so only the right-hand results pane changes based on the query.
              return (
                <>
                  <div
                    className="flex w-72 flex-none flex-col p-4 md:p-5"
                    style={{ background: 'linear-gradient(160deg, #b3121f 0%, #d7213c 45%, #6e0d17 100%)' }}
                  >
                    <div className="mb-4 px-2">
                      <span className="mb-1.5 inline-block text-[11px] font-bold uppercase tracking-wider text-red-200">
                        IT Infra Services
                      </span>
                      <h2 className="text-base font-semibold leading-snug text-white">
                        Explore Our Infrastructure Services
                      </h2>
                    </div>
                    <div className="relative mb-4">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                      <input
                        type="text"
                        value={menuSearchQuery}
                        onChange={(e) => setMenuSearchQuery(e.target.value)}
                        placeholder="Search services..."
                        className="w-full rounded-lg border border-white/20 bg-white/10 py-2 pl-9 pr-3 text-sm text-white outline-none transition-colors placeholder:text-white/60 focus:border-white/50 focus:bg-white/15"
                      />
                    </div>
                    <nav className="flex-1 space-y-1 overflow-y-auto">
                      {(matched || allEntries).map(({ page }) => {
                        const isActive = !matched && active?.page.id === page.id
                        return (
                          <button
                            key={page.id}
                            type="button"
                            onClick={() => setActiveInfraCategory(page.id)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                              isActive ? 'font-semibold text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <ServiceIcon
                              preset={getIconForServiceTitle(page.title)}
                              className={`h-4 w-4 flex-none ${isActive ? 'text-white' : 'text-white/60'}`}
                            />
                            <span
                              className={`flex-1 leading-snug ${isActive ? 'underline decoration-2 underline-offset-4' : ''}`}
                            >
                              {page.title}
                            </span>
                            <ChevronRight
                              className={`h-3.5 w-3.5 flex-none text-white transition-opacity ${
                                isActive ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          </button>
                        )
                      })}
                      {matched && matched.length === 0 && (
                        <p className="px-3 py-2 text-sm text-white/70">No matches.</p>
                      )}
                    </nav>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 md:p-10">
                    {matched ? (
                      matched.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No services found for &ldquo;{menuSearchQuery}&rdquo;. Try a different term.
                        </p>
                      ) : (
                        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                          {matched.map(({ page, subServices }) => (
                            <div key={page.id}>
                              <Link
                                href={getServiceLink(page)}
                                className="group mb-3 flex items-center gap-2.5"
                                onClick={() => setShowInfraMegaMenu(false)}
                              >
                                <ServiceIcon
                                  preset={getIconForServiceTitle(page.title)}
                                  className="h-4 w-4 flex-none text-primary_red"
                                />
                                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground transition-colors group-hover:text-primary_red">
                                  {highlightMatch(page.title, menuSearchQuery, true)}
                                </h3>
                              </Link>
                              {subServices.length > 0 && (
                                <ul className="space-y-2">
                                  {subServices.map((sub: NavigationPageData) => (
                                    <li key={sub.id}>
                                      <Link
                                        href={getServiceLink(sub)}
                                        className="text-sm text-gray-600 transition-colors hover:text-primary_red"
                                        onClick={() => setShowInfraMegaMenu(false)}
                                      >
                                        {highlightMatch(sub.title, menuSearchQuery, true)}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      active && (
                        <>
                          <div className="mb-6 flex items-start justify-between gap-4">
                            <h3 className="text-lg font-semibold tracking-tight text-foreground">{active.page.title}</h3>
                            <Link
                              href={getServiceLink(active.page)}
                              onClick={() => setShowInfraMegaMenu(false)}
                              className="group/overview inline-flex flex-none items-center gap-1 text-sm font-semibold text-primary_red"
                            >
                              Overview
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/overview:translate-x-0.5" />
                            </Link>
                          </div>

                          {active.subServices.length > 0 ? (
                            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {active.subServices.map((sub: NavigationPageData) => (
                                <li key={sub.id}>
                                  <Link
                                    href={getServiceLink(sub)}
                                    onClick={() => setShowInfraMegaMenu(false)}
                                    className="group flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-3 text-sm text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary_red/30 hover:text-primary_red hover:shadow-md"
                                  >
                                    <ServiceIcon
                                      preset={getIconForServiceTitle(sub.title)}
                                      className="h-4 w-4 flex-none text-primary_red/70 transition-colors group-hover:text-primary_red"
                                    />
                                    <span className="flex-1 leading-snug">{sub.title}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">Explore this service in detail.</p>
                          )}
                        </>
                      )
                    )}
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Products Mega Menu */}
      {showProductsMegaMenu && (
        <div
          onClick={() => setShowProductsMegaMenu(false)}
          className="fixed inset-0 top-[5rem] z-40 h-[calc(100vh-5rem)] animate-in overflow-auto p-16 fade-in text-white duration-200 scrollbar-hide"
          style={{ background: 'linear-gradient(-135deg, #8b0f1f 0%, #d7213c 20%, #2d0e0e 100%)' }}
        >
          {/* Ambient glow accents */}
          <div
            aria-hidden
            className="pointer-events-none fixed left-0 top-[5rem] h-80 w-80 rounded-full bg-white/[0.06] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none fixed bottom-0 right-0 h-96 w-96 rounded-full bg-black/20 blur-3xl"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto flex h-full max-w-7xl animate-in justify-between gap-[6rem] slide-in-from-top-3 duration-300"
          >
            {/* Logo and Header */}
            <div className="mb-12 flex flex-none flex-col">
              <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/80">
                Products
              </span>
              <p className="mb-6 max-w-[16rem] text-lg font-semibold leading-snug text-white/90">
                Video Conferencing
                <br />
                &amp; Meeting Room Devices
                <br />
                From Leading Brands
              </p>
              <div className="h-1 w-14 rounded-full bg-white/40" />
              <h1 className="mt-6 text-7xl font-bold tracking-wide" style={{ fontFamily: 'monospace' }}>
                CODE3
              </h1>
            </div>

            {/* Brands Grid */}
            <div className="flex h-full w-full max-w-4xl flex-1 flex-col overflow-auto scrollbar-hide">
              <div className="relative mb-5 flex-none">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  placeholder="Search products... (e.g. Yealink, camera, touch panel)"
                  className="w-full rounded-full border border-white/15 bg-white/[0.07] py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/40 focus:bg-white/10"
                />
              </div>

              {(() => {
                const query = menuSearchQuery.trim().toLowerCase()
                const brandsWithProducts = productBrands.filter((b) => b && b.brand && b.devices.length > 0)

                // Default browsing state: brand tabs + one brand's full grid at a time,
                // instead of every brand's products all visible together.
                if (!query) {
                  const active =
                    brandsWithProducts.find((b) => b.brand === activeProductBrand) || brandsWithProducts[0]
                  if (!active) return null
                  const brandSlug = `${active.brand.toLowerCase()}-video-conferencing-devices-dubai-uae`
                  // Always exactly 2 rows (8 items) regardless of which brand is active,
                  // so switching tabs doesn't reflow/jump the panel to a different height.
                  const shownDevices = active.devices.slice(0, 8)

                  return (
                    <>
                      <div className="mb-5 flex flex-none flex-wrap gap-2">
                        {brandsWithProducts.map((b) => (
                          <button
                            key={b.brand}
                            onClick={() => setActiveProductBrand(b.brand)}
                            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                              b.brand === active.brand
                                ? 'border-white bg-white text-primary_red'
                                : 'border-white/20 bg-white/[0.04] text-white/75 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {b.brand}
                            <span className="ml-1.5 opacity-60">{b.devices.length}</span>
                          </button>
                        ))}
                      </div>

                      <div className="grid min-h-[13.5rem] grid-cols-4 gap-4 content-start">
                        {shownDevices.map((device) => (
                          <Link
                            key={device.id}
                            href={`/service/device/${device.slug}`}
                            onClick={() => setShowProductsMegaMenu(false)}
                            className="group/device flex flex-col items-center gap-2 rounded-xl p-2 text-center transition-colors hover:bg-white/10"
                          >
                            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/[0.03] transition-transform duration-200 group-hover/device:scale-105 group-hover/device:shadow-md">
                              <ProductThumbnail imageUrl={device.imageUrl} title={device.title} />
                            </span>
                            <span className="line-clamp-2 h-8 text-xs leading-tight text-white/75 transition-colors group-hover/device:text-white">
                              {device.title}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {active.devices.length > shownDevices.length && (
                        <div className="mt-20 flex justify-center">
                          <Link
                            href={`/service/${brandSlug}`}
                            onClick={() => setShowProductsMegaMenu(false)}
                            className="group/viewall inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                          >
                            View all {active.devices.length} {active.brand} products
                            <ArrowRight className="h-3 w-3 transition-transform group-hover/viewall:translate-x-0.5" />
                          </Link>
                        </div>
                      )}
                    </>
                  )
                }

                const entries = brandsWithProducts
                  .map((b) => {
                    const brandMatches = b.brand.toLowerCase().includes(query)
                    const matchingDevices = brandMatches
                      ? b.devices
                      : b.devices.filter((d) => d.title.toLowerCase().includes(query))

                    if (matchingDevices.length === 0) return null
                    return { ...b, devices: matchingDevices.slice(0, 6) }
                  })
                  .filter((entry): entry is ProductBrandData => entry !== null)

                if (entries.length === 0) {
                  return (
                    <p className="text-sm text-white/60">
                      No products found for &ldquo;{menuSearchQuery}&rdquo;. Try a different term.
                    </p>
                  )
                }

                return (
                  <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                    {entries.map((brandEntry) => {
                      const brandSlug = `${brandEntry.brand.toLowerCase()}-video-conferencing-devices-dubai-uae`
                      const totalCount =
                        productBrands.find((b) => b.brand === brandEntry.brand)?.devices.length || 0
                      return (
                        <div
                          key={brandEntry.brand}
                          className="group/card rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                        >
                          <Link
                            href={`/service/${brandSlug}`}
                            className="group mb-4 flex items-center gap-2.5 border-b border-white/15 pb-4"
                            onClick={() => setShowProductsMegaMenu(false)}
                          >
                            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white group-hover:text-primary_red">
                              <ServiceIcon preset="tv" className="h-4 w-4 text-white transition-colors group-hover:text-primary_red" />
                            </span>
                            <h2 className="flex-1 text-base font-bold uppercase tracking-wide transition-colors group-hover:text-white/80">
                              {highlightMatch(brandEntry.brand, menuSearchQuery)}
                            </h2>
                            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/60">
                              {totalCount}
                            </span>
                          </Link>

                          <div className="grid grid-cols-3 gap-2.5">
                            {brandEntry.devices.map((device) => (
                              <Link
                                key={device.id}
                                href={`/service/device/${device.slug}`}
                                onClick={() => setShowProductsMegaMenu(false)}
                                className="group/device flex flex-col items-center gap-1.5 rounded-xl p-1.5 text-center transition-colors hover:bg-white/10"
                              >
                                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/[0.03] transition-transform duration-200 group-hover/device:scale-105 group-hover/device:shadow-md">
                                  <ProductThumbnail imageUrl={device.imageUrl} title={device.title} />
                                </span>
                                <span className="line-clamp-2 text-[11px] leading-tight text-white/75 transition-colors group-hover/device:text-white">
                                  {highlightMatch(device.title, menuSearchQuery)}
                                </span>
                              </Link>
                            ))}
                          </div>

                          {totalCount > brandEntry.devices.length && (
                            <Link
                              href={`/service/${brandSlug}`}
                              onClick={() => setShowProductsMegaMenu(false)}
                              className="group/viewall mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                            >
                              View all {brandEntry.brand} products
                              <ArrowRight className="h-3 w-3 transition-transform group-hover/viewall:translate-x-0.5" />
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

    </>
  )
}
