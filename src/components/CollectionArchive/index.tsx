'use client'
import { cn } from '@/utilities/ui'
import React, { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import { Card, CardPostData } from '@/components/Card'
import { Pagination } from '@/components/Pagination'

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props
  const searchParams = useSearchParams()
  
  // Get current page from URL, default to 1
  const currentPage = useMemo(() => {
    const page = searchParams.get('page')
    return page ? parseInt(page, 10) : 1
  }, [searchParams])

  // Pagination configuration
  const POSTS_PER_PAGE = 9
  const totalPages = Math.ceil((posts?.length || 0) / POSTS_PER_PAGE)

  // Calculate which posts to display on current page
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const endIndex = startIndex + POSTS_PER_PAGE
    return posts?.slice(startIndex, endIndex) || []
  }, [posts, currentPage])

  return (
    <div className={cn('container')}>
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

      {/* Pagination Component */}
      <Pagination page={currentPage} totalPages={totalPages} />
    </div>
  )
}
