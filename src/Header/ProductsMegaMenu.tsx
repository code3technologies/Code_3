'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'

import { ServiceIcon } from '@/components/site/icons'
import { highlightMatch } from './headerMenuUtils'
import type { ProductBrandData } from './types'

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
    <img src={imageUrl} alt={title} className="h-full w-full object-contain p-1" onError={() => setFailed(true)} />
  )
}

export interface ProductsMegaMenuProps {
  productBrands: ProductBrandData[]
  setShowProductsMegaMenu: React.Dispatch<React.SetStateAction<boolean>>
  activeProductBrand: string | null
  setActiveProductBrand: React.Dispatch<React.SetStateAction<string | null>>
  menuSearchQuery: string
  setMenuSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export default function ProductsMegaMenu({
  productBrands,
  setShowProductsMegaMenu,
  activeProductBrand,
  setActiveProductBrand,
  menuSearchQuery,
  setMenuSearchQuery,
}: ProductsMegaMenuProps) {
  return (
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
              const active = brandsWithProducts.find((b) => b.brand === activeProductBrand) || brandsWithProducts[0]
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
                  const totalCount = productBrands.find((b) => b.brand === brandEntry.brand)?.devices.length || 0
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
  )
}
