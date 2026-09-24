import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Media } from '@/components/Media'
import { getLocale } from '@/utilities/getLocale'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

const getCaseStudies = (locale: 'en' | 'ar') =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'case-studies',
        depth: 1,
        draft: false,
        limit: 100,
        locale,
        overrideAccess: false,
        pagination: false,
        sort: '-publishedAt',
      })
      return result.docs
    },
    ['case-studies-list', locale],
    { tags: ['case-studies-list', 'pages-sitemap'] },
  )()

export default async function CaseStudiesPage() {
  const locale = await getLocale()
  const studies = await getCaseStudies(locale)

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
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Real projects, real results
          </h1>
          <p className="mt-3 leading-relaxed text-gray-600">
            A look at what CODE3 has delivered for businesses across the UAE - the challenge, the solution and the
            outcome.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => {
            const client = study.clientName || study.clientDescriptor
            return (
              <Link
                key={study.id}
                href={`${prefix}/case-studies/${study.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary_red/30 hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {study.heroImage && typeof study.heroImage === 'object' && (
                    <Media
                      resource={study.heroImage}
                      alt={study.title}
                      fill
                      size="33vw"
                      imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {(study.industry || client) && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary_red">
                      {[study.industry, client].filter(Boolean).join(' · ')}
                    </span>
                  )}
                  <h2 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary_red">
                    {study.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">{study.summary}</p>
                  <span className="mt-4 text-sm font-medium text-primary_red">Read the case study →</span>
                </div>
              </Link>
            )
          })}
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
