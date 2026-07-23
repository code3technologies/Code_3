import React from 'react'
import type { Code3TestimonialsBlock as Code3TestimonialsBlockProps } from '@/payload-types'
import { Testimonials } from '@/components/code3-home/Testimonials'

export const Code3TestimonialsBlock: React.FC<Code3TestimonialsBlockProps> = async ({
  eyebrow,
  title,
  useGoogleReviews,
  fallbackQuotes,
}) => {
  return (
    <Testimonials
      eyebrow={eyebrow || undefined}
      title={title}
      useGoogleReviews={useGoogleReviews ?? true}
      fallbackQuotes={fallbackQuotes?.map((q) => ({ quote: q.quote, name: q.name, role: q.role })) || undefined}
    />
  )
}
