// One page per open role (/careers/<role>), so each can carry JobPosting
// structured data: Google Jobs only reads it from a page about a single job,
// never from a listing like /careers. Roles come from the Current Openings
// block on the published /careers page; there is no separate collection.
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Locale } from '@/utilities/getLocale'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Header, Media } from '@/payload-types'
import { getOpenJobs, isJobOpen, toLines, type JobListing } from '@/utilities/jobs'
import { ApplyButton } from './ApplyButton'

// Cached at the edge after the first request; re-read hourly so edits to the
// /careers listing reach these pages without a separate revalidation hook.
export const revalidate = 3600
export function generateStaticParams() {
  return []
}

type Args = { params: Promise<{ locale?: string; job: string }> }

const findJob = async (rawLocale: string | undefined, slug: string) => {
  const locale: Locale = rawLocale === 'ar' ? 'ar' : 'en'
  const jobs = await getOpenJobs(locale)
  // By slug, or by id (the Arabic card links by id if a title is in Arabic).
  const match = jobs.find((j) => j.slug === slug || j.job.id === slug)
  return match && isJobOpen(match.job) ? { locale, ...match } : null
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const employmentType = (type?: string | null): string | undefined => {
  const t = (type || '').toLowerCase()
  if (t.includes('full')) return 'FULL_TIME'
  if (t.includes('part')) return 'PART_TIME'
  if (t.includes('contract')) return 'CONTRACTOR'
  if (t.includes('intern')) return 'INTERN'
  if (t.includes('temp')) return 'TEMPORARY'
  return undefined
}

const jobPostingSchema = (job: JobListing, url: string, siteUrl: string, logoUrl?: string) => {
  const responsibilities = toLines(job.responsibilitiesText)
  const requirements = toLines(job.requirementsText)
  const list = (heading: string, items: string[]) =>
    items.length ? `<h3>${heading}</h3><ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : ''
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: `<p>${escapeHtml(job.description || '')}</p>${list('Key Responsibilities', responsibilities)}${list('Requirements', requirements)}`,
    datePosted: job.datePosted,
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    ...(employmentType(job.type) ? { employmentType: employmentType(job.type) } : {}),
    identifier: { '@type': 'PropertyValue', name: 'CODE3 Technologies', value: job.id },
    hiringOrganization: {
      '@type': 'Organization',
      name: 'CODE3 Technologies',
      sameAs: siteUrl,
      ...(logoUrl ? { logo: logoUrl } : {}),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Office 105, Bayan Building, Dubai Investment Park First',
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        addressCountry: 'AE',
      },
    },
    directApply: true,
    url,
  }
}

export default async function JobPage({ params: paramsPromise }: Args) {
  const { locale: rawLocale, job: slug } = await paramsPromise
  const found = await findJob(rawLocale, slug)
  if (!found) notFound()
  const { job, locale, slug: canonicalSlug } = found

  const prefix = locale === 'ar' ? '/ar' : ''
  const siteUrl = getServerSideURL().replace(/\/+$/, '')
  const url = `${siteUrl}/careers/${canonicalSlug}`
  // Same square logo the Organization schema uses (header global).
  const logo = ((await getCachedGlobal('header', 1, 'en')()) as Header)?.logo as Media | undefined
  const logoUrl = logo?.sizes?.square?.url ? getMediaUrl(logo.sizes.square.url) : logo?.url ? getMediaUrl(logo.url) : undefined
  const responsibilities = toLines(job.responsibilitiesText)
  const requirements = toLines(job.requirementsText)
  const posted = job.datePosted
    ? new Date(job.datePosted).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Careers', item: `${siteUrl}/careers` },
      { '@type': 'ListItem', position: 3, name: job.title, item: url },
    ],
  }

  return (
    <article className="pt-28 pb-24">
      {job.datePosted && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema(job, url, siteUrl, logoUrl)) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="container max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <Link href={`${prefix}/`} className="hover:text-primary_red">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`${prefix}/careers`} className="hover:text-primary_red">
            Careers
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{job.title}</span>
        </nav>

        <p className="mt-8 text-xs font-medium uppercase tracking-wide text-primary_red">{job.category}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{job.title}</h1>

        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
          <span className="rounded-full bg-[#F5F5F6] px-3 py-1">{job.location}</span>
          <span className="rounded-full bg-[#F5F5F6] px-3 py-1">{job.type}</span>
          {posted && <span className="rounded-full bg-[#F5F5F6] px-3 py-1">Posted {posted}</span>}
        </div>

        <p className="mt-8 text-base leading-relaxed text-gray-700">{job.description}</p>

        {responsibilities.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-foreground">Key Responsibilities</h2>
            <ul className="mt-4 space-y-2">
              {responsibilities.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary_red" />
                  {line}
                </li>
              ))}
            </ul>
          </section>
        )}

        {requirements.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-foreground">Requirements</h2>
            <ul className="mt-4 space-y-2">
              {requirements.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary_red" />
                  {line}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">Interested in this role?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Apply with your CV and we&apos;ll get back to you. You&apos;ll be working from our office in Dubai
            Investment Park, with site visits to clients across the UAE.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <ApplyButton jobTitle={job.title} className="rounded-full" />
            <Link href={`${prefix}/careers#current-openings`} className="text-sm font-medium text-primary_red hover:underline">
              See all open roles
            </Link>
          </div>
        </section>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: rawLocale, job: slug } = await paramsPromise
  const found = await findJob(rawLocale, slug)
  if (!found) return { title: 'Careers | CODE3' }
  const { job, slug: canonicalSlug } = found
  const title = `${job.title} Job in Dubai | CODE3 Careers`
  const description = (job.description || '').length > 155 ? `${job.description.slice(0, 152).trimEnd()}...` : job.description
  const path = `/careers/${canonicalSlug}`
  return {
    title,
    description,
    alternates: { canonical: path, languages: { en: path, ar: `/ar${path}`, 'x-default': path } },
    openGraph: mergeOpenGraph({ title, description, url: path }),
  }
}
