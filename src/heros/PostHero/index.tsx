import React from 'react'

import type { Post } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'
import { Media } from '@/components/Media'
import { estimateReadingTime } from '@/utilities/estimateReadingTime'

const formatPostDate = (timestamp: string): string =>
  new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, populatedAuthors, publishedAt, title, heroImage, content } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''
  const hasHeroImage = heroImage && typeof heroImage === 'object'
  const readingTime = estimateReadingTime(content)

  return (
    <div className="relative -mt-[10.4rem] flex items-end min-h-[70vh] bg-primary_red overflow-hidden">
      {hasHeroImage && (
        <Media
          resource={heroImage}
          fill
          priority
          imgClassName="object-cover"
          pictureClassName="absolute inset-0"
          className="absolute inset-0"
        />
      )}
      <div className="absolute pointer-events-none inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-foreground pb-10">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2 text-white">
          {categories && categories.length > 0 && (
            <div className="uppercase text-sm mb-6 font-semibold tracking-wide text-white/90">
              {categories.map((category, index) => {
                if (typeof category === 'object' && category !== null) {
                  const { title: categoryTitle } = category

                  const titleToUse = categoryTitle || 'Untitled category'

                  const isLast = index === categories.length - 1

                  return (
                    <React.Fragment key={index}>
                      {titleToUse}
                      {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                    </React.Fragment>
                  )
                }
                return null
              })}
            </div>
          )}

          <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/85">
            {hasAuthors && <span className="font-medium text-white">{formatAuthors(populatedAuthors)}</span>}
            {hasAuthors && publishedAt && <span aria-hidden="true">&middot;</span>}
            {publishedAt && <time dateTime={publishedAt}>{formatPostDate(publishedAt)}</time>}
            {readingTime > 0 && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>{readingTime} min read</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
