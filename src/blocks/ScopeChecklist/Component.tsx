import type { ScopeChecklistBlock as ScopeChecklistBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  Activity,
  FileText,
  HardDrive,
  Headset,
  Lightbulb,
  RotateCw,
  ShieldCheck,
  Ticket,
  Wifi,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

type Props = {
  className?: string
} & ScopeChecklistBlockProps

function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={cn('flex-none', className)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

// Best-effort icon per item, matched by keyword — keeps the Monthly Cadence
// layout sensible for any future item list, not just AMC's 9.
function getMonthlyItemIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('maintenance')) return Wrench
  if (t.includes('health')) return Activity
  if (t.includes('network')) return Wifi
  if (t.includes('security')) return ShieldCheck
  if (t.includes('backup')) return HardDrive
  if (t.includes('support')) return Headset
  if (t.includes('ticket')) return Ticket
  if (t.includes('report')) return FileText
  if (t.includes('recommend') || t.includes('improvement')) return Lightbulb
  return CheckIcon as unknown as LucideIcon
}

function ChecklistGrid({ badge, title, subtitle, items, note, ctaText, ctaLabel, ctaUrl }: ScopeChecklistBlockProps) {
  const safeItems = items || []
  const hasDescriptions = safeItems.some((item) => item.description)

  return (
    <>
      <Reveal className="max-w-2xl mb-6">
        {badge && <Eyebrow>{badge}</Eyebrow>}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
      </Reveal>

      <Reveal
        delayMs={100}
        className={cn(
          'grid gap-3 md:gap-4',
          hasDescriptions ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        )}
      >
        {safeItems.map((item, index) => {
          const cardClassName = cn(
            'rounded-xl border border-border bg-gray-50/60 transition-colors',
            hasDescriptions
              ? 'flex flex-col gap-3 p-5 text-left hover:border-primary_red/40 hover:bg-[#FDEBEC]/40'
              : 'flex items-center gap-2.5 px-4 py-3 hover:border-primary_red/40 hover:bg-[#FDEBEC]/40',
          )
          const content = (
            <>
              <span
                className={cn(
                  'flex flex-none items-center justify-center rounded-full bg-[#FDEBEC] text-primary_red',
                  hasDescriptions ? 'h-10 w-10' : 'h-7 w-7',
                )}
              >
                <CheckIcon />
              </span>
              <span className={cn(hasDescriptions ? 'text-base font-semibold text-foreground' : 'text-sm font-medium text-foreground')}>
                {item.text}
              </span>
              {hasDescriptions && item.description && (
                <span className="text-sm leading-relaxed text-gray-600">{item.description}</span>
              )}
            </>
          )

          if (item.url) {
            return (
              <Link key={item.id || index} href={item.url} className={cardClassName}>
                {content}
              </Link>
            )
          }

          return (
            <div key={item.id || index} className={cardClassName}>
              {content}
            </div>
          )
        })}
      </Reveal>

      {note && <p className="mt-5 text-sm text-gray-500">{note}</p>}

      {ctaLabel && ctaUrl && (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          {ctaText && <p className="text-sm font-medium text-gray-600">{ctaText}</p>}
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-2 rounded-full bg-primary_red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </>
  )
}

// A dense, wrapped cloud of pill chips — for a broad illustrative list of
// examples ("a system can include: ...") that shouldn't compete visually
// with a fuller card-grid section elsewhere on the same page.
function TagCloud({ badge, title, subtitle, items, note }: ScopeChecklistBlockProps) {
  const safeItems = items || []

  return (
    <>
      <Reveal className="mx-auto mb-7 max-w-2xl text-center">
        {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
      </Reveal>

      <Reveal delayMs={100} className="rounded-3xl border border-border bg-gray-50/60 p-6 md:p-10">
        <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
          {safeItems.map((item, index) => {
            const chipClassName = cn(
              'inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors',
              item.url && 'hover:border-primary_red/40 hover:text-primary_red hover:bg-[#FDEBEC]/40',
            )
            const content = (
              <>
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#FDEBEC] text-primary_red">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {item.text}
              </>
            )

            if (item.url) {
              return (
                <Link key={item.id || index} href={item.url} className={chipClassName}>
                  {content}
                </Link>
              )
            }

            return (
              <span key={item.id || index} className={chipClassName}>
                {content}
              </span>
            )
          })}
        </div>
      </Reveal>

      {note && <p className="mt-5 text-center text-sm text-gray-500">{note}</p>}
    </>
  )
}

function MonthlyCadence({ badge, title, subtitle, items, note }: ScopeChecklistBlockProps) {
  return (
    <Reveal className="overflow-hidden rounded-3xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_24px_50px_-24px_rgba(0,0,0,0.18)]">
      <div className="grid md:grid-cols-[300px_1fr]">
        <div className="relative flex flex-col justify-center gap-4 overflow-hidden bg-gradient-to-br from-[#1c1113] via-[#3a0f14] to-primary_red px-7 py-10 md:px-8">
          <RotateCw className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 text-white/[0.06]" strokeWidth={1.5} />
          {badge && <Eyebrow className="text-white/70">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-[26px] font-semibold leading-tight text-white text-balance">{title}</h2>
          {subtitle && <p className="text-sm leading-relaxed text-white/70">{subtitle}</p>}
          {note && (
            <div className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white">
              <RotateCw className="h-3.5 w-3.5 flex-none" />
              {note}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3">
          {(items || []).map((item, index) => {
            const Icon = getMonthlyItemIcon(item.text)
            const col = index % 3
            const row = Math.floor(index / 3)
            const isLastMobile = index === (items?.length ?? 0) - 1
            return (
              <div
                key={item.id || index}
                className={cn(
                  'flex items-center gap-3 border-border px-6 py-5 transition-colors hover:bg-gray-50/80',
                  !isLastMobile && 'border-b sm:border-b-0',
                  col > 0 && 'sm:border-l',
                  row > 0 && 'sm:border-t',
                )}
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#FDEBEC] text-primary_red">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Reveal>
  )
}

export const ScopeChecklistBlock: React.FC<Props> = (props) => {
  const { className, items = [], layoutStyle } = props
  if (!items || items.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        {layoutStyle === 'monthly' ? (
          <MonthlyCadence {...props} />
        ) : layoutStyle === 'tags' ? (
          <TagCloud {...props} />
        ) : (
          <ChecklistGrid {...props} />
        )}
      </div>
    </section>
  )
}
