import React from 'react'
import type { Code3CTABannerBlock as Code3CTABannerBlockProps } from '@/payload-types'
import { CTABanner } from '@/components/code3-home/CTABanner'

export const Code3CTABannerBlock: React.FC<Code3CTABannerBlockProps> = ({
  title,
  buttonLabel,
  buttonHref,
}) => {
  return (
    <CTABanner
      title={title}
      buttonLabel={buttonLabel || undefined}
      buttonHref={buttonHref || undefined}
    />
  )
}
