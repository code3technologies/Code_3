import type { AlternatingTimelineBlock as AlternatingTimelineBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowRight,
  Bell,
  Camera,
  ClipboardCheck,
  ScanEye,
  Settings2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per step, matched by keyword.
function getStepIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('existing')) return Camera
  if (t.includes('compatibility') || t.includes('assessment')) return ClipboardCheck
  if (t.includes('analytics') || t.includes('ai-capable') || t.includes('ai capable')) return Sparkles
  if (t.includes('configuration')) return Settings2
  if (t.includes('detection')) return ScanEye
  if (t.includes('alert') || t.includes('monitoring')) return Bell
  return Sparkles
}

type Props = {
  className?: string
} & AlternatingTimelineBlockProps

// A spacious, alternating left/right timeline connected by a central spine
// — reserved for important sequential stories that deserve more room than
// the compact card grids (IconFeatureGrid/DetailedFeatureGrid), the boxed
// vertical stack (PipelineFlow) or the numbered-circle timelines
// (ProcessTimeline/DeliveryProcess) used elsewhere on the site.
export const AlternatingTimelineBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  intro,
  steps = [],
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const safeSteps = steps || []
  if (safeSteps.length === 0) return null

  return (
    <section className={cn('bg-white py-8 md:py-12', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {intro && <p className="mt-3 text-gray-600 leading-relaxed">{intro}</p>}
        </Reveal>

        <div className="relative mx-auto max-w-3xl">
          {/* Central spine */}
          <div className="absolute left-6 top-2 bottom-2 w-px bg-border md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-10 md:space-y-14">
            {safeSteps.map((step, index) => {
              const Icon = getStepIcon(step.title)
              const isEven = index % 2 === 0
              return (
                <Reveal key={step.id || index} delayMs={index * 60}>
                  <div className="relative flex flex-col gap-4 pl-16 md:grid md:grid-cols-2 md:gap-10 md:pl-0">
                    {/* Marker on the spine */}
                    <span className="absolute left-6 top-0 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-primary_red text-white shadow-md md:left-1/2">
                      <Icon className="h-5 w-5" />
                    </span>

                    <div
                      className={cn(
                        isEven
                          ? 'md:col-start-1 md:row-start-1 md:pr-14 md:text-right'
                          : 'md:col-start-2 md:row-start-1 md:pl-14 md:text-left',
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-wide text-primary_red">
                        Step {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-1 text-xl font-bold text-foreground">{step.title}</h3>
                      <p className="mt-2 text-base leading-relaxed text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {ctaLabel && ctaUrl && (
          <Reveal className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-primary_red/15 bg-primary_red/[0.04] px-6 py-6 text-center md:mt-16">
            {ctaText && <p className="text-base font-medium text-foreground">{ctaText}</p>}
            <Link
              href={ctaUrl}
              className="group inline-flex flex-none items-center gap-2.5 rounded-full bg-primary_red px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary_red/20 transition-all duration-300 hover:scale-[1.03] hover:bg-secondary_red"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 flex-none transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}
