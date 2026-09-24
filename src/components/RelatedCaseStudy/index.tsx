import Link from 'next/link'
import React from 'react'

import type { CaseStudy } from '@/payload-types'
import { Reveal } from '@/components/site/Reveal'
import { firstNumericResult, getCaseStudiesForService } from '@/utilities/getCaseStudies'

// Wide feature card for one case study: headline number on the brand gradient
// beside the story. Used on service pages (with a "see how this worked" prompt)
// and on the homepage strip when there's only one case study to show.
export const CaseStudyFeature = ({
  study,
  prefix = '',
  heading,
}: {
  study: CaseStudy
  prefix?: string
  // When set, shown as the heading with the study title beneath it; otherwise
  // the study title is the heading.
  heading?: string
}) => {
  const stats = (study.results || []).filter((r) => /^\d/.test(r.value.trim())).slice(0, 2)
  const lead = firstNumericResult(study)

  return (
    <Link
      href={`${prefix}/case-studies/${study.slug}`}
      className="group grid overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary_red/30 hover:shadow-xl md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]"
    >
      <div
        className="relative flex min-h-[14rem] flex-col justify-end overflow-hidden p-8 md:p-10"
        style={{ background: 'linear-gradient(135deg, #b3121f 0%, #8b0f1f 55%, #2d0e0e 100%)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-[70px]" />
        {lead && (
          <div className="relative">
            <div className="text-6xl font-extrabold leading-none tracking-tight text-white md:text-7xl">{lead.value}</div>
            <div className="mt-3 max-w-[15rem] text-sm font-medium leading-snug text-white/80">{lead.label}</div>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center p-8 md:p-10">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary_red">Case study</span>
        <h3 className="mt-2 text-2xl font-semibold leading-snug tracking-tight text-foreground md:text-3xl">
          {heading || study.title}
        </h3>
        {heading && <p className="mt-3 text-[15px] font-medium leading-snug text-foreground">{study.title}</p>}
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">{study.summary}</p>

        {stats.length > 1 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {stats.map((s, i) => (
              <li
                key={s.id || i}
                className="rounded-full border border-primary_red/20 bg-[#FDEBEC] px-3 py-1 text-xs font-semibold text-primary_red"
              >
                {s.value} · {s.label}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary_red">
          Read the case study
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

// Service-page card linking to a published case study that used that service
// (matched via the case study's "services" field). Renders nothing when there
// isn't one.
export const RelatedCaseStudy = async ({ serviceId, locale }: { serviceId: string; locale: 'en' | 'ar' }) => {
  const [study] = await getCaseStudiesForService(serviceId, locale)
  if (!study) return null

  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 md:py-14">
      <Reveal>
        <CaseStudyFeature
          study={study}
          prefix={locale === 'ar' ? '/ar' : ''}
          heading="See how this worked for a Dubai business"
        />
      </Reveal>
    </section>
  )
}
