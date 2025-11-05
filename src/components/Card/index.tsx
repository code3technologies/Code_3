'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'id' |'slug' | 'categories' | 'meta' | 'title' | 'heroImage' | 'publishedAt' | 'populatedAuthors' | 'authors'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'blogs' | 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title, heroImage, publishedAt, populatedAuthors, authors } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  // Get author info with type safety
  const getAuthorName = () => {
    const author = populatedAuthors?.[0] || authors?.[0]
    
    if (typeof author === 'object' && author?.name) {
      return author.name
    }
    return 'Anonymous'
  }

  const authorName = getAuthorName()
  const authorInitial = authorName.charAt(0).toUpperCase()

  // Format published date
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full',
        className,
      )}
      ref={card.ref}
    >
      {/* Hero Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-200">
        {heroImage && typeof heroImage !== 'string' && <Media resource={heroImage} size="33vw" />}
        {metaImage && typeof metaImage !== 'string' && !heroImage && <Media resource={metaImage} size="33vw" />}
        {!heroImage && !metaImage && <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Categories */}
        {showCategories && hasCategories && (
          <div className="uppercase text-xs mb-3 text-gray-600">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category
                const categoryTitle = titleFromCategory || 'Untitled category'
                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Title */}
        {titleToUse && (
          <div className="prose mb-2">
            <h3 className="line-clamp-2">
              <Link className="not-prose text-lg font-bold text-gray-900" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="mt-2 mb-4 flex-grow">
            <p className="text-sm text-gray-600 line-clamp-3">{sanitizedDescription}</p>
          </div>
        )}

        {/* Footer: Author & Date */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-black/80 flex items-center justify-center text-white font-semibold text-xs">
                {authorInitial}
              </div>
              <span className="font-medium text-gray-700 truncate">{authorName}</span>
            </div>
            {formattedDate && <span className="text-gray-500 whitespace-nowrap">{formattedDate}</span>}
          </div>
        </div>
      </div>
    </article>
  )
}
