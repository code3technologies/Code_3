import React from 'react'
import type { Code3StatsBlock as Code3StatsBlockProps } from '@/payload-types'
import { Stats } from '@/components/code3-home/Stats'

export const Code3StatsBlock: React.FC<Code3StatsBlockProps> = ({ stats }) => {
  return (
    <Stats
      stats={
        stats?.map((s) => ({ value: s.value, suffix: s.suffix || '', label: s.label })) ||
        undefined
      }
    />
  )
}
