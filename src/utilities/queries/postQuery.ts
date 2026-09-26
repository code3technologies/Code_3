import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Post } from '@/payload-types'

export const fetchPostBySlug = async ({
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
    collection: 'posts',
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}

// Shown under a post whenever it has no manually curated relatedPosts, so
// every post ends with a "keep reading" section instead of a dead end.
export const fetchFallbackRecentPosts = async ({
  excludeId,
  locale,
}: {
  excludeId: string
  locale: 'en' | 'ar'
}): Promise<Post[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit: 3,
    locale,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: {
      id: {
        not_equals: excludeId,
      },
    },
  })

  return result.docs || []
}

// Draft/preview requests always read fresh so editors see live content;
// published requests go through a cross-request cache keyed by slug+locale
// and invalidated by revalidatePost's `post_${slug}` tag.
export const queryPostBySlug = async (args: { slug: string; locale: 'en' | 'ar'; draft: boolean }) => {
  if (args.draft) return fetchPostBySlug(args)

  return unstable_cache(() => fetchPostBySlug(args), ['post', args.slug, args.locale], {
    tags: [`post_${args.slug}`],
  })()
}
