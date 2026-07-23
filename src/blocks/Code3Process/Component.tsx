import React from 'react'
import type { Code3ProcessBlock as Code3ProcessBlockProps } from '@/payload-types'
import { Process } from '@/components/code3-home/Process'

export const Code3ProcessBlock: React.FC<Code3ProcessBlockProps> = ({
  eyebrow,
  title,
  description,
  steps,
}) => {
  return (
    <Process
      eyebrow={eyebrow || undefined}
      title={title}
      description={description || undefined}
      steps={steps?.map((s) => ({ num: s.stepLabel, title: s.title, body: s.body })) || undefined}
    />
  )
}
