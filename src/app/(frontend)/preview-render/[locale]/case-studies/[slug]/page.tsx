// app/(frontend)/preview-render/[locale]/case-studies/[slug]/page.tsx
//
// PREVIEW version of app/(frontend)/[locale]/case-studies/[slug]/page.tsx - see
// the note there and in src/middleware.ts.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import React from 'react'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Locale } from '@/utilities/getLocale'
import { queryCaseStudy } from '@/utilities/queries/caseStudyQuery'
import { CaseStudyDetail } from '../../../../_shared/CaseStudyDetail'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale?: string; slug: string }> }

export default async function CaseStudyPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const study = await queryCaseStudy({ slug, locale, draft })

  if (!study) notFound()

  return <CaseStudyDetail study={study} locale={locale} draft={draft} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const study = await queryCaseStudy({ slug, locale, draft })

  if (!study) return { title: 'Case Study | CODE3' }

  const title = study.meta?.title || `${study.title} | CODE3`
  const description = study.meta?.description || study.summary
  return {
    title,
    description,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: mergeOpenGraph({ title, description, url: `/case-studies/${study.slug}` }),
  }
}
