// app/(frontend)/[locale]/[slug]/page.tsx
//
// This is the PUBLIC version of this route: it never calls draftMode(), so it
// stays eligible for static/ISR rendering. Live-preview requests are routed by
// middleware to the mirrored, always-dynamic copy under
// app/(frontend)/preview-render/[locale]/[slug]/page.tsx instead - see
// src/middleware.ts. Keep the two in sync; shared fetch logic lives in
// @/utilities/queries/pageQuery.
import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { permanentRedirect } from 'next/navigation'
import React from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import type { Locale } from '@/utilities/getLocale'
import { queryPageBySlug } from '@/utilities/queries/pageQuery'
import type { Page } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    where: {
      or: [
        {
          serviceCategory: {
            equals: 'none',
          },
        },
        {
          serviceCategory: {
            exists: false,
          },
        },
      ],
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    locale?: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { locale: rawLocale, slug = 'home' } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const url = (locale === 'ar' ? '/ar' : '') + '/' + slug

  let page: Page | null

  page = await queryPageBySlug({
    slug,
    locale,
    draft: false,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic as Page
  }

  // Service pages live under /service/, but the sitemap used to list them at
  // the bare slug, so Google indexed those URLs. Send them to the real page.
  if (!page) {
    const payload = await getPayload({ config: configPromise })
    const servicePage = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      pagination: false,
      select: { slug: true },
      where: {
        and: [{ slug: { equals: slug } }, { serviceCategory: { not_equals: 'none' } }],
      },
    })
    if (servicePage.docs[0]) {
      permanentRedirect(`${locale === 'ar' ? '/ar' : ''}/service/${slug}`)
    }
  }

  if (!page) {
    // Calling this directly (rather than returning it as JSX) runs its
    // notFound()/redirect() call as part of this route's own render instead
    // of a separately-scheduled child component - the latter let the 200
    // status for the streamed shell commit before the notFound() signal
    // arrived, so every unmatched slug was served as a soft 404 (visibly
    // showing the not-found UI, but with an HTTP 200 status).
    return await PayloadRedirects({ url })
  }

  const { hero, layout } = page

  return (
    <article className="relative">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} currentPage={page} locale={locale} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: rawLocale, slug = 'home' } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const page = await queryPageBySlug({
    slug,
    locale,
    draft: false,
  })

  return generateMeta({ doc: page })
}
