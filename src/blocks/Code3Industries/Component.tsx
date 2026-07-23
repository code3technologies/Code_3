import React from 'react'
import type { Code3IndustriesBlock as Code3IndustriesBlockProps } from '@/payload-types'
import { Industries } from '@/components/code3-home/Industries'

export const Code3IndustriesBlock: React.FC<Code3IndustriesBlockProps> = ({
  eyebrow,
  title,
  industries,
}) => {
  return (
    <Industries
      eyebrow={eyebrow || undefined}
      title={title}
      industries={
        industries?.map((i) => ({ title: i.title, iconPreset: i.iconPreset })) || undefined
      }
    />
  )
}
