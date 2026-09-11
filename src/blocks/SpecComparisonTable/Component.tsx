import type { SpecComparisonTableBlock as SpecComparisonTableBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { ArrowRight, CheckCircle2, CircleDashed, Sparkles, XCircle } from 'lucide-react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

// "Yes" / "No" / "Limited" get a proper semantic icon instead of the plain
// dot + text used for free-text spec values (e.g. "Infrared").
function ValueDisplay({ text }: { text?: string | null }) {
  const t = (text || '').trim().toLowerCase()
  if (t === 'yes' || t === '✅') {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-green-700">
        <CheckCircle2 className="h-4 w-4 flex-none" />
        Yes
      </span>
    )
  }
  if (t === 'no' || t === '❌') {
    return (
      <span className="inline-flex items-center gap-1.5 text-gray-400">
        <XCircle className="h-4 w-4 flex-none" />
        No
      </span>
    )
  }
  if (t === 'limited') {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-amber-600">
        <CircleDashed className="h-4 w-4 flex-none" />
        Limited
      </span>
    )
  }
  return (
    <>
      <span className="mr-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary_red align-middle" />
      {text}
    </>
  )
}

type Props = {
  className?: string
} & SpecComparisonTableBlockProps

export const SpecComparisonTableBlock: React.FC<Props> = ({
  badge,
  className,
  title,
  subtitle,
  columns = [],
  footer,
  footerCtaLabel,
  footerCtaUrl,
  rows = [],
}) => {
  if (!columns || columns.length === 0 || !rows || rows.length === 0) return null

  // Dynamic column count (2-4) can't be expressed as a static Tailwind class, since
  // Tailwind only picks up class strings it can find verbatim at build time.
  const gridStyle = { gridTemplateColumns: `1fr repeat(${columns.length}, 1fr)` }

  const valueCellClass = (index: number, isLastRow: boolean) =>
    cn(
      'group/cell relative border-t border-primary_red/15 bg-primary_red/[0.05] px-5 py-4 text-sm font-medium text-gray-800 ring-1 ring-inset ring-primary_red/20 transition-colors',
      isLastRow && 'rounded-b-2xl pb-5',
    )

  return (
    <section className={cn('relative bg-white py-7 md:py-9', className)}>
      <div className="container relative mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-8">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal delayMs={100}>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_20px_45px_-20px_rgba(0,0,0,0.18)] md:block">
            <div className="overflow-x-auto">
              <div className="grid min-w-[640px]" style={gridStyle}>
                <div className="bg-gradient-to-br from-primary_red to-red-700 px-5 py-4" />
                {columns.map((col, index) => (
                  <div key={col.id || index} className="relative bg-gradient-to-br from-primary_red to-red-700 px-5 pt-5 pb-4 text-white">
                    <div className="mb-2 text-sm font-bold uppercase tracking-wide text-white">{col.label}</div>
                    {col.highlight && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary_red shadow-sm">
                        <Sparkles className="h-3 w-3" />
                        {col.highlightLabel || 'Most Popular'}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {rows.map((row, rIndex) => {
                const isLastRow = rIndex === rows.length - 1
                return (
                  <div
                    key={row.id || rIndex}
                    className={cn('grid min-w-[640px] items-stretch', rIndex % 2 === 1 && 'bg-gray-50/50')}
                    style={gridStyle}
                  >
                    <div
                      className={cn(
                        'flex items-center border-t border-primary_red/15 bg-primary_red/[0.05] px-5 py-4 text-sm font-semibold text-foreground ring-1 ring-inset ring-primary_red/20',
                        isLastRow && 'rounded-bl-2xl pb-5',
                      )}
                    >
                      {row.rowLabel}
                    </div>
                    {columns.map((col, cIndex) => (
                      <div key={row.values?.[cIndex]?.id || cIndex} className={valueCellClass(cIndex, isLastRow)}>
                        <ValueDisplay text={row.values?.[cIndex]?.text} />
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile cards - one per column */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {columns.map((col, cIndex) => (
              <div
                key={col.id || cIndex}
                className="overflow-hidden rounded-2xl border border-primary_red/30 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.25)] ring-1 ring-primary_red/25"
              >
                <div className="flex items-center justify-between bg-gradient-to-r from-primary_red to-red-700 px-4 py-3">
                  <div className="text-sm font-bold uppercase tracking-wide text-white">{col.label}</div>
                  {col.highlight && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary_red shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      {col.highlightLabel || 'Most Popular'}
                    </span>
                  )}
                </div>
                <dl className="space-y-2.5 bg-primary_red/[0.03] p-4">
                  {rows.map((row, rIndex) => (
                    <div key={row.id || rIndex} className={cn(rIndex !== 0 && 'border-t border-border/70 pt-2.5')}>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{row.rowLabel}</dt>
                      <dd className="mt-0.5 flex items-center text-sm text-gray-700">
                        <ValueDisplay text={row.values?.[cIndex]?.text} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Reveal>

        {footer && (
          <Reveal
            delayMs={150}
            className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-primary_red/15 bg-primary_red/[0.04] px-6 py-4 text-center sm:flex-row sm:justify-between sm:text-left"
          >
            <p className="text-sm font-medium text-foreground whitespace-pre-line">{footer}</p>
            {footerCtaLabel && footerCtaUrl && (
              <Link
                href={footerCtaUrl}
                className="group inline-flex flex-none items-center gap-2 rounded-full bg-primary_red px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.03] hover:bg-secondary_red"
              >
                {footerCtaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
