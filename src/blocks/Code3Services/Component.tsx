import React from 'react'
import type { Code3ServicesBlock as Code3ServicesBlockProps } from '@/payload-types'
import { ServicesExplorer } from '@/components/code3-home/ServicesExplorer'

export const Code3ServicesBlock: React.FC<Code3ServicesBlockProps> = ({
  eyebrow,
  title,
  description,
  categories,
}) => {
  return (
    <ServicesExplorer
      eyebrow={eyebrow || undefined}
      title={title}
      description={description || undefined}
      categories={
        categories?.map((cat) => ({
          label: cat.label,
          icon: cat.icon,
          services: (cat.services || []).map((s) => ({
            title: s.title,
            description: s.description,
          })),
        })) || undefined
      }
    />
  )
}
