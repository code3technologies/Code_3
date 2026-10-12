'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import type { ProductBrandData } from './types'

export const HeaderSearchBox = ({
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
