import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Footer, Header, Page } from '@/payload-types'

// Define the simplified data structure for navigation pages
interface NavigationPageData {
  id: string
  slug: string | null | undefined
  title: string
  serviceCategory: 'none' | 'infrastructure' | 'digital' | null | undefined
  parentService: string | null
  isSubService: boolean
}

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()
  const footerData = (await getCachedGlobal('footer', 1)()) as Footer

  // Fetch service pages for header menus (infra & digital)
  const payload = await getPayload({ config: configPromise })
  const pagesRes = await payload.find({
    collection: 'pages',
    depth: 2,
    limit: 200,
    where: {
      serviceCategory: {
        in: ['infrastructure', 'digital'],
      },
    },
  })

  // Map navigation pages with sub-service information
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

  return (
    <HeaderClient
      data={(headerData as Header) || null}
      navigationPages={navigationPages}
      contactInfo={footerData?.contactInfo || null}
    />
  )
}
