'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import type { Media as MediaType } from 'src/payload-types'

export type BlogScrollPost = {
  slug: string | null | undefined
  title: string
  heroImage?: (string | null) | MediaType
  description?: string | null
  publishedAt?: string | null
}

export function PostCard({ post }: { post: BlogScrollPost }) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasImage = !!post.heroImage && typeof post.heroImage !== 'string' && !imageFailed

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex-none snap-start w-[280px] sm:w-[320px]"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-gray-50">
        {hasImage ? (
          <Media
            resource={post.heroImage!}
            alt={post.title}
            fill
            size="320px"
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary_red/10 to-gray-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary_red/60">
              CODE3
            </span>
          </div>
        )}
      </div>
      {formattedDate && (
        <span className="mt-4 block text-xs font-medium uppercase tracking-wide text-gray-500">
          {formattedDate}
        </span>
      )}
      <h3 className="mt-2 line-clamp-2 text-base font-semibold text-foreground transition-colors duration-200 group-hover:text-primary_red">
        {post.title}
      </h3>
      {post.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {post.description}
        </p>
      )}
    </Link>
  )
}
