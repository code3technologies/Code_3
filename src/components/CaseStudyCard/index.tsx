import Link from 'next/link'
import React from 'react'

import type { CaseStudy } from '@/payload-types'
import { Media } from '@/components/Media'
import { firstNumericResult } from '@/utilities/getCaseStudies'

// Card used on the listing page and the homepage strip. Without a photo it
// shows the case study's headline number on the brand gradient, so cards
// look finished even before any imagery exists.
export const CaseStudyCard = ({ study, prefix = '' }: { study: CaseStudy; prefix?: string }) => {
  const client = study.clientName || study.clientDescriptor
  const stat = firstNumericResult(study)
  const hasImage = study.heroImage && typeof study.heroImage === 'object'

  return (
    <Link
      href={`${prefix}/case-studies/${study.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary_red/30 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {hasImage ? (
          <Media
            resource={study.heroImage as NonNullable<typeof study.heroImage> & object}
            alt={study.title}
            fill
            size="33vw"
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-start justify-end p-6"
            style={{ background: 'linear-gradient(135deg, #b3121f 0%, #8b0f1f 55%, #2d0e0e 100%)' }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.16]"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            {stat && (
              <>
                <span className="relative text-5xl font-extrabold leading-none tracking-tight text-white">{stat.value}</span>
                <span className="relative mt-2 max-w-[16rem] text-sm font-medium leading-snug text-white/80">{stat.label}</span>
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {(study.industry || client) && (
          <span className="line-clamp-1 text-xs font-semibold uppercase tracking-wide text-primary_red">
            {[study.industry, client].filter(Boolean).join(' · ')}
          </span>
        )}
        <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground group-hover:text-primary_red">{study.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">{study.summary}</p>
        <span className="mt-4 text-sm font-medium text-primary_red">Read the case study →</span>
      </div>
    </Link>
  )
}
