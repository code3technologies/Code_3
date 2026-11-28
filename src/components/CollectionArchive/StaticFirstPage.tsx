import React from 'react'

import { Card, CardPostData } from '@/components/Card'

// Server-rendered stand-in for CollectionArchive while it hydrates. The
// archive reads ?page= with useSearchParams, so on a cached page Next renders
// only its Suspense fallback into the HTML. A "Loading posts..." fallback meant
// crawlers saw no posts and no links on the blog index; this shows the same
// first 9 cards, so the HTML has real titles and links and nothing jumps when
// the interactive version takes over.
export const StaticFirstPage: React.FC<{ posts: CardPostData[] }> = ({ posts }) => (
  <div className="container">
    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
      {posts.slice(0, 9).map((post, index) => (
        <div className="col-span-4" key={post.id || index}>
          <Card className="h-full" doc={post} relationTo="posts" showCategories />
        </div>
      ))}
    </div>
  </div>
)
