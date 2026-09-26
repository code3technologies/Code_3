// app/(frontend)/preview-render/[locale]/service/[slug]/page.tsx
//
// PREVIEW version of app/(frontend)/[locale]/service/[slug]/page.tsx - see the
// note there and in src/middleware.ts.
import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from '../../../../[locale]/service/[slug]/page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Locale } from '@/utilities/getLocale'
import { ServiceSchema } from '@/components/StructuredData/ServiceSchema'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/Breadcrumbs'
import { RelatedCaseStudy } from '@/components/RelatedCaseStudy'
import { queryServicePageBySlug } from '@/utilities/queries/servicePageQuery'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale?: string
    slug: string
  }>
}

export default async function ServicePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const url = (locale === 'ar' ? '/ar' : '') + '/service/' + slug

  const page = await queryServicePageBySlug({
    slug,
    locale,
    draft,
  })

  if (!page) {
    return await PayloadRedirects({ url })
  }

  const { hero, layout } = page

  const faqIndex = layout.findIndex((block) => block.blockType === 'faq')
  const caseStudyIndex = faqIndex === -1 ? layout.length : faqIndex

  const prefix = locale === 'ar' ? '/ar' : ''
  const parent = typeof page.parentService === 'object' && page.parentService ? page.parentService : null
  const breadcrumbs: BreadcrumbItem[] = [
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', href: prefix || '/' },
    ...(parent ? [{ name: parent.title, href: `${prefix}/service/${parent.slug}` }] : []),
    { name: page.title },
  ]

  return (
    <article className="relative">
      <PageClient />
      <ServiceSchema page={page} path={url} />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <Breadcrumbs items={breadcrumbs} />
      <RenderHero {...hero} />
      {/* Case study card sits just before the FAQ (or at the end if the page has none). */}
      <RenderBlocks blocks={layout.slice(0, caseStudyIndex)} currentPage={page} locale={locale} />
      <RelatedCaseStudy serviceId={page.id} locale={locale} />
      <RenderBlocks blocks={layout.slice(caseStudyIndex)} currentPage={page} locale={locale} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const page = await queryServicePageBySlug({
    slug,
    locale,
    draft,
  })

  return generateMeta({ doc: page })
}
