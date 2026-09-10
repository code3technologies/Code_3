import type { CategorizedIntegrationsBlock as CategorizedIntegrationsBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & CategorizedIntegrationsBlockProps

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3 flex-none">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export const CategorizedIntegrationsBlock: React.FC<Props> = ({
  badge,
  className,
  title,
  subtitle,
  groups = [],
  checklistStyle,
}) => {
  if (!groups || groups.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-6">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal
          delayMs={100}
          className={cn(
            'grid grid-cols-1 gap-6',
            groups.length === 2 && 'sm:grid-cols-2',
            groups.length === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
            groups.length >= 4 && 'sm:grid-cols-2 lg:grid-cols-4',
          )}
        >
          {groups.map((group, index) => (
            <div key={group.id || index} className="rounded-2xl border border-border p-5">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary_red">{group.heading}</div>
              <ul className="space-y-2">
                {(group.items || []).map((item, itemIndex) => (
                  <li key={item.id || itemIndex} className="flex items-center gap-2.5 text-sm text-gray-700">
                    {checklistStyle ? (
                      <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-[#FDEBEC] text-primary_red">
                        <CheckIcon />
                      </span>
                    ) : (
                      <span className="h-1.5 w-1.5 flex-none rounded-full bg-primary_red" />
                    )}
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
