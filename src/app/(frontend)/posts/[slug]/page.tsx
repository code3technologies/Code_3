import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import React from 'react'
import Link from 'next/link'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getLocale } from '@/utilities/getLocale'
import { extractHeadings } from '@/utilities/extractHeadings'
import { PostTableOfContents } from '@/components/PostTableOfContents'

// Intentionally no generateStaticParams here: this route used to prerender
// every post at build time, and each post now also runs an extra DB query
// for its fallback "related posts" when none are curated. Under a slow build
// connection that's enough per-page work to hit the same 60s static-generation
// timeout that once failed the whole production build for /posts/page/[pageNumber]
// (see that route's comment). Posts are cached via unstable_cache + revalidatePost's
// `post_${slug}` tag regardless, so removing this only changes *when* the first
// render happens (on first visit instead of at build time), not the caching behavior.

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const locale = await getLocale()
  const url = (locale === 'ar' ? '/ar' : '') + '/posts/' + slug
  const post = await queryPostBySlug({ slug, locale, draft })

  if (!post) return <PayloadRedirects url={url} />

  const headings = extractHeadings(post.content)

  const curatedRelated = (post.relatedPosts || []).filter(
    (related): related is Post => typeof related === 'object' && related !== null,
  )
  const relatedDocs =
    curatedRelated.length > 0 ? curatedRelated : await fetchFallbackRecentPosts({ excludeId: post.id, locale })

  return (
    <article className="">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <div className="mx-auto max-w-[48rem]">
            <PostTableOfContents headings={headings} />
          </div>

          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />

          <p className="mx-auto mt-4 max-w-[48rem] border-t border-border pt-6 text-base leading-relaxed text-gray-700">
            <Link href="/contact" className="font-semibold text-primary_red hover:underline">
              Talk to CODE3 today
            </Link>{' '}
            and get expert guidance on the right solution for your business.
          </p>

          {relatedDocs.length > 0 && (
            <RelatedPosts
              title={
                <>
                  <span className="text-primary_red">Recent</span> Blogs
                </>
              }
              className="mt-12 max-w-5xl mx-auto"
              docs={relatedDocs}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const locale = await getLocale()
  const post = await queryPostBySlug({ slug, locale, draft })

  return generateMeta({ doc: post })
}

const fetchPostBySlug = async ({
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
const fetchFallbackRecentPosts = async ({
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
const queryPostBySlug = async (args: { slug: string; locale: 'en' | 'ar'; draft: boolean }) => {
  if (args.draft) return fetchPostBySlug(args)

  return unstable_cache(() => fetchPostBySlug(args), ['post', args.slug, args.locale], {
    tags: [`post_${args.slug}`],
  })()
}
