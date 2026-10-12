// app/(frontend)/preview-render/[locale]/[slug]/page.tsx
//
// This is the PREVIEW version of app/(frontend)/[locale]/[slug]/page.tsx, only
// ever reached when middleware detects Next's draft-mode bypass cookie (see
// src/middleware.ts). It's always dynamic, so it's safe for it to call
// draftMode() - ordinary visitors never render this file.
import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import React from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from '../../../[locale]/[slug]/page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Locale } from '@/utilities/getLocale'
import { queryPageBySlug } from '@/utilities/queries/pageQuery'
import type { Page } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale?: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug = 'home' } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const url = (locale === 'ar' ? '/ar' : '') + '/' + slug

  let page: Page | null

  page = await queryPageBySlug({
    slug,
    locale,
    draft,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic as Page
  }

  // Service pages live under /service/, but the sitemap used to list them at
  // the bare slug, so Google indexed those URLs. Send them to the real page.
  if (!page && !draft) {
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
    return await PayloadRedirects({ url })
  }

  const { hero, layout } = page

  return (
    <article className="relative">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} currentPage={page} locale={locale} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug = 'home' } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const page = await queryPageBySlug({
    slug,
    locale,
    draft,
  })

  return generateMeta({ doc: page })
}
