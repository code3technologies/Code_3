import React from 'react'
import type { HeadingItem } from '@/utilities/extractHeadings'

export const PostTableOfContents: React.FC<{ headings: HeadingItem[] }> = ({ headings }) => {
  if (!headings || headings.length < 2) return null

  return (
    <nav
      aria-label="Table of contents"
      className="not-prose mb-10 rounded-2xl border border-border bg-gray-50/60 px-6 py-5 md:px-7 md:py-6"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary_red">In This Article</p>
      <ol className="space-y-2.5">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'ml-4' : undefined}>
            <a
              href={`#${heading.id}`}
              className="text-sm leading-snug text-gray-700 transition-colors hover:text-primary_red"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
