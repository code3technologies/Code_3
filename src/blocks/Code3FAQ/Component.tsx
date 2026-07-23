import React from 'react'
import type { Code3FAQBlock as Code3FAQBlockProps } from '@/payload-types'
import { FAQ } from '@/components/code3-home/FAQ'

export const Code3FAQBlock: React.FC<Code3FAQBlockProps> = ({
  eyebrow,
  title,
  description,
  faqs,
}) => {
  return (
    <FAQ
      eyebrow={eyebrow || undefined}
      title={title}
      description={description || undefined}
      faqs={faqs?.map((f) => ({ q: f.question, a: f.answer })) || undefined}
    />
  )
}
