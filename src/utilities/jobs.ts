import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { CurrentOpeningsBlock, Page } from '@/payload-types'
import type { Locale } from '@/utilities/getLocale'
import { jobSlug } from '@/utilities/jobSlug'

export { jobSlug }

export type JobListing = NonNullable<CurrentOpeningsBlock['jobListings']>[number]

const openingsOf = (page?: Page | null): JobListing[] =>
  ((page?.layout || []).find((b) => b.blockType === 'currentOpenings') as CurrentOpeningsBlock | undefined)
    ?.jobListings || []

// The roles live in the Current Openings block on the published /careers page.
// Each one is returned with its slug (from the English title) and the listing
// in the requested locale.
export const getOpenJobs = async (locale: Locale = 'en'): Promise<{ slug: string; job: JobListing }[]> => {
  const payload = await getPayload({ config: configPromise })
  const find = (loc: Locale) =>
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      locale: loc,
      draft: false,
      overrideAccess: false,
      where: { slug: { equals: 'careers' } },
    })
  const en = openingsOf((await find('en')).docs[0] as Page)
  const local = locale === 'en' ? en : openingsOf((await find(locale)).docs[0] as Page)
  return en
    .map((job) => ({
      slug: jobSlug(job.title),
      job: local.find((j) => j.id && j.id === job.id) || job,
    }))
    .filter((j) => j.slug)
}

// Roles past their closing date are treated as closed.
export const isJobOpen = (job: JobListing): boolean =>
  !job.validThrough || new Date(job.validThrough).getTime() >= Date.now() - 24 * 60 * 60 * 1000

export const toLines = (text?: string | null): string[] =>
  (text || '').split('\n').map((line) => line.trim()).filter(Boolean)
