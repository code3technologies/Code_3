import type { ZonedFlowBlock as ZonedFlowBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowDown,
  Building2,
  Cloud,
  Globe,
  HardDrive,
  Network,
  Router,
  Server,
  ShieldCheck,
  Users,
  Waypoints,
  Wifi,
  type LucideIcon,
} from 'lucide-react'

function getStageIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('user') || t.includes('device') || t.includes('endpoint')) return Users
  if (t.includes('firewall')) return ShieldCheck
  if (t.includes('router')) return Router
  if (t.includes('switch')) return Network
  if (t.includes('wi-fi') || t.includes('wifi') || t.includes('wireless') || t.includes('access point')) return Wifi
  if (t.includes('wan')) return Waypoints
  if (t.includes('cloud') && !t.includes('branch')) return Cloud
  if (t.includes('branch') || t.includes('internet') || t.includes('remote') || t.includes('site')) return Globe
  if (t.includes('storage') || t.includes('backup')) return HardDrive
  if (t.includes('data centre') || t.includes('data center') || t.includes('office')) return Building2
  return Server
}

type Props = {
  className?: string
} & ZonedFlowBlockProps

// A stack of labelled "zone" bands, each holding one or more stage cards,
// connected by arrows. Built to show a boundary — where one domain ends and
// the next begins — rather than a flat step list.
export const ZonedFlowBlock: React.FC<Props> = ({ className, badge, title, intro, zones = [], note }) => {
  const safeZones = (zones || []).filter((z) => (z.stages || []).length > 0)
  if (safeZones.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl text-balance">
            {title}
          </h2>
          {intro && <p className="mt-2 leading-relaxed text-gray-600">{intro}</p>}
        </Reveal>

        <div className="mx-auto max-w-4xl">
          {safeZones.map((zone, zi) => {
            const stages = zone.stages || []
            const isLast = zi === safeZones.length - 1
            return (
              <React.Fragment key={zone.id || zi}>
                <Reveal
                  delayMs={zi * 60}
                  className={cn(
                    'rounded-2xl border p-4 sm:p-5',
                    zone.emphasis
                      ? 'border-primary_red/30 bg-[#FDEBEC]/40'
                      : 'border-border bg-gray-50/60',
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
                      zone.emphasis
                        ? 'bg-primary_red text-white'
                        : 'border border-border bg-white text-gray-500',
                    )}
                  >
                    {zone.label}
                  </span>

                  <div
                    className={cn(
                      'mt-3 grid gap-3',
                      stages.length === 1 && 'sm:max-w-2xl',
                      stages.length >= 2 && 'sm:grid-cols-2',
                      stages.length >= 3 && 'lg:grid-cols-3',
                    )}
                  >
                    {stages.map((stage, si) => {
                      const Icon = getStageIcon(stage.title)
                      return (
                        <div
                          key={stage.id || si}
                          className="flex gap-3.5 rounded-xl border border-border bg-white p-4"
                        >
                          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-[#FDEBEC] text-primary_red">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[15px] font-bold leading-snug text-foreground">
                              {stage.title}
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-gray-600">
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Reveal>

                {!isLast && (
                  <div className="flex flex-col items-center gap-1 py-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary_red/30 bg-white text-primary_red">
                      <ArrowDown className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    {zone.connectorNote && (
                      <span className="text-xs font-medium text-gray-400">{zone.connectorNote}</span>
                    )}
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {note && (
          <Reveal delayMs={120} className="mx-auto mt-7 max-w-2xl text-center">
            <p className="text-sm text-gray-500">{note}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
