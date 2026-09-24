import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CaseStudyCard } from '@/components/CaseStudyCard'
import { Eyebrow } from '@/components/site/Eyebrow'
import { getLocale } from '@/utilities/getLocale'
import { getPublishedCaseStudies } from '@/utilities/getCaseStudies'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function CaseStudiesPage() {
  const locale = await getLocale()
  const studies = await getPublishedCaseStudies(locale)

  // Nothing published yet: don't expose an empty section.
  if (studies.length === 0) notFound()

  const prefix = locale === 'ar' ? '/ar' : ''

  return (
    <article>
      <Breadcrumbs
        items={[
          { name: locale === 'ar' ? 'الرئيسية' : 'Home', href: prefix || '/' },
          { name: locale === 'ar' ? 'دراسات الحالة' : 'Case Studies' },
        ]}
      />
      <div className="container mx-auto px-4 py-10 sm:px-6 md:py-14">
        <div className="mb-10 max-w-2xl">
          <Eyebrow>Case Studies</Eyebrow>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Real projects, real results</h1>
          <p className="mt-3 leading-relaxed text-gray-600">
            A look at what CODE3 has delivered for businesses across the UAE - the challenge, the solution and the
            outcome.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <CaseStudyCard key={study.id} study={study} prefix={prefix} />
          ))}
        </div>
      </div>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Case Studies | CODE3',
  description:
    'Real IT projects delivered by CODE3 for businesses across Dubai and the UAE - the challenge, the solution and the results.',
  alternates: { canonical: '/case-studies' },
  openGraph: mergeOpenGraph({ title: 'Case Studies | CODE3', url: '/case-studies' }),
}
