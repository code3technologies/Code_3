import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import React, { Suspense } from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import { StaticFirstPage } from '@/components/CollectionArchive/StaticFirstPage'

const fetchArchivePosts = async (categoryIds: string[], limit: number) => {
  const payload = await getPayload({ config: configPromise })

  const fetchedPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    ...(categoryIds.length > 0
      ? {
          where: {
            categories: {
              in: categoryIds,
            },
          },
        }
      : {}),
  })

  return fetchedPosts.docs
}

const getCachedArchivePosts = (categoryIds: string[], limit: number) =>
  unstable_cache(
    () => fetchArchivePosts(categoryIds, limit),
    ['archive-block', categoryIds.join(','), String(limit)],
    { tags: ['posts-sitemap'] },
  )()

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const flattenedCategories = (categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    }) || []) as string[]

    posts = await getCachedArchivePosts(flattenedCategories, limit)
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as Post[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <Suspense fallback={<StaticFirstPage posts={posts} />}>
        <CollectionArchive posts={posts} />
      </Suspense>
    </div>
  )
}
