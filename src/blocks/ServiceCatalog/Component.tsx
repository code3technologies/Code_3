import type { ServiceCatalogBlock as ServiceCatalogBlockProps, Page } from 'src/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { ServiceCatalogClient, type ServiceCategoryData } from './ServiceCatalogClient'
import { getIconForServiceTitle } from '@/components/site/serviceIconMap'

export const ServiceCatalogBlock: React.FC<ServiceCatalogBlockProps & { id?: string }> = async (props) => {
  const { id, serviceType = 'infrastructure' } = props
  const payload = await getPayload({ config: configPromise })

  const [topLevelResult, subServiceResult] = await Promise.all([
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 50,
      where: {
        and: [
          { serviceCategory: { equals: serviceType } },
          { or: [{ parentService: { equals: null } }, { parentService: { exists: false } }] },
          { _status: { equals: 'published' } },
        ],
      },
      sort: 'title',
    }),
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 300,
      where: {
        and: [
          { serviceCategory: { equals: serviceType } },
          { parentService: { exists: true } },
          { _status: { equals: 'published' } },
        ],
      },
      sort: 'title',
    }),
  ])

  const childrenByParent = new Map<string, Page[]>()
  for (const child of subServiceResult.docs as Page[]) {
    const parentId =
      typeof child.parentService === 'object' && child.parentService
        ? child.parentService.id
        : (child.parentService as unknown as string)
    if (!parentId) continue
    if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, [])
    childrenByParent.get(parentId)!.push(child)
  }

  const categories: ServiceCategoryData[] = (topLevelResult.docs as Page[]).map((parent) => {
    const children = childrenByParent.get(parent.id) || []
    return {
      label: parent.title,
      items: children.map((child) => ({
        icon: child.icon || getIconForServiceTitle(child.title),
        title: child.title,
        description: child.meta?.description || undefined,
        href: `/service/${child.slug}`,
      })),
    }
  })

  return (
    <div id={`block-${id}`}>
      <ServiceCatalogClient
        titleHighlight={props.titleHighlight}
        title={props.title}
        categories={categories}
      />
    </div>
  )
}
