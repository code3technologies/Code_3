// app/(frontend)/[locale]/posts/[slug]/page.tsx
//
// PUBLIC version - see the note in [locale]/[slug]/page.tsx. Preview
// counterpart: app/(frontend)/preview-render/[locale]/posts/[slug]/page.tsx.
import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'
import Link from 'next/link'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import type { Locale } from '@/utilities/getLocale'
import { extractHeadings } from '@/utilities/extractHeadings'
import { PostTableOfContents } from '@/components/PostTableOfContents'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { getPostCta } from '@/utilities/postCategoryCta'
import { queryPostBySlug, fetchFallbackRecentPosts } from '@/utilities/queries/postQuery'

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
    locale?: string
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { locale: rawLocale, slug = '' } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const url = (locale === 'ar' ? '/ar' : '') + '/posts/' + slug
  const post = await queryPostBySlug({ slug, locale, draft: false })

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

      <Breadcrumbs
        items={[
          { name: locale === 'ar' ? 'الرئيسية' : 'Home', href: locale === 'ar' ? '/ar' : '/' },
          { name: locale === 'ar' ? 'المدونة' : 'Blog', href: (locale === 'ar' ? '/ar' : '') + '/posts' },
          { name: post.title },
        ]}
      />

      <div className="pt-10 pb-16 md:pt-12">
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

              <NewsletterSignup source="blog-post" locale={locale} className="mt-8" />
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
  const { locale: rawLocale, slug = '' } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const post = await queryPostBySlug({ slug, locale, draft: false })

  return generateMeta({ doc: post })
}
