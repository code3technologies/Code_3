import Link from 'next/link'
import React from 'react'
import { getServerSideURL } from '@/utilities/getURL'

export type BreadcrumbItem = {
  name: string
  // Omit for the current page (last item), which is shown as plain text.
  href?: string
}

// Visible trail plus matching schema.org BreadcrumbList, so the hierarchy
// (Home > category > service) is stated explicitly to visitors and to Google.
export const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  const siteUrl = getServerSideURL().replace(/\/+$/, '')

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  }

  return (
    <nav aria-label="Breadcrumb" className="border-b border-border bg-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="container mx-auto flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2 text-xs text-gray-500 sm:px-6">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-primary_red">
                  {item.name}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-medium text-foreground' : undefined}>
                  {item.name}
                </span>
              )}
              {!isLast && (
                <span aria-hidden className="text-gray-300">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
