import React from 'react'
import { ChevronRight } from 'lucide-react'
import type { HeadingItem } from '@/utilities/extractHeadings'

export const PostTableOfContents: React.FC<{ headings: HeadingItem[] }> = ({ headings }) => {
  if (!headings || headings.length < 2) return null

  return (
    <nav aria-label="Table of contents" className="not-prose mb-10">
      <p className="mb-3 text-base font-bold text-foreground">Table of Contents</p>
      <ol className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'ml-4' : undefined}>
            <a
              href={`#${heading.id}`}
              className="group flex items-start gap-1.5 text-sm leading-snug text-primary_red transition-colors hover:text-secondary_red hover:underline"
            >
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 flex-none" />
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
