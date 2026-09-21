'use client'

import { useState } from 'react'
import { cn } from '@/utilities/ui'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { CtaButton } from '@/components/site/CtaButton'
import type { AccordionSectionBlock as AccordionSectionBlockProps } from 'src/payload-types'

type DetailItem = NonNullable<AccordionSectionBlockProps['items']>[number]['detailItems']

function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={cn('flex-none', className)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span className="relative h-4 w-4 flex-none text-gray-400">
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
      <span
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300"
        style={{ transform: isOpen ? 'scaleY(0)' : 'scaleY(1)' }}
      />
    </span>
  )
}

function AccordionItem({
  item,
  isOpen,
  onClick,
}: {
  item: NonNullable<AccordionSectionBlockProps['items']>[number]
  isOpen: boolean
  onClick: () => void
}) {
  const detailItems: DetailItem = item.detailItems

  return (
    <div className="rounded-xl border border-border bg-gray-50/60 transition-colors">
      <button
        onClick={onClick}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <span className="text-base font-semibold text-foreground">{item.title}</span>
          {item.summary && <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.summary}</p>}
        </div>
        <span className="mt-1">
          <ChevronIcon isOpen={isOpen} />
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          {item.detailSubtitle && <p className="mb-4 text-sm leading-relaxed text-gray-600">{item.detailSubtitle}</p>}

          {detailItems && detailItems.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {detailItems.map((detail, index) => (
                <div
                  key={detail.id || index}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-white px-3.5 py-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#FDEBEC] text-primary_red">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  <div>
                    <span className="text-sm font-medium text-foreground">{detail.text}</span>
                    {detail.description && (
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{detail.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {item.note && <p className="mt-4 text-sm text-gray-500">{item.note}</p>}
        </div>
      )}
    </div>
  )
}

export const AccordionSectionBlock: React.FC<AccordionSectionBlockProps> = ({
  badge,
  title,
  subtitle,
  items = [],
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const [openIndex, setOpenIndex] = useState<number>(-1)
  const safeItems = items || []

  if (safeItems.length === 0) return null

  return (
    <section className="bg-white py-7 md:py-9">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-6">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal delayMs={100} className="flex flex-col gap-3">
          {safeItems.map((item, index) => (
            <AccordionItem
              key={item.id || index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </Reveal>

        <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-8" />
      </div>
    </section>
  )
}
