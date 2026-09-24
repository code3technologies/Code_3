import type { CaseStudiesBlock as CaseStudiesBlockProps } from 'src/payload-types'

import Link from 'next/link'
import React from 'react'

import { CaseStudyCard } from '@/components/CaseStudyCard'
import { CaseStudyFeature } from '@/components/RelatedCaseStudy'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { getLocale } from '@/utilities/getLocale'
import { getPublishedCaseStudies } from '@/utilities/getCaseStudies'

export const CaseStudiesBlock: React.FC<CaseStudiesBlockProps> = async ({
  badge,
  title,
  subtitle,
  limit,
  ctaLabel,
}) => {
  const locale = await getLocale()
  const studies = (await getPublishedCaseStudies(locale)).slice(0, limit || 3)

  if (studies.length === 0) return null

  const prefix = locale === 'ar' ? '/ar' : ''

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mb-8 max-w-2xl">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-3 leading-relaxed text-gray-600">{subtitle}</p>}
        </Reveal>

        {/* One case study reads best as a wide feature; several as a grid. */}
        {studies.length === 1 ? (
          <Reveal delayMs={100}>
            <CaseStudyFeature study={studies[0]} prefix={prefix} />
          </Reveal>
        ) : (
          <Reveal delayMs={100} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((study) => (
              <CaseStudyCard key={study.id} study={study} prefix={prefix} />
            ))}
          </Reveal>
        )}

        <div className="mt-8 text-center">
          <Link href={`${prefix}/case-studies`} className="text-sm font-semibold text-primary_red hover:underline">
            {ctaLabel || 'View all case studies'} →
          </Link>
        </div>
      </div>
    </section>
  )
}
