import type { DetailedFeatureGridBlock as DetailedFeatureGridBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { Aperture, ArrowRight, Building2, Camera, Car, Sparkles, Sun, Thermometer, ZoomIn, type LucideIcon } from 'lucide-react'

// Best-effort icon per item, matched by keyword — mirrors RoomSizeGuide's
// camera-type mapping so the same item reads consistently across blocks.
function getItemIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('dome')) return Building2
  if (t.includes('bullet')) return Sun
  if (t.includes('turret')) return Camera
  if (t.includes('ptz')) return ZoomIn
  if (t.includes('ai camera') || t.includes('ai-camera')) return Sparkles
  if (t.includes('anpr')) return Car
  if (t.includes('thermal')) return Thermometer
  if (t.includes('fisheye')) return Aperture
  return Camera
}

type Props = {
  className?: string
} & DetailedFeatureGridBlockProps

export const DetailedFeatureGridBlock: React.FC<Props> = ({ className, badge, title, subtitle, items = [], footer }) => {
  const safeItems = items || []
  if (safeItems.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-6 max-w-2xl text-center md:mb-7">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal
          delayMs={100}
          className={cn(
            'mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2',
            safeItems.length <= 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3',
          )}
        >
          {safeItems.map((item, index) => {
            const Icon = getItemIcon(item.title)
            const applications = item.applications || []
            return (
              <div
                key={item.id || index}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary_red/30 hover:shadow-md"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-base font-semibold leading-snug text-foreground">{item.title}</span>
                <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>

                {applications.length > 0 && (
                  <div className="mt-1">
                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Common applications:
                    </div>
                    <ul className="space-y-1.5">
                      {applications.map((app, appIndex) => (
                        <li key={app.id || appIndex} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-2 h-1 w-1 flex-none rounded-full bg-primary_red" />
                          {app.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.ctaLabel && item.ctaUrl && (
                  <Link
                    href={item.ctaUrl}
                    className="group/link mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary_red"
                  >
                    {item.ctaLabel}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                )}
              </div>
            )
          })}
        </Reveal>

        {footer && (
          <Reveal delayMs={150} className="mx-auto mt-6 max-w-2xl text-center md:mt-7">
            <p className="text-sm text-gray-500">{footer}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
