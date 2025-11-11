'use client'
import { cn } from '@/utilities/ui'
import React, { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import { Card, CardPostData } from '@/components/Card'
import { Pagination } from '@/components/Pagination'
import { PageRange } from '@/components/PageRange'

export type Props = {
  posts: CardPostData[]
  currentPage?: number
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props
  const searchParams = useSearchParams()

  // Get current page from URL, default to 1
  const currentPage = useMemo(() => {
    const page = searchParams.get('page')
    const parsedPage = page ? parseInt(page, 10) : 1
    return isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage
  }, [searchParams])

  // Pagination configuration - 9 posts per page
  const POSTS_PER_PAGE = 9
  const totalPosts = posts?.length || 0
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  // Calculate which posts to display on current page
  const paginatedPosts = useMemo(() => {
    if (!posts || posts.length === 0) return []
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const endIndex = startIndex + POSTS_PER_PAGE
    return posts.slice(startIndex, endIndex)
  }, [posts, currentPage])

  return (
    <div className={cn('container')}>
      {totalPosts > 0 && (
        <div className="mb-8">
          <PageRange
            collection="posts"
            currentPage={currentPage}
            limit={POSTS_PER_PAGE}
            totalDocs={totalPosts}
          />
        </div>
      )}

      <div>
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
      </div>

      {/* Pagination Component - only show if there's more than one page */}
      {totalPages > 1 && totalPosts > POSTS_PER_PAGE && (
        <Pagination page={currentPage} totalPages={totalPages} useQueryParams={true} />
      )}
    </div>
  )
}
