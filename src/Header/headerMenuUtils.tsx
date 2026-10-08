import React from 'react'
import type { NavigationPageData } from './types'

export const getServiceLink = (page: NavigationPageData): string => {
  if (!page.slug) return '#'

  if (page.serviceCategory && page.serviceCategory !== 'none') {
    return `/service/${page.slug}`
  }

  return `/${page.slug}`
}

export const highlightMatch = (text: string, query: string, light = false) => {
  if (!query.trim()) return text
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className={light ? 'rounded bg-primary_red/15 text-primary_red' : 'rounded bg-white/25 text-white'}>
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  )
}
