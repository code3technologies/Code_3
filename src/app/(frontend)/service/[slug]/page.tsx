// app/(frontend)/service/[slug]/page.tsx
import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getLocale } from '@/utilities/getLocale'
import { ServiceSchema } from '@/components/StructuredData/ServiceSchema'
import type { Page } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    where: {
      serviceCategory: {
        not_equals: 'none',
      },
    },
  })

  const params = pages.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function ServicePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const locale = await getLocale()
  const url = (locale === 'ar' ? '/ar' : '') + '/service/' + slug

  const page = await queryServicePageBySlug({
    slug,
    locale,
    draft,
  })

  if (!page) {
    // Calling this directly (rather than returning it as JSX) runs its
    // notFound()/redirect() call as part of this route's own render instead
    // of a separately-scheduled child component - the latter let the 200
    // status for the streamed shell commit before the notFound() signal
    // arrived, so every unmatched slug was served as a soft 404 (visibly
    // showing the not-found UI, but with an HTTP 200 status).
    return await PayloadRedirects({ url })
  }

  const { hero, layout } = page

  return (
    <article className="relative">
      <PageClient />
      <ServiceSchema page={page} path={url} />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} currentPage={page} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const locale = await getLocale()
  const page = await queryServicePageBySlug({
    slug,
    locale,
    draft,
  })

  return generateMeta({ doc: page })
}

const fetchServicePageBySlug = async ({
  slug,
  locale,
  draft,
}: {
  slug: string
  locale: 'en' | 'ar'
  draft: boolean
}): Promise<Page | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    depth: 2,
    draft,
    limit: 1,
    locale,
    pagination: false,
    overrideAccess: draft,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          serviceCategory: {
            not_equals: 'none',
          },
        },
      ],
    },
  })

  return (result.docs?.[0] as Page) || null
}

// Draft/preview requests always read fresh so editors see live content;
// published requests go through a cross-request cache keyed by slug+locale
// and invalidated by revalidatePage's `page_${slug}` tag.
const queryServicePageBySlug = async (args: {
  slug: string
  locale: 'en' | 'ar'
  draft: boolean
}): Promise<Page | null> => {
  if (args.draft) return fetchServicePageBySlug(args)

  return unstable_cache(() => fetchServicePageBySlug(args), ['service-page', args.slug, args.locale], {
    tags: [`page_${args.slug}`],
  })()
}
