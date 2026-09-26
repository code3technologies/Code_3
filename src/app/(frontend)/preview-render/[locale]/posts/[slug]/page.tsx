// app/(frontend)/preview-render/[locale]/posts/[slug]/page.tsx
//
// PREVIEW version of app/(frontend)/[locale]/posts/[slug]/page.tsx - see the
// note there and in src/middleware.ts.
import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import React from 'react'
import Link from 'next/link'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from '../../../../[locale]/posts/[slug]/page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Locale } from '@/utilities/getLocale'
import { extractHeadings } from '@/utilities/extractHeadings'
import { PostTableOfContents } from '@/components/PostTableOfContents'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { getPostCta } from '@/utilities/postCategoryCta'
import { queryPostBySlug, fetchFallbackRecentPosts } from '@/utilities/queries/postQuery'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale?: string
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug = '' } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const url = (locale === 'ar' ? '/ar' : '') + '/posts/' + slug
  const post = await queryPostBySlug({ slug, locale, draft })

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
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug = '' } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const post = await queryPostBySlug({ slug, locale, draft })

  return generateMeta({ doc: post })
}
