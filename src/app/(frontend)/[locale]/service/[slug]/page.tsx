// app/(frontend)/[locale]/service/[slug]/page.tsx
//
// PUBLIC version - see the note in [locale]/[slug]/page.tsx. Preview
// counterpart: app/(frontend)/preview-render/[locale]/service/[slug]/page.tsx.
import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import type { Locale } from '@/utilities/getLocale'
import { ServiceSchema } from '@/components/StructuredData/ServiceSchema'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/Breadcrumbs'
import { RelatedCaseStudy } from '@/components/RelatedCaseStudy'
import { queryServicePageBySlug } from '@/utilities/queries/servicePageQuery'

// Returning [] (rather than omitting generateStaticParams entirely) is
// deliberate: Next only treats a dynamic segment as "render on first visit,
// then cache at the edge like ISR" when generateStaticParams exists at all -
// omit it completely and every request is fully server-rendered forever,
// never cached. Returning [] costs nothing at build time (no DB query, so
// this doesn't reintroduce the build-timeout problem an earlier version of
// this route hit by eagerly querying every slug) while still opting in to
// that on-demand-then-cached behavior for every real slug via dynamicParams
// (default true). Cache invalidation on publish is unaffected - it already
// goes through revalidatePath/revalidateTag, not a time-based revalidate.
export function generateStaticParams() {
  return []
}

type Args = {
  params: Promise<{
    locale?: string
    slug: string
  }>
}

export default async function ServicePage({ params: paramsPromise }: Args) {
  const { locale: rawLocale, slug } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const url = (locale === 'ar' ? '/ar' : '') + '/service/' + slug

  const page = await queryServicePageBySlug({
    slug,
    locale,
    draft: false,
  })

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
  const { locale: rawLocale, slug } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const page = await queryServicePageBySlug({
    slug,
    locale,
    draft: false,
  })

  return generateMeta({ doc: page })
}
