import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export const fetchCaseStudy = async ({
  slug,
  locale,
  draft,
}: {
  slug: string
  locale: 'en' | 'ar'
  draft: boolean
}) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
}

// Draft/preview reads fresh; published reads are cached and invalidated by
// the case_study_<slug> tag from revalidateCaseStudy.
export const queryCaseStudy = (args: { slug: string; locale: 'en' | 'ar'; draft: boolean }) => {
  if (args.draft) return fetchCaseStudy(args)
  return unstable_cache(() => fetchCaseStudy(args), ['case-study', args.slug, args.locale], {
    tags: [`case_study_${args.slug}`],
  })()
}
