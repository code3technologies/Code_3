import type { EcosystemDiagramBlock as EcosystemDiagramBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  Building2,
  Camera,
  Car,
  Cloud,
  Fence,
  Fingerprint,
  MapPin,
  Mic,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per connected system, matched by keyword.
function getSystemIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  // Multi-site / location keywords, checked first (e.g. "Dubai HQ" would
  // otherwise match the "ai" rule below).
  if (t.includes('hq') || t.includes('headquarter') || t.includes('head office')) return Building2
  if (t.includes('data center') || t.includes('data centre') || t.includes('datacenter')) return Server
  if (t.includes('cloud')) return Cloud
  if (t.includes('remote')) return MapPin
  if (t.includes('branch') || t.includes('office')) return Building2
  if (t.includes('wan') || t.includes('backbone') || (t.includes('network') && !t.includes('networking')))
    return Network
  if (t.includes('cctv') || t.includes('camera')) return Camera
  if (t.includes('ai')) return Sparkles
  if (t.includes('access control')) return Fingerprint
  if (t.includes('anpr')) return Car
  if (t.includes('gate')) return Fence
  if (t.includes('intercom')) return Mic
  if (t.includes('visitor')) return Users
  return ShieldCheck
}

type Props = {
  className?: string
} & EcosystemDiagramBlockProps

function SpokeContent({ label, className }: { label: string; className?: string }) {
  const Icon = getSystemIcon(label)
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-white px-3 py-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary_red/40 hover:shadow-md',
        className,
      )}
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#FDEBEC] text-primary_red">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="text-xs font-semibold leading-tight text-foreground">{label}</span>
    </div>
  )
}

// A radial hub-and-spoke diagram (desktop) with every peer system connected
// to a central hub by a line — used for genuine ecosystems of interoperable
// systems, as opposed to PipelineFlow's literal top-to-bottom sequence.
// Falls back to a simpler hub + grid on narrow screens, where precise
// radial placement of 6-8 nodes stops being legible.
export const EcosystemDiagramBlock: React.FC<Props> = ({ className, badge, title, intro, hubLabel, items = [] }) => {
  const safeItems = items || []
  if (safeItems.length === 0 || !hubLabel) return null

  const HubIcon = getSystemIcon(hubLabel)
  const radius = 40
  const positions = safeItems.map((_, index) => {
    const angle = -90 + index * (360 / safeItems.length)
    const rad = (angle * Math.PI) / 180
    return {
      x: 50 + radius * Math.cos(rad),
      y: 50 + radius * Math.sin(rad),
    }
  })

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {intro && <p className="mt-2 text-gray-600 leading-relaxed">{intro}</p>}
        </Reveal>

        {/* Desktop / tablet: true radial diagram */}
        <Reveal delayMs={100} className="mx-auto hidden aspect-square w-full max-w-[560px] sm:block">
          <div className="relative h-full w-full">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
              {positions.map((pos, index) => (
                <line
                  key={index}
                  x1={50}
                  y1={50}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="currentColor"
                  strokeWidth="0.6"
                  className="text-gray-200"
                />
              ))}
            </svg>

            <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full bg-primary_red text-white shadow-[0_16px_32px_-12px_rgba(201,14,29,0.55)]">
              <HubIcon className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wide">{hubLabel}</span>
            </div>

            {safeItems.map((item, index) => {
              const pos = positions[index]
              const style: React.CSSProperties = {
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }
              return (
                <div
                  key={item.id || index}
                  className="absolute z-10 w-[110px] -translate-x-1/2 -translate-y-1/2"
                  style={style}
                >
                  {item.url ? (
                    <Link href={item.url}>
                      <SpokeContent label={item.label} />
                    </Link>
                  ) : (
                    <SpokeContent label={item.label} />
                  )}
                </div>
              )
            })}
          </div>
        </Reveal>

        {/* Mobile: hub + simple connected grid */}
        <Reveal delayMs={100} className="mx-auto flex max-w-md flex-col items-center sm:hidden">
          <div className="flex h-20 w-20 flex-none flex-col items-center justify-center gap-1 rounded-full bg-primary_red text-white shadow-[0_16px_32px_-12px_rgba(201,14,29,0.55)]">
            <HubIcon className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-wide">{hubLabel}</span>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="grid w-full grid-cols-2 gap-3">
            {safeItems.map((item, index) =>
              item.url ? (
                <Link key={item.id || index} href={item.url}>
                  <SpokeContent label={item.label} />
                </Link>
              ) : (
                <SpokeContent key={item.id || index} label={item.label} />
              ),
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
