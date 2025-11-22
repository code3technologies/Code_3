import type { Page } from '@/payload-types'

export const getPagePath = (page: Page | string): string => {
  if (typeof page === 'string') {
    return `/${page}`
  }
  
  if (page.serviceCategory && page.serviceCategory !== 'none') {
    return `/service/${page.slug}`
  }
  
  return `/${page.slug}`
}
