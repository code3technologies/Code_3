import type { PipelineFlowBlock as PipelineFlowBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  Bell,
  Camera,
  ChevronDown,
  ChevronRight,
  Grid2x2,
  HardDrive,
  Monitor,
  Network,
  Server,
  Zap,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per step, matched by keyword.
function getStepIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('camera')) return Camera
  if (t.includes('network') || t.includes('poe')) return Network
  if (t.includes('nvr') || t.includes('vms')) return Server
  if (t.includes('storage') || t.includes('recording')) return HardDrive
  if (t.includes('zone')) return Grid2x2
  if (t.includes('event')) return Zap
  if (t.includes('alert')) return Bell
  if (t.includes('monitor') || t.includes('viewing')) return Monitor
  return Server
}

type Props = {
  className?: string
} & PipelineFlowBlockProps

// A row of connected steps — horizontal on desktop, stacked on mobile.
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

        <Reveal
          delayMs={100}
          className="mx-auto flex max-w-xl flex-col items-stretch md:max-w-5xl md:flex-row md:flex-nowrap md:items-stretch md:justify-center"
        >
          {safeSteps.map((step, index) => {
            const Icon = getStepIcon(step.title)
            const isLast = index === safeSteps.length - 1
            return (
              <React.Fragment key={step.id || index}>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5 md:min-w-0 md:flex-1 md:basis-0 md:flex-col md:items-center md:gap-2.5 md:p-4 md:text-center">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-base font-semibold leading-snug text-foreground md:text-sm">{step.title}</div>
                    {step.description && (
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.description}</p>
                    )}
                  </div>
                </div>
                {!isLast && (
                  <div className="flex flex-none justify-center py-1.5 md:items-center md:px-1 md:py-0">
                    <ChevronDown className="h-5 w-5 flex-none text-primary_red/40 md:hidden" strokeWidth={2.5} />
                    <ChevronRight
                      className="hidden h-5 w-5 flex-none text-primary_red/40 md:block"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </Reveal>

        {footer && (
          <Reveal delayMs={150} className="mx-auto mt-8 max-w-2xl text-center md:mt-10">
            <RichText
              data={footer}
              enableGutter={false}
              enableProse={false}
              className="text-sm text-gray-500 [&_a]:font-semibold [&_a]:text-primary_red [&_a]:underline [&_a]:decoration-primary_red/30 [&_a]:underline-offset-2 hover:[&_a]:decoration-primary_red"
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}
