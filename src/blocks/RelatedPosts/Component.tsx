import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'
import { Media } from '@/components/Media'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
  title?: React.ReactNode
  layout?: 'grid' | 'sidebar'
}

// Compact thumbnail + title, no description/author/date footer - for the
// sticky sidebar next to the article rather than the full grid used at the
// bottom of the listing/archive pages.
const SidebarCard: React.FC<{ doc: Post }> = ({ doc }) => {
  const { slug, title, heroImage, meta } = doc
  const image = heroImage && typeof heroImage === 'object' ? heroImage : meta?.image && typeof meta.image === 'object' ? meta.image : null

  return (
    <Link href={`/posts/${slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-gray-100">
        {image ? (
          <Media resource={image} fill imgClassName="object-cover transition-transform duration-300 group-hover:scale-105" pictureClassName="absolute inset-0" className="absolute inset-0" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No image</div>
        )}
      </div>
      <h3 className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary_red">
        {title}
      </h3>
    </Link>
  )
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent, title, layout = 'grid' } = props
  const safeDocs = (docs || []).filter((doc): doc is Post => typeof doc === 'object' && doc !== null)

  if (layout === 'sidebar') {
    return (
      <div className={className}>
        {title && <h2 className="mb-5 text-xl font-semibold tracking-tight text-foreground">{title}</h2>}
        <div className="space-y-6">
          {safeDocs.map((doc, index) => (
            <SidebarCard key={doc.id || index} doc={doc} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('lg:container', className)}>
      {title && <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>}
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 items-stretch">
        {safeDocs.map((doc, index) => (
          <Card key={doc.id || index} doc={doc} relationTo="posts" showCategories />
        ))}
      </div>
    </div>
  )
}
