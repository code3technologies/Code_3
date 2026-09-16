import React from 'react'
import Link from 'next/link'
import { CornerUpLeft, User, Clock } from 'lucide-react'

import type { Post } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'
import { Media } from '@/components/Media'
import { estimateReadingTime } from '@/utilities/estimateReadingTime'
import { PostShareButtons } from '@/components/PostShareButtons'

const formatPostDate = (timestamp: string): string =>
  new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, populatedAuthors, publishedAt, title, heroImage, content, slug } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''
  const hasHeroImage = heroImage && typeof heroImage === 'object'
  const readingTime = estimateReadingTime(content)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
        <div className="flex flex-wrap items-center gap-4">
          {slug && <PostShareButtons slug={slug} title={title || ''} />}
          {publishedAt && (
            <time dateTime={publishedAt} className="text-sm text-gray-500">
              {formatPostDate(publishedAt)}
            </time>
          )}
        </div>

        <Link
          href="/posts"
          className="group inline-flex flex-none items-center gap-2 rounded-full bg-primary_red px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-secondary_red"
        >
          Back
          <CornerUpLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </Link>
      </div>

      <div className="border-t border-border" />

      <div className="pt-6 pb-8">
        {categories && categories.length > 0 && (
          <div className="uppercase text-sm mb-4 font-semibold tracking-wide text-primary_red">
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

        <h1 className="mb-5 text-3xl font-bold leading-tight text-foreground md:text-4xl">{title}</h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
          {hasAuthors && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              by {formatAuthors(populatedAuthors)}
            </span>
          )}
          {readingTime > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readingTime} min read
            </span>
          )}
        </div>
      </div>

      {hasHeroImage && (
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
          <Media
            resource={heroImage}
            fill
            priority
            imgClassName="object-cover"
            pictureClassName="absolute inset-0"
            className="absolute inset-0"
          />
        </div>
      )}
    </div>
  )
}
