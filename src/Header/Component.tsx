import { HeaderClient } from './Component.client'
import { TopBar } from './TopBar'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getLocale, type Locale } from '@/utilities/getLocale'
import { getCachedBrandDevices } from '@/components/DeviceCatalog/getBrandDevices'
import { hasPublishedCaseStudies } from '@/utilities/getCaseStudies'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import React from 'react'

import type { Header, Media, Page } from '@/payload-types'

export interface ProductDeviceData {
  id: string
  title: string
  slug: string
  imageUrl: string | null
  category?: string | null
}

export interface ProductBrandData {
  brand: string
  devices: ProductDeviceData[]
}

const PRODUCT_BRANDS = ['Yealink', 'Logitech', 'Jabra', 'Cisco', 'Poly'] as const

const getDeviceImageUrl = (device: { image?: unknown }): string | null => {
  const image = device.image
  if (!image || typeof image !== 'object') return null
  const media = image as Media
  if (typeof media.externalUrl === 'string' && media.externalUrl.trim()) return media.externalUrl.trim()
  if (media.url) return getMediaUrl(media.url, media.updatedAt)
  return null
}

const getProductBrandsData = () =>
  unstable_cache(
    async () => {
      const results = await Promise.all(
        PRODUCT_BRANDS.map((brand) => getCachedBrandDevices(brand)),
      )
      return PRODUCT_BRANDS.map((brand, i) => ({
        brand,
        devices: (results[i] || [])
          .filter((d) => d && d.id && d.slug)
          .map((d) => ({
            id: d.id,
            title: d.title,
            slug: d.slug as string,
            imageUrl: getDeviceImageUrl(d),
            category: d.category,
          })),
      })) satisfies ProductBrandData[]
    },
    ['header-product-brands'],
    { tags: ['devices-catalog'] },
  )

interface TechPartnerData {
  name: string
  logoUrl?: string | null
}

// Define the simplified data structure for navigation pages
interface NavigationPageData {
  id: string
  slug: string | null | undefined
  title: string
  serviceCategory: 'none' | 'infrastructure' | 'digital' | null | undefined
  parentService: string | null
  isSubService: boolean
}

// Both queries only need to refetch when a page's slug/category/parentService/status
// changes - piggyback on the 'pages-sitemap' tag the pages collection already
// revalidates on every publish/unpublish, instead of refetching on every request.
// Locale is part of the cache key so English and Arabic requests don't collide.
const getNavData = (locale: Locale) =>
  unstable_cache(
    async () => {
    const payload = await getPayload({ config: configPromise })

    const pagesRes = await payload.find({
      collection: 'pages',
      depth: 2,
      limit: 200,
      locale,
      sort: ['navOrder', 'title'],
      where: {
        serviceCategory: {
          in: ['infrastructure', 'digital'],
        },
      },
    })

    const allPages = pagesRes.docs || []
    const navigationPages: NavigationPageData[] = allPages
      .filter((p) => p && p.id && p.slug) // Filter out any undefined/null pages or pages without slug
      .map((p) => {
        const pageWithParent = p as Page & {
          parentService?: string | { id: string } | null
        }
        let parentServiceId: string | null = null
        if (pageWithParent.parentService) {
          if (typeof pageWithParent.parentService === 'object' && pageWithParent.parentService.id) {
            parentServiceId = pageWithParent.parentService.id
          } else if (typeof pageWithParent.parentService === 'string') {
            parentServiceId = pageWithParent.parentService
          }
        }

        return {
          id: p.id,
          slug: p.slug || null,
          title: p.title || '',
          serviceCategory: p.serviceCategory,
          parentService: parentServiceId,
          isSubService: !!parentServiceId,
        }
      })

    // Fetch technology partners for the Company dropdown mega-menu
    let techPartners: TechPartnerData[] = []
    const techPartnersPageRes = await payload.find({
      collection: 'pages',
      depth: 1,
      limit: 1,
      where: { slug: { equals: 'technology-partners' } },
    })
    const techPartnersPage = techPartnersPageRes.docs?.[0] as Page | undefined
    const partnersBlock = (techPartnersPage?.layout || []).find(
      (block) => block.blockType === 'partnersDirectory',
    ) as { partners?: { name: string; logo?: string | Media | null }[] } | undefined
    if (partnersBlock?.partners) {
      techPartners = partnersBlock.partners.map((p) => ({
        name: p.name,
        logoUrl:
          p.logo && typeof p.logo === 'object' && p.logo.url ? getMediaUrl(p.logo.url, p.logo.updatedAt) : null,
      }))
    }

    return { navigationPages, techPartners }
    },
    ['header-nav-data', locale],
    { tags: ['pages-sitemap'] },
  )

export async function Header() {
  const locale = await getLocale()
  const [headerData, { navigationPages, techPartners }, productBrands, showCaseStudies] = await Promise.all([
    getCachedGlobal('header', 1, locale)(),
    getNavData(locale)(),
    getProductBrandsData()(),
    hasPublishedCaseStudies(),
  ])

  // Add "Case Studies" to the Company dropdown only once one is published, so
  // the menu never links to a 404. The Company group is the one containing
  // "Technology Partners".
  let data = (headerData as Header) || null
  if (showCaseStudies && data?.navItems) {
    data = {
      ...data,
      navItems: data.navItems.map((item) => {
        const subs = item.subItems || []
        const isCompany = subs.some((sub) => sub.label.trim().toLowerCase() === 'technology partners')
        if (!isCompany || subs.some((sub) => sub.link === '/case-studies')) return item
        const caseStudiesItem = {
          label: locale === 'ar' ? 'دراسات الحالة' : 'Case Studies',
          link: '/case-studies',
          openInNewTab: false,
        }
        // Sit right after "Blogs"; fall back to the end if there's no blog link.
        const blogIndex = subs.findIndex((sub) => /^(blogs?|المدونة)$/i.test(sub.label.trim()))
        const insertAt = blogIndex >= 0 ? blogIndex + 1 : subs.length
        return {
          ...item,
          subItems: [...subs.slice(0, insertAt), caseStudiesItem, ...subs.slice(insertAt)],
        }
      }),
    }
  }

  return (
    <>
      <TopBar locale={locale} />
      <HeaderClient
        data={data}
        navigationPages={navigationPages}
        techPartners={techPartners}
        productBrands={productBrands}
      />
    </>
  )
}
