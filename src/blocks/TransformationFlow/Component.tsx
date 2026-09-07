import type { TransformationFlowBlock as TransformationFlowBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowRight,
  Camera,
  ChevronsDown,
  Cloud,
  Hand,
  Laptop,
  MonitorPlay,
  Network,
  PenLine,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Wifi,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per capability step, matched by keyword.
function getCapabilityIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('cyber')) return ShieldCheck
  // Word-boundary match: bare `includes('it')` would false-positive on
  // "wait", "quit", "unit", etc.
  if (/\bit\b/.test(t)) return Laptop
  if (t.includes('network')) return Network
  if (t.includes('cloud')) return Cloud
  if (/\bav\b/.test(t)) return Video
  if (t.includes('security')) return Camera
  if (t.includes('touch')) return Hand
  if (t.includes('wireless')) return Wifi
  if (t.includes('annotate')) return PenLine
  if (t.includes('collaborate')) return Users
  if (t.includes('video')) return Video
  return MonitorPlay
}

type Props = {
  className?: string
} & TransformationFlowBlockProps

export const TransformationFlowBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  beforeLabel,
  beforeSteps = [],
  hubLabel,
  capabilitySteps = [],
  outcomeLabel,
  outcomeText,
  ctaLabel,
  ctaUrl,
}) => {
  const safeBefore = beforeSteps || []
  const safeCapabilities = capabilitySteps || []
  if (safeBefore.length === 0 || safeCapabilities.length === 0) return null

  return (
    <section className={cn('bg-white py-10 md:py-14', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal delayMs={100} className="mx-auto flex max-w-3xl flex-col items-center gap-5">
          {/* Before — the old, faceless way */}
          <div className="flex w-full flex-col items-center gap-3">
            <span className="inline-flex w-fit items-center rounded-full bg-gray-200/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {beforeLabel}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {safeBefore.map((step, i) => (
                <React.Fragment key={step.id || i}>
                  <span className="rounded-lg border border-dashed border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-500">
                    {step.text}
                  </span>
                  {i < safeBefore.length - 1 && <ArrowRight className="h-4 w-4 flex-none text-gray-300" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <ChevronsDown className="h-7 w-7 flex-none text-gray-300" strokeWidth={2.5} />

          {/* Hub + what it enables — branded */}
          <div className="flex w-full flex-col items-center gap-3">
            {hubLabel && (
              <div className="inline-flex items-center gap-2.5 rounded-2xl bg-primary_red px-6 py-3 shadow-[0_16px_32px_-16px_rgba(201,14,29,0.55)]">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/15 text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold uppercase tracking-wide text-white md:text-base">{hubLabel}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {safeCapabilities.map((step, i) => {
                const Icon = getCapabilityIcon(step.text)
                return (
                  <React.Fragment key={step.id || i}>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary_red/20 bg-[#FDEBEC] px-3.5 py-2 text-sm font-semibold text-foreground">
                      <Icon className="h-3.5 w-3.5 flex-none text-primary_red" />
                      {step.text}
                    </span>
                    {i < safeCapabilities.length - 1 && (
                      <ArrowRight className="h-4 w-4 flex-none text-primary_red/50" />
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <ChevronsDown className="h-7 w-7 flex-none text-gray-300" strokeWidth={2.5} />

          {/* After — the payoff */}
          <div className="flex w-full flex-col items-center gap-2 text-center">
            {outcomeLabel && (
              <span className="inline-flex w-fit items-center rounded-full bg-primary_red/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary_red">
                {outcomeLabel}
              </span>
            )}
            <p className="max-w-xl text-xl font-bold tracking-tight text-foreground text-balance md:text-2xl">
              {outcomeText}
            </p>
          </div>
        </Reveal>

        {ctaLabel && ctaUrl && (
          <div className="mt-8 flex justify-center md:mt-10">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 rounded-full bg-primary_red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
