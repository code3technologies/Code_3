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
import { getPostCta } from '@/utilities/postCategoryCta'

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

  // Calling this directly (rather than returning it as JSX) runs its
  // notFound()/redirect() call as part of this route's own render instead
  // of a separately-scheduled child component - see the [slug] and
  // service/[slug] routes for the full explanation of the soft-404 bug
  // this fixes.
  if (!post) return await PayloadRedirects({ url })

  const headings = extractHeadings(post.content)

  const curatedRelated = (post.relatedPosts || []).filter(
    (related): related is Post => typeof related === 'object' && related !== null,
  )
  const relatedDocs =
    curatedRelated.length > 0 ? curatedRelated : await fetchFallbackRecentPosts({ excludeId: post.id, locale })

  const cta = getPostCta(post.categories)

  return (
    <article>
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="pt-28 pb-16 md:pt-32">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <div className="min-w-0">
              <PostHero post={post} />

              <PostTableOfContents headings={headings} />

              <RichText data={post.content} enableGutter={false} />

              <p className="mt-4 border-t border-border pt-6 text-base leading-relaxed text-gray-700">
                <Link href={cta.href} className="font-semibold text-primary_red hover:underline">
                  {cta.label}
                </Link>{' '}
                {cta.trailingText}
              </p>
            </div>

            {relatedDocs.length > 0 && (
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <RelatedPosts
                  layout="sidebar"
                  title={
                    <>
                      <span className="text-primary_red">Recent</span> Blogs
                    </>
                  }
                  docs={relatedDocs}
                />
              </aside>
            )}
          </div>
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
