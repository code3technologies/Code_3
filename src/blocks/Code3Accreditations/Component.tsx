import React from 'react'
import type { Code3AccreditationsBlock as Code3AccreditationsBlockProps } from '@/payload-types'
import { Accreditations } from '@/components/code3-home/Accreditations'

export const Code3AccreditationsBlock: React.FC<Code3AccreditationsBlockProps> = ({
  eyebrow,
  partners,
}) => {
  return (
    <Accreditations
      eyebrow={eyebrow || undefined}
      partners={
        partners?.map((p) => ({
          name: p.name,
          logoUrl: typeof p.logo === 'object' && p.logo?.url ? p.logo.url : undefined,
        })) || undefined
      }
    />
  )
}
