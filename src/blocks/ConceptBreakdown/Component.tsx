import type { ConceptBreakdownBlock as ConceptBreakdownBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

type Props = {
  className?: string
} & ConceptBreakdownBlockProps

const toParagraphs = (text?: string | null) =>
  (text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

// An editorial two-column explainer: a sticky left column holds the
// definition and an optional "how we approach it" aside, while the right
// column is a plain hairline-divided reference list — deliberately not a
// card grid, so a "what is X?" section reads like an article.
export const ConceptBreakdownBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  intro,
  asideLabel,
  asideText,
  items = [],
  note,
}) => {
  const safeItems = items || []
  if (safeItems.length === 0) return null

  const introParas = toParagraphs(intro)
  const asideParas = toParagraphs(asideText)

  return (
    <section className={cn('bg-white py-12 md:py-16', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,360px)_1fr] xl:gap-x-16">
          {/* Left: sticky intro */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            {badge && <Eyebrow>{badge}</Eyebrow>}
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl text-balance">
              {title}
            </h2>
            {introParas.length > 0 && (
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600 md:text-[15px]">
                {introParas.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {asideParas.length > 0 && (
              <div className="mt-6 rounded-r-lg border-l-[3px] border-primary_red bg-[#FDEBEC]/60 py-4 pl-4 pr-5">
                {asideLabel && (
                  <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary_red">
                    {asideLabel}
                  </div>
                )}
                <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                  {asideParas.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}
          </Reveal>

          {/* Right: hairline reference list */}
          <Reveal delayMs={100} className="lg:pt-1">
            <dl className="border-t-2 border-primary_red/50">
              {safeItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="group -mx-3 grid gap-x-6 rounded-lg border-b border-border px-3 py-5 transition-colors hover:bg-[#FDEBEC]/40 sm:grid-cols-[minmax(0,210px)_1fr] sm:py-6"
                >
                  <dt className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-semibold text-primary_red">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary_red">
                      {item.term}
                    </span>
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-gray-600 sm:mt-0">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>

            {note && (
              <p className="mt-5 border-l-2 border-primary_red/40 pl-3 text-sm text-gray-500">{note}</p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
