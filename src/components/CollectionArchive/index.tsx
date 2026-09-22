'use client'
import { cn } from '@/utilities/ui'
import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Card, CardPostData } from '@/components/Card'
import { Pagination } from '@/components/Pagination'
import { PageRange } from '@/components/PageRange'
import type { Category } from '@/payload-types'

export type Props = {
  posts: CardPostData[]
  categories?: Category[]
  currentPage?: number
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, categories = [] } = props
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Only offer filters for categories that actually have at least one post —
  // an empty filter tab is worse UX than no tab at all.
  const categoriesWithPosts = useMemo(() => {
    const usedIds = new Set<string>()
    posts.forEach((post) => {
      ;(post.categories || []).forEach((c) => {
        if (typeof c === 'object' && c !== null) usedIds.add(c.id)
      })
    })
    return categories.filter((c) => usedIds.has(c.id))
  }, [posts, categories])

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesSearch = !query || post.title?.toLowerCase().includes(query)
      const matchesCategory =
        !activeCategory ||
        (post.categories || []).some((c) => typeof c === 'object' && c !== null && c.id === activeCategory)
      return matchesSearch && matchesCategory
    })
  }, [posts, search, activeCategory])

  // Get current page from URL, default to 1
  const currentPage = useMemo(() => {
    const page = searchParams.get('page')
    const parsedPage = page ? parseInt(page, 10) : 1
    return isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage
  }, [searchParams])

  // Pagination configuration - 9 posts per page
  const POSTS_PER_PAGE = 9
  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  // Filtering can leave the URL's ?page= pointing past the end of the new,
  // smaller result set — clamp instead of showing an empty page.
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))

  const paginatedPosts = useMemo(() => {
    if (filteredPosts.length === 0) return []
    const startIndex = (safePage - 1) * POSTS_PER_PAGE
    const endIndex = startIndex + POSTS_PER_PAGE
    return filteredPosts.slice(startIndex, endIndex)
  }, [filteredPosts, safePage])

  return (
    <div className={cn('container')}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-gray-400 focus:border-primary_red focus:outline-none focus:ring-1 focus:ring-primary_red"
          />
        </div>

        {categoriesWithPosts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                activeCategory === null
                  ? 'border-primary_red bg-primary_red text-white'
                  : 'border-border bg-white text-gray-600 hover:border-primary_red hover:text-primary_red',
              )}
            >
              All
            </button>
            {categoriesWithPosts.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                  activeCategory === category.id
                    ? 'border-primary_red bg-primary_red text-white'
                    : 'border-border bg-white text-gray-600 hover:border-primary_red hover:text-primary_red',
                )}
              >
                {category.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {totalPosts > 0 && (
        <div className="mb-8">
          <PageRange
            collection="posts"
            currentPage={safePage}
            limit={POSTS_PER_PAGE}
            totalDocs={totalPosts}
          />
        </div>
      )}

      {totalPosts === 0 ? (
        <div className="py-16 text-center text-gray-500">
          No articles match your search{activeCategory ? ' in this category' : ''}. Try a different term
          {activeCategory ? ' or clear the category filter' : ''}.
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {paginatedPosts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={result.id || index}>
                  <Card className="h-full" doc={result} relationTo="posts" showCategories />
                </div>
              )
            }

            return null
          })}
        </div>
      )}

      {/* Pagination Component - only show if there's more than one page */}
      {totalPages > 1 && totalPosts > POSTS_PER_PAGE && (
        <Pagination page={safePage} totalPages={totalPages} useQueryParams={true} />
      )}
    </div>
  )
}
