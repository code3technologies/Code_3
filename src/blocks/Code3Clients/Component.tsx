import React from 'react'
import type { Code3ClientsBlock as Code3ClientsBlockProps } from '@/payload-types'
import { Clients } from '@/components/code3-home/Clients'

export const Code3ClientsBlock: React.FC<Code3ClientsBlockProps> = ({
  eyebrow,
  title,
  description,
  clients,
}) => {
  return (
    <Clients
      eyebrow={eyebrow || undefined}
      title={title}
      description={description || undefined}
      clients={
        clients?.map((c) => ({
          name: c.name,
          logoUrl: typeof c.logo === 'object' && c.logo?.url ? c.logo.url : undefined,
        })) || undefined
      }
    />
  )
}
