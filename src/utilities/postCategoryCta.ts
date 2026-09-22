import type { Category } from '@/payload-types'

export type PostCta = {
  label: string
  href: string
  trailingText: string
}

const DEFAULT_CTA: PostCta = {
  label: 'Talk to an IT Expert',
  href: '/contact',
  trailingText: 'and get expert guidance on the right solution for your business.',
}

// Keyed by category title (not slug) since that's what's readily available
// wherever a post's populated `categories` relationship is in hand.
const CTA_BY_CATEGORY: Record<string, PostCta> = {
  'Managed IT': {
    label: 'Book an IT Assessment',
    href: '/service/infrastructure-assessment-dubai-uae',
    trailingText: 'to see where your current IT support setup can improve.',
  },
  Cybersecurity: {
    label: 'Request a Security Assessment',
    href: '/service/security-assessment-dubai-uae',
    trailingText: 'to understand your current security posture.',
  },
  Cloud: {
    label: 'Discuss Your Cloud Environment',
    href: '/service/cloud-readiness-assessment-dubai-uae',
    trailingText: 'and plan the right cloud approach for your business.',
  },
  'Network & Infrastructure': {
    label: 'Request a Network Assessment',
    href: '/service/infrastructure-assessment-dubai-uae',
    trailingText: 'to see how your network and infrastructure measure up.',
  },
  'AV & UC': {
    label: 'Plan Your AV Solution',
    href: '/service/av-design-services-dubai-uae',
    trailingText: 'and design the right audiovisual setup for your space.',
  },
}

// Picks the CTA for a post's first populated category, falling back to a
// generic default when categories are unpopulated (ids only) or unmapped
// (e.g. the generic "Business Technology" bucket).
export function getPostCta(categories: (string | Category)[] | null | undefined): PostCta {
  const first = categories?.find((c): c is Category => typeof c === 'object' && c !== null)
  if (first?.title && CTA_BY_CATEGORY[first.title]) {
    return CTA_BY_CATEGORY[first.title]
  }
  return DEFAULT_CTA
}
