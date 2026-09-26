import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'

type SearchResult = {
  id: string | number
  title?: string | null
  slug?: string | null
  serviceCategory?: string | null
  meta?: { title?: string | null; description?: string | null } | null
  doc?: { relationTo?: string | null; value?: string | number | null } | null
}

function getResultHref(result: SearchResult): string {
  const slug = result.slug || ''
  if (result.doc?.relationTo === 'pages') {
    if (slug === 'home') return '/'
    return result.serviceCategory ? `/service/${slug}` : `/${slug}`
  }
  if (result.doc?.relationTo === 'devices') {
    return `/service/device/${slug}`
  }
  return `/posts/${slug}`
}

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  // "service"/"services" is a generic, navigational query — production's real page
  // copy doesn't repeat that word in every description, so a plain substring match
  // would return nothing useful even though every service page conceptually matches.
  // Special-case it to browse all real service pages directly.
  const normalizedQuery = query?.trim().toLowerCase()
  const isGenericServicesQuery = normalizedQuery === 'service' || normalizedQuery === 'services'

  const results = await payload.find({
    collection: 'search',
    depth: 0,
    limit: isGenericServicesQuery ? 300 : 24,
    sort: isGenericServicesQuery ? 'title' : undefined,
    select: {
      title: true,
      slug: true,
      serviceCategory: true,
      meta: true,
      doc: true,
    },
    pagination: false,
    ...(isGenericServicesQuery
      ? { where: { serviceCategory: { exists: true } } }
      : query
        ? {
            where: {
              or: [
                { title: { like: query } },
                { 'meta.description': { like: query } },
                { 'meta.title': { like: query } },
                { slug: { like: query } },
              ],
            },
          }
        : {}),
  })

  const docs = results.docs as unknown as SearchResult[]

  // If there's exactly one match, or one result's title is an exact match for the
  // query, that's an unambiguous result — go straight there instead of making the
  // user click through an intermediate results page.
  if (!isGenericServicesQuery && query && docs.length > 0) {
    const exactMatch = docs.find(
      (d) => (d.meta?.title || d.title || '').trim().toLowerCase() === normalizedQuery,
    )
    const target = docs.length === 1 ? docs[0] : exactMatch
    if (target) {
      redirect(getResultHref(target))
    }
  }

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {docs.length > 0 ? (
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((result) => {
              const href = getResultHref(result)
              const title = result.meta?.title || result.title
              return (
                <Link
                  key={result.id}
                  href={href}
                  className="block rounded-lg border border-border p-5 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                  {result.meta?.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">{result.meta.description}</p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Search | CODE3`,
  }
}
