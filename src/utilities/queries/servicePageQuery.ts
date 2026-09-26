import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Page } from '@/payload-types'

export const fetchServicePageBySlug = async ({
  slug,
  locale,
  draft,
}: {
  slug: string
  locale: 'en' | 'ar'
  draft: boolean
}): Promise<Page | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    depth: 2,
    draft,
    limit: 1,
    locale,
    pagination: false,
    overrideAccess: draft,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          serviceCategory: {
            not_equals: 'none',
          },
        },
      ],
    },
  })

  return (result.docs?.[0] as Page) || null
}

// Draft/preview requests always read fresh so editors see live content;
// published requests go through a cross-request cache keyed by slug+locale
// and invalidated by revalidatePage's `page_${slug}` tag.
export const queryServicePageBySlug = async (args: {
  slug: string
  locale: 'en' | 'ar'
  draft: boolean
}): Promise<Page | null> => {
  if (args.draft) return fetchServicePageBySlug(args)

  return unstable_cache(() => fetchServicePageBySlug(args), ['service-page', args.slug, args.locale], {
    tags: [`page_${args.slug}`],
  })()
}
