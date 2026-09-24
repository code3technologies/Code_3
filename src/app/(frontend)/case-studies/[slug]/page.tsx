import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

import type { Page } from '@/payload-types'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Media } from '@/components/Media'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getLocale } from '@/utilities/getLocale'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

type Args = { params: Promise<{ slug: string }> }

const fetchCaseStudy = async ({ slug, locale, draft }: { slug: string; locale: 'en' | 'ar'; draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'case-studies',
    depth: 1,
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
}

// Draft/preview reads fresh; published reads are cached and invalidated by
// the case_study_<slug> tag from revalidateCaseStudy.
const queryCaseStudy = (args: { slug: string; locale: 'en' | 'ar'; draft: boolean }) => {
  if (args.draft) return fetchCaseStudy(args)
  return unstable_cache(() => fetchCaseStudy(args), ['case-study', args.slug, args.locale], {
    tags: [`case_study_${args.slug}`],
  })()
}

export default async function CaseStudyPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const locale = await getLocale()
  const study = await queryCaseStudy({ slug, locale, draft })

  if (!study) notFound()

  const prefix = locale === 'ar' ? '/ar' : ''
  const client = study.clientName || study.clientDescriptor
  const services = (study.services || []).filter((s): s is Page => typeof s === 'object' && s !== null)

  return (
    <article>
      {draft && <LivePreviewListener />}
      <Breadcrumbs
        items={[
          { name: locale === 'ar' ? 'الرئيسية' : 'Home', href: prefix || '/' },
          { name: locale === 'ar' ? 'دراسات الحالة' : 'Case Studies', href: `${prefix}/case-studies` },
          { name: study.title },
        ]}
      />

      <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
        <Eyebrow>{[study.industry, client].filter(Boolean).join(' · ') || 'Case Study'}</Eyebrow>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{study.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">{study.summary}</p>

        {study.heroImage && typeof study.heroImage === 'object' && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-gray-100">
            <Media resource={study.heroImage} alt={study.title} fill priority size="900px" imgClassName="object-cover" />
          </div>
        )}

        {study.results && study.results.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {study.results.map((result, i) => (
              <div key={result.id || i} className="rounded-2xl border border-border bg-gray-50/60 p-5">
                <div className="text-3xl font-bold text-primary_red">{result.value}</div>
                <div className="mt-1 text-sm text-gray-600">{result.label}</div>
              </div>
            ))}
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">The challenge</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-700">{study.challenge}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">Our solution</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-700">{study.solution}</p>
        </section>

        {study.testimonialQuote && (
          <blockquote className="mt-10 rounded-2xl border border-border bg-gray-50/60 p-6">
            <p className="text-lg italic leading-relaxed text-foreground">&ldquo;{study.testimonialQuote}&rdquo;</p>
            {study.testimonialAuthor && (
              <footer className="mt-3 text-sm font-medium text-gray-500">- {study.testimonialAuthor}</footer>
            )}
          </blockquote>
        )}

        {services.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-foreground">Services delivered</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`${prefix}/service/${service.slug}`}
                    className="inline-block rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:border-primary_red/40 hover:text-primary_red"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 rounded-2xl border border-primary_red/20 bg-[#FDEBEC] p-6">
          <p className="text-lg font-semibold text-foreground">Facing a similar challenge?</p>
          <p className="mt-1 text-gray-600">Tell us about your environment and we&apos;ll recommend the right approach.</p>
          <Link
            href={`${prefix}/contact`}
            className="mt-4 inline-block rounded-full bg-primary_red px-5 py-2 text-sm font-semibold text-white"
          >
            Book a Free Consultation
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const locale = await getLocale()
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
