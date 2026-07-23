import React from 'react'
import type { Code3AboutTeaserBlock as Code3AboutTeaserBlockProps } from '@/payload-types'
import { AboutTeaser } from '@/components/code3-home/AboutTeaser'

export const Code3AboutTeaserBlock: React.FC<Code3AboutTeaserBlockProps> = ({
  eyebrow,
  heading,
  body,
  links,
}) => {
  const linkItem = links?.[0]?.link
  const reference = linkItem?.reference
  const href =
    linkItem?.type === 'reference' && typeof reference?.value === 'object' && reference.value?.slug
      ? `${reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''}/${reference.value.slug}`
      : linkItem?.url

  return (
    <AboutTeaser
      eyebrow={eyebrow || undefined}
      heading={heading}
      body={body}
      linkHref={href || undefined}
      linkLabel={linkItem?.label || undefined}
    />
  )
}
