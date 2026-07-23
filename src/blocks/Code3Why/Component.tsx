import React from 'react'
import type { Code3WhyBlock as Code3WhyBlockProps } from '@/payload-types'
import { Why } from '@/components/code3-home/Why'

export const Code3WhyBlock: React.FC<Code3WhyBlockProps> = ({
  eyebrow,
  title,
  description,
  cards,
}) => {
  return (
    <Why
      eyebrow={eyebrow || undefined}
      title={title}
      description={description || undefined}
      cards={
        cards?.map((c) => ({ idx: c.indexLabel, title: c.title, body: c.body })) || undefined
      }
    />
  )
}
