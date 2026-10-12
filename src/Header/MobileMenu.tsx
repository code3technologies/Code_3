'use client'
import React from 'react'
import Link from 'next/link'
import { ShoppingCart, X } from 'lucide-react'

import type { Header } from '@/payload-types'
import type { CartDevice } from '@/providers/DeviceCart'
import { Logo } from '@/components/Logo/Logo'
import { CMSLink } from '@/components/Link'
import { CalendlyButton } from './CalendlyButton'
import { LocaleToggle } from './LocaleToggle'
import { HeaderSearchBox } from './HeaderSearchBox'
import { getServiceLink } from './headerMenuUtils'
import type { NavigationItem, NavigationPageData, ProductBrandData } from './types'

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
  const [isOpen, setIsOpen] = React.useState(false)

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

export interface MobileMenuProps {
  logo: Header['logo']
  allNavItems: NavigationItem[]
  openMobileDropdownIndex: number | null
  setOpenMobileDropdownIndex: React.Dispatch<React.SetStateAction<number | null>>
  closeMobileMenu: () => void
  productBrands: ProductBrandData[]
  infraPages: NavigationPageData[]
  infraSubServices: NavigationPageData[]
  getSubServices: (parentId: string, subServices: NavigationPageData[]) => NavigationPageData[]
  expandedServices: Map<string, Set<string>>
  setExpandedServices: React.Dispatch<React.SetStateAction<Map<string, Set<string>>>>
  links: Header['links']
  calendlyUrl: string | null | undefined
  cartItems: CartDevice[]
  openCart: () => void
}

export default function MobileMenu({
  logo,
  allNavItems,
  openMobileDropdownIndex,
  setOpenMobileDropdownIndex,
  closeMobileMenu,
  productBrands,
  infraPages,
  infraSubServices,
  getSubServices,
  expandedServices,
  setExpandedServices,
  links,
  calendlyUrl,
  cartItems,
  openCart,
}: MobileMenuProps) {
  return (
    <div className="lg:hidden fixed inset-0 h-screen z-40">
      <div
        className="space-y-3 flex flex-col h-full"
        style={{
          background: 'linear-gradient(-135deg, #8b0f1f 0%, #d7213c 20%, #2d0e0e 100%)',
        }}
      >
        {/* Mobile Logo and Close Button */}
        <div className="px-6 py-3 flex items-center justify-between bg-white">
          <Logo logo={logo} href="/" width={70} height={45} loading="eager" priority="high" alt="Company Logo" />
          <button
            onClick={closeMobileMenu}
            className="text-black transition-transform duration-300 hover:scale-110"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col scrollbar-hide overflow-y-auto">
          <HeaderSearchBox className="mb-6 w-full" productBrands={productBrands} />
          <LocaleToggle className="mb-6" />

          {/* Dynamic Navigation Items for Mobile */}
          <div className="space-y-2">
            {allNavItems.map((item: NavigationItem, index: number) =>
              item.type === 'dropdown' ? (
                <div key={index} className="pb-2">
                  <button
                    onClick={() => setOpenMobileDropdownIndex(openMobileDropdownIndex === index ? null : index)}
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
                  if (calendlyUrl && link?.label?.trim().toLowerCase() === "let's keep in touch") {
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
  )
}
