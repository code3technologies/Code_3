import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Category, Post, Code3BlogPreviewBlock as Code3BlogPreviewBlockProps } from '@/payload-types'
import { BlogPreview } from '@/components/code3-home/BlogPreview'

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]

function formatDate(dateStr?: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export const Code3BlogPreviewBlock: React.FC<Code3BlogPreviewBlockProps> = async ({
  eyebrow,
  title,
  limit,
  categories,
}) => {
  const payload = await getPayload({ config: configPromise })

  const flattenedCategories = categories?.map((c) => (typeof c === 'object' ? c.id : c))

  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: limit || 4,
    sort: '-publishedAt',
    ...(flattenedCategories && flattenedCategories.length > 0
      ? { where: { categories: { in: flattenedCategories } } }
      : {}),
  })

  const mapped = posts.map((post: Post) => {
    const firstCategory = post.categories?.[0]
    return {
      category:
        typeof firstCategory === 'object' && firstCategory
          ? (firstCategory as Category).title.toUpperCase()
          : 'INSIGHT',
      date: formatDate(post.publishedAt),
      title: post.title,
      excerpt: post.meta?.description || '',
      href: post.slug ? `/posts/${post.slug}` : undefined,
      imageUrl:
        typeof post.heroImage === 'object' && post.heroImage?.url ? post.heroImage.url : undefined,
    }
  })

  return (
    <BlogPreview eyebrow={eyebrow || undefined} title={title} posts={mapped.length > 0 ? mapped : undefined} />
  )
}
