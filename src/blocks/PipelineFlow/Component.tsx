import type { PipelineFlowBlock as PipelineFlowBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { Bell, Camera, ChevronDown, HardDrive, Monitor, Network, Server, type LucideIcon } from 'lucide-react'

// Best-effort icon per step, matched by keyword.
function getStepIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('camera')) return Camera
  if (t.includes('network') || t.includes('poe')) return Network
  if (t.includes('nvr') || t.includes('vms')) return Server
  if (t.includes('storage') || t.includes('recording')) return HardDrive
  if (t.includes('alert')) return Bell
  if (t.includes('monitor') || t.includes('viewing')) return Monitor
  return Server
}

type Props = {
  className?: string
} & PipelineFlowBlockProps

// A single vertical stack of connected steps — deliberately not the
// horizontal-on-desktop timeline used by ProcessTimeline/DeliveryProcess,
// since this content is a literal top-to-bottom system pipeline rather
// than a sequence of instructional steps.
export const PipelineFlowBlock: React.FC<Props> = ({ className, badge, title, intro, steps = [], footer }) => {
  const safeSteps = steps || []
  if (safeSteps.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {intro && <p className="mt-2 text-gray-600 leading-relaxed">{intro}</p>}
        </Reveal>

        <Reveal delayMs={100} className="mx-auto flex max-w-xl flex-col items-stretch">
          {safeSteps.map((step, index) => {
            const Icon = getStepIcon(step.title)
            const isLast = index === safeSteps.length - 1
            return (
              <React.Fragment key={step.id || index}>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-base font-semibold leading-snug text-foreground">{step.title}</div>
                    {step.description && (
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.description}</p>
                    )}
                  </div>
                </div>
                {!isLast && (
                  <div className="flex justify-center py-1.5">
                    <ChevronDown className="h-5 w-5 flex-none text-primary_red/40" strokeWidth={2.5} />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </Reveal>

        {footer && (
          <Reveal delayMs={150} className="mx-auto mt-8 max-w-2xl text-center md:mt-10">
            <p className="text-sm text-gray-500">{footer}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
