import type { AVArchitectureFlowBlock as AVArchitectureFlowBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowRight,
  ChevronDown,
  Cpu,
  Laptop,
  Monitor,
  Network,
  ScreenShare,
  SlidersHorizontal,
  Volume2,
  type LucideIcon,
} from 'lucide-react'

type Props = {
  className?: string
} & AVArchitectureFlowBlockProps

// Best-effort icon per stage/flow label, matched by keyword — mirrors the
// same mapping used for AV System Components elsewhere on this page, so the
// two sections read consistently.
function getStageIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('source')) return Laptop
  if (t.includes('connectivity') || t.includes('network')) return Network
  if (t.includes('processing')) return Cpu
  if (t.includes('output') || t.includes('display')) return Monitor
  if (t.includes('audio')) return Volume2
  if (t.includes('collaborat')) return ScreenShare
  if (t.includes('control')) return SlidersHorizontal
  return Cpu
}

export const AVArchitectureFlowBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  mainFlow = [],
  secondaryFlows = [],
  note,
}) => {
  const safeMainFlow = mainFlow || []
  const safeSecondaryFlows = secondaryFlows || []
  if (safeMainFlow.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        {/* Main signal path */}
        <Reveal delayMs={100} className="mx-auto flex max-w-md flex-col items-center">
          {safeMainFlow.map((stage, index) => {
            const Icon = getStageIcon(stage.title)
            const isLast = index === safeMainFlow.length - 1
            return (
              <React.Fragment key={stage.id || index}>
                <div className="flex w-full items-center gap-4 rounded-2xl border border-border bg-gray-50/60 px-5 py-4">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-base font-semibold text-foreground">{stage.title}</div>
                    {stage.examples && <div className="mt-0.5 text-sm text-gray-500">{stage.examples}</div>}
                  </div>
                </div>
                {!isLast && <ChevronDown className="my-1.5 h-5 w-5 flex-none text-primary_red/50" />}
              </React.Fragment>
            )
          })}
        </Reveal>

        {/* Secondary flows */}
        {safeSecondaryFlows.length > 0 && (
          <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-6 md:mt-14">
            {safeSecondaryFlows.map((flow, index) => {
              const FlowIcon = getStageIcon(flow.label)
              const safeItems = flow.items || []
              return (
                <React.Fragment key={flow.id || index}>
                  {flow.connectFromPrevious && <ChevronDown className="h-5 w-5 flex-none text-primary_red/50" />}
                  <Reveal delayMs={100} className="w-full rounded-2xl border border-border bg-gray-50/60 px-5 py-5 text-center">
                    <div className="mb-3 flex items-center justify-center gap-2">
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[#FDEBEC] text-primary_red">
                        <FlowIcon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-bold uppercase tracking-wide text-foreground">{flow.label}</span>
                    </div>

                    {flow.style === 'chain' ? (
                      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
                        {safeItems.map((item, i) => (
                          <React.Fragment key={item.id || i}>
                            <span className="rounded-full border border-border bg-white px-3.5 py-1.5 text-sm font-medium text-foreground">
                              {item.text}
                            </span>
                            {i < safeItems.length - 1 && <ArrowRight className="h-4 w-4 flex-none text-primary_red/50" />}
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {safeItems.map((item, i) => (
                          <span
                            key={item.id || i}
                            className="rounded-full border border-border bg-white px-3.5 py-1.5 text-sm font-medium text-foreground"
                          >
                            {item.text}
                          </span>
                        ))}
                      </div>
                    )}
                  </Reveal>
                </React.Fragment>
              )
            })}
          </div>
        )}

        {note && <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-gray-500">{note}</p>}
      </div>
    </section>
  )
}
