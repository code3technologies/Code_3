import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { CaseStudy } from '@/payload-types'

type Locale = 'en' | 'ar'

// Every case-study surface (listing, homepage strip, service-page card,
// header/footer link) reads through here so they all show or hide together:
// nothing renders until at least one case study is published. Cached under
// 'case-studies-list' (+ 'pages-sitemap', which revalidateCaseStudy already
// busts) and invalidated on publish/unpublish.
const TAGS = ['case-studies-list', 'pages-sitemap']

const fetchPublished = async (locale: Locale, serviceId?: string): Promise<CaseStudy[]> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft: false,
    limit: 100,
    locale,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    ...(serviceId ? { where: { services: { contains: serviceId } } } : {}),
  })
  return result.docs
}

export const getPublishedCaseStudies = (locale: Locale) =>
  unstable_cache(() => fetchPublished(locale), ['case-studies-all', locale], { tags: TAGS })()

export const getCaseStudiesForService = (serviceId: string, locale: Locale) =>
  unstable_cache(() => fetchPublished(locale, serviceId), ['case-studies-service', serviceId, locale], {
    tags: TAGS,
  })()

export const hasPublishedCaseStudies = async (): Promise<boolean> => {
  const studies = await getPublishedCaseStudies('en')
  return studies.length > 0
}

export const firstNumericResult = (study: CaseStudy) =>
  (study.results || []).find((r) => /^\d/.test(r.value.trim()))
