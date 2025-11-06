import type { ServiceSolutionsBlock as ServiceSolutionsBlockProps, Page } from 'src/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { ServiceSolutionsBlock as ServiceSolutionsClient } from './Client'

interface ServiceCard {
  title: string
  description: string
  showButton: boolean
  buttonText: string
  buttonLink: string
  gridSpan: string
  category: 'infrastructure' | 'digital'
}

interface ServiceSolutionsBlockExtendedProps extends Omit<ServiceSolutionsBlockProps, 'serviceType'> {
  id?: string
  currentPage?: Page | null
  disableInnerContainer?: boolean
  serviceType?: 'infrastructure' | 'digital'
}

function mapPageToServiceCard(page: Page): ServiceCard {
  const slug = page.slug ? `/${page.slug}` : '#'
  const heroTitle = page?.hero?.HeroText
  const heroSub = page?.hero?.subText || ''
  return {
    title: page.title || 'Service',
    description: heroTitle || heroSub || 'Professional service tailored to your business needs.',
    showButton: true,
    buttonText: 'Explore Service',
    buttonLink: slug,
    gridSpan: '2',
    category: page.serviceCategory === 'infrastructure' ? 'infrastructure' : 'digital',
  }
}

export const ServiceSolutionsBlock: React.FC<ServiceSolutionsBlockExtendedProps> = async (
  props,
) => {
  const { id, serviceType = 'infrastructure', currentPage, ...rest } = props

  const payload = await getPayload({ config: configPromise })

  // Extract parentService information if it exists
  const currentPageWithParent = currentPage as Page & {
    parentService?: string | { id: string } | null
  }

  let currentPageParentServiceId: string | null = null
  if (currentPageWithParent?.parentService) {
    if (
      typeof currentPageWithParent.parentService === 'object' &&
      currentPageWithParent.parentService.id
    ) {
      currentPageParentServiceId = currentPageWithParent.parentService.id
    } else if (typeof currentPageWithParent.parentService === 'string') {
      currentPageParentServiceId = currentPageWithParent.parentService
    }
  }

  const isServiceDetailPage =
    (currentPage?.serviceCategory === 'infrastructure' ||
      currentPage?.serviceCategory === 'digital') &&
    !currentPageParentServiceId

  let pages: Page[] = []

  if (isServiceDetailPage && currentPage?.id) {
    const result = await payload.find({
      collection: 'pages',
      depth: 1,
      limit: 50,
      where: {
        and: [
          {
            parentService: {
              equals: currentPage.id,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
    })
    pages = result.docs || []
    console.log(`Found ${pages.length} sub-services`)
  } else {
    const result = await payload.find({
      collection: 'pages',
      depth: 1,
      limit: 50,
      where: {
        and: [
          {
            serviceCategory: {
              equals: serviceType,
            },
          },
          {
            or: [
              {
                parentService: {
                  equals: null,
                },
              },
              {
                parentService: {
                  exists: false,
                },
              },
            ],
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
    })
    pages = result.docs || []
    console.log(`Found ${pages.length} top-level services`)
  }

  // Ensure we never include the current page itself
  const filteredPages = pages.filter((p) => p.id !== currentPage?.id)
  const services = filteredPages.map(mapPageToServiceCard)

  console.log(`Final services count: ${services.length}`)

  return (
    <div className="" id={`block-${id}`}>
      <ServiceSolutionsClient
        {...rest}
        services={services}
        serviceType={serviceType as 'infrastructure' | 'digital'}
      />
    </div>
  )
}
