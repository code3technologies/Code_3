import type { ServiceSolutionsBlock as ServiceSolutionsBlockProps, Page } from 'src/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { ServiceSolutionsBlock as ServiceSolutionsClient } from './Client'

function mapPageToServiceCard(page: Page) {
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

export const ServiceSolutionsBlock: React.FC<ServiceSolutionsBlockProps & { id?: string }> = async (
  props,
) => {
  const { id, services = [], serviceType = 'infrastructure', ...rest } = props as any

  const payload = await getPayload({ config: configPromise })

  // Only fetch pages matching the selected service type
  const result = await payload.find({
    collection: 'pages',
    depth: 1,
    limit: 50,
    where: {
      serviceCategory: {
        equals: serviceType,
      },
    },
  })

  const pages = result.docs || []
  const autoCards = pages.map(mapPageToServiceCard)

  // Filter out auto-generated cards that match manual service links
  const manualLinks = new Set(
    services
      .filter((s: any) => typeof s?.buttonLink === 'string')
      .map((s: any) => s.buttonLink as string),
  )
  const autoNoDupes = autoCards.filter((card) => !manualLinks.has(card.buttonLink || '#'))

  const mergedServices = [...services, ...autoNoDupes]

  return (
    <div className="" id={`block-${id}`}>
      <ServiceSolutionsClient 
        {...(rest as any)} 
        services={mergedServices} 
        serviceType={serviceType}
      />
    </div>
  )
}
