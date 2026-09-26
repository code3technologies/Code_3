// app/(frontend)/[locale]/case-studies/[slug]/page.tsx
//
// PUBLIC version - see the note in ../../[slug]/page.tsx. Preview counterpart:
// app/(frontend)/preview-render/[locale]/case-studies/[slug]/page.tsx. The
// shared presentational body lives in ../../../_shared/CaseStudyDetail.tsx.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Locale } from '@/utilities/getLocale'
import { queryCaseStudy } from '@/utilities/queries/caseStudyQuery'
import { CaseStudyDetail } from '../../../_shared/CaseStudyDetail'

// Returning [] gets this route on-demand-cached at the edge (render once,
// then serve from cache, invalidated by revalidateCaseStudy's
// `case_study_${slug}` tag) instead of fully server-rendered on every
// request - see the comment on ../../[slug]/page.tsx. There are only a
// handful of case studies, so this isn't a build-time-cost concern the way
// pages/services/devices/posts were; it just never had this at all before.
export function generateStaticParams() {
  return []
}

type Args = { params: Promise<{ locale?: string; slug: string }> }

export default async function CaseStudyPage({ params: paramsPromise }: Args) {
  const { locale: rawLocale, slug } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const study = await queryCaseStudy({ slug, locale, draft: false })

  if (!study) notFound()

  return <CaseStudyDetail study={study} locale={locale} draft={false} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: rawLocale, slug } = await paramsPromise
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const study = await queryCaseStudy({ slug, locale, draft: false })

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
