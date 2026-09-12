import type { AVArchitectureFlowBlock as AVArchitectureFlowBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowDown,
  ArrowRight,
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
    <section className={cn('relative overflow-hidden bg-[#140505] py-14 md:py-20', className)}>
      {/* Same ambient treatment as the AMC results showcase, for a consistent
          site-wide "dark proof panel" look. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_10%_0%,rgba(214,29,42,0.25),transparent),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(214,29,42,0.15),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary_red/60 to-transparent"
      />

      <div className="container relative mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white text-balance">{title}</h2>
          {subtitle && <p className="mt-3 text-white/60 leading-relaxed">{subtitle}</p>}
        </Reveal>

        {/* Everything below sits inside one bordered frame, so the diagram
            reads as a single contained schematic rather than loose pieces
            spread across the section. */}
        <Reveal delayMs={100} className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10">
          {/* Main signal path */}
          <div className="hidden md:grid md:grid-cols-[repeat(var(--stage-count),1fr)] md:gap-0" style={{ ['--stage-count' as string]: safeMainFlow.length }}>
            {safeMainFlow.map((stage, index) => {
              const Icon = getStageIcon(stage.title)
              return (
                <div
                  key={stage.id || index}
                  className={cn('relative flex flex-col items-center px-5 text-center', index > 0 && 'border-l border-white/10')}
                >
                  {index > 0 && (
                    <ArrowRight className="absolute -left-3 top-6 h-6 w-6 flex-none rounded-full bg-[#140505] text-primary_red/70" />
                  )}
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 border-primary_red bg-[#140505] text-primary_red">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-base font-bold text-white">{stage.title}</div>
                  {stage.description && <p className="mt-2 text-sm leading-relaxed text-white/60">{stage.description}</p>}
                  {stage.examples && (
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary_red/70">{stage.examples}</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile: vertical connected timeline */}
          <div className="space-y-6 md:hidden">
            {safeMainFlow.map((stage, index) => {
              const Icon = getStageIcon(stage.title)
              const isLast = index === safeMainFlow.length - 1
              return (
                <div key={stage.id || index}>
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 border-primary_red bg-[#140505] text-primary_red">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="pt-1.5">
                      <div className="text-base font-bold text-white">{stage.title}</div>
                      {stage.description && <p className="mt-1.5 text-sm leading-relaxed text-white/60">{stage.description}</p>}
                      {stage.examples && (
                        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-primary_red/70">{stage.examples}</p>
                      )}
                    </div>
                  </div>
                  {!isLast && <ArrowDown className="my-3 ml-[22px] h-4 w-4 text-primary_red/50" />}
                </div>
              )
            })}
          </div>

          {/* Supporting systems */}
          {safeSecondaryFlows.length > 0 && (
            <div className="mt-10 border-t border-white/10 pt-8 md:mt-12 md:pt-10">
              <div className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/40">Supporting Systems</div>
              <div className="flex flex-wrap items-stretch justify-center gap-4">
                {safeSecondaryFlows.map((flow, index) => {
                  const FlowIcon = getStageIcon(flow.label)
                  const safeItems = flow.items || []
                  return (
                    <React.Fragment key={flow.id || index}>
                      {flow.connectFromPrevious && (
                        <div className="flex flex-none items-center justify-center text-primary_red/50">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      )}
                      <div className="flex w-full max-w-sm flex-1 flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary_red/15 text-primary_red">
                            <FlowIcon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-bold uppercase tracking-wide text-white">{flow.label}</span>
                        </div>
                        {flow.description && <p className="text-sm leading-relaxed text-white/60">{flow.description}</p>}

                        {flow.style === 'chain' ? (
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 pt-1">
                            {safeItems.map((item, i) => (
                              <React.Fragment key={item.id || i}>
                                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90">
                                  {item.text}
                                </span>
                                {i < safeItems.length - 1 && <ArrowRight className="h-3.5 w-3.5 flex-none text-primary_red/50" />}
                              </React.Fragment>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {safeItems.map((item, i) => (
                              <span
                                key={item.id || i}
                                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90"
                              >
                                {item.text}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          )}
        </Reveal>

        {note && <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-white/40">{note}</p>}
      </div>
    </section>
  )
}
