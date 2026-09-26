import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { IconPreset } from '@/components/site/icons'

export type HomeServiceCard = {
  id: string
  slug: string
  title: string
  category: 'infrastructure' | 'digital'
  icon: IconPreset
}

// One icon per top-level service, picked by hand - there's no dedicated
// icon field on service pages (unlike the Stats block, which has one), and
// guessing an icon from arbitrary page content isn't reliable enough for a
// homepage-hero visual. Falls back to 'box' for any future parent service
// slug added here without a matching entry.
const ICON_BY_SLUG: Record<string, IconPreset> = {
  'cyber-security-dubai-uae': 'shield',
  'seo-dubai-uae': 'search',
  'hardware-and-software-services-dubai-uae': 'box',
  'professional-services-dubai-uae': 'lightbulb',
  'cloud-and-microsoft-solutions-dubai-uae': 'cloud',
  'unified-communication-dubai-uae': 'phone',
  'network-infrastructure-dubai-uae': 'network',
  'brand-identity-and-design-dubai-uae': 'palette',
  'ui-ux-design-dubai-uae': 'layout',
  'mobile-app-development-dubai-uae': 'smartphone',
  'web-development-dubai-uae': 'code',
  'managed-it-service-dubai-uae': 'wrench',
  'it-infrastructure-service-dubai-uae': 'server',
  'backup-and-business-continuity-dubai-uae': 'refresh',
  'security--surveillance-solutions-dubai-uae': 'camera',
  'audio-visual-av-solutions-dubai-uae': 'monitor',
}

const fetchHomeServices = async (): Promise<HomeServiceCard[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 100,
    pagination: false,
    select: {
      slug: true,
      title: true,
      serviceCategory: true,
      parentService: true,
    },
    where: {
      serviceCategory: {
        in: ['infrastructure', 'digital'],
      },
    },
  })

  return result.docs
    .filter((doc) => !doc.parentService && doc.slug)
    .map((doc) => ({
      id: doc.id,
      slug: doc.slug as string,
      title: doc.title,
      category: doc.serviceCategory as 'infrastructure' | 'digital',
      icon: ICON_BY_SLUG[doc.slug as string] || 'box',
    }))
}

// Same cache tag the header nav uses for its own service-list query - both
// invalidate together whenever a service page is published/unpublished.
export const getCachedHomeServices = () =>
  unstable_cache(fetchHomeServices, ['home-services-grid'], { tags: ['pages-sitemap'] })
