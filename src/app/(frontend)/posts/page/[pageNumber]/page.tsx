import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  // Fetched in full (not server-paginated) so the search box and category
  // filters on CollectionArchive can work instantly against the whole set —
  // the blog is small enough (a few dozen posts) that this is cheap, and it
  // avoids juggling two separate pagination systems (this route's `pageNumber`
  // param vs. CollectionArchive's own client-side `?page=` slicing).
  const [posts, categories] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      pagination: false,
      sort: '-publishedAt',
      overrideAccess: false,
    }),
    payload.find({
      collection: 'categories',
      pagination: false,
      overrideAccess: false,
    }),
  ])

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Insights & Articles</h1>
        </div>
      </div>

      <Suspense fallback={<div className="container py-8">Loading posts...</div>}>
        <CollectionArchive posts={posts.docs} categories={categories.docs} />
      </Suspense>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  const page = Number(pageNumber)
  return {
    title: `Insights & Articles${page > 1 ? ` | Page ${page}` : ''} | CODE3`,
    description:
      'IT, cybersecurity, cloud, networking and AV insights from the CODE3 Technologies team in Dubai and the UAE.',
  }
}

// Intentionally no generateStaticParams here: this route previously prerendered
// every page at build time, and a slow/degraded DB connection during a
// production build turned that into a 60s+ timeout that failed the entire
// deployment (not just this page). With `revalidate` set above, Next.js still
// caches each page after its first on-demand render, so this trades a slightly
// slower first visit for the whole site never being blocked by this route again.
