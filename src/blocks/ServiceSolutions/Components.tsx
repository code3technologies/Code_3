// Component.tsx (Server Component)
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

interface ServiceSolutionsBlockExtendedProps
  extends Omit<ServiceSolutionsBlockProps, 'serviceType'> {
  id?: string
  currentPage?: Page | null
  disableInnerContainer?: boolean
  serviceType?: 'infrastructure' | 'digital'
}

function mapPageToServiceCard(page: Page): ServiceCard {
  let slug = '#'
  if (page.slug) {
    if (page.serviceCategory && page.serviceCategory !== 'none') {
      slug = `/service/${page.slug}`
    } else {
      slug = `/${page.slug}`
    }
  }

  const heroTitle = page?.hero?.HeroText
  const heroSub = page?.hero?.subText || ''

  return {
    title: page.title || 'Service',
    description: heroTitle || heroSub || 'Professional service tailored to your business needs.',
    showButton: false,
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
  }

  const filteredPages = pages.filter((p) => p.id !== currentPage?.id)
  //const services = filteredPages.map(mapPageToServiceCard)
  let services: ServiceCard[] = []

if (currentPage?.slug === 'it-amc') {
  services = [
    {
      title: 'IT Consulting',
      description:
        'Align technology strategies with business objectives through expert guidance and strategic planning.',
      showButton: false,
      buttonText: '',
      buttonLink: '',
      gridSpan: '2',
      category: 'infrastructure',
    },
    {
      title: 'Cloud Migration Services',
      description:
        'Seamlessly migrate applications, workloads, and data to the cloud with minimal disruption.',
      showButton: false,
      buttonText: '',
      buttonLink: '',
      gridSpan: '2',
      category: 'infrastructure',
    },
    {
      title: 'IT Outsourcing',
      description:
        'Extend your IT capabilities with dedicated professionals who provide proactive support and management.',
      showButton: false,
      buttonText: '',
      buttonLink: '',
      gridSpan: '2',
      category: 'infrastructure',
    },
    {
      title: 'New Office IT Setup',
      description:
        'Design and deploy complete IT infrastructure solutions for new office environments.',
      showButton: false,
      buttonText: '',
      buttonLink: '',
      gridSpan: '2',
      category: 'infrastructure',
    },
  ]
} else {
  services = filteredPages.map(mapPageToServiceCard)
}

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
