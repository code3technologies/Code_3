import type { ProcessPhasesBlock as ProcessPhasesBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardList,
  Headset,
  Laptop,
  PackageCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per phase, matched by keyword — falls back sensibly for
// any future phase set, not just "Before / During / After".
function getPhaseIcon(label?: string | null): LucideIcon {
  const l = (label || '').toLowerCase()
  // Checked before the "before" rule below, since "Before Handover" also
  // contains "before" and would otherwise collide with "Before Installation".
  if (l.includes('handover')) return PackageCheck
  if (l.includes('before')) return ClipboardList
  if (l.includes('during')) return Wrench
  if (l.includes('after')) return Headset
  if (l.includes('remote')) return Laptop
  if (l.includes('on-site') || l.includes('onsite')) return Building2
  return ClipboardList
}

type Props = {
  className?: string
} & ProcessPhasesBlockProps

export const ProcessPhasesBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  phases = [],
  ctaLabel,
  ctaUrl,
}) => {
  const safePhases = phases || []
  if (safePhases.length === 0) return null
  const hasDescriptions = safePhases.some((phase) => (phase.items || []).some((item) => item.description))

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-6">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal
          delayMs={100}
          className={cn(
            'grid grid-cols-1 divide-y divide-border rounded-2xl border border-border md:divide-x md:divide-y-0',
            safePhases.length === 2 && 'md:grid-cols-2',
            safePhases.length === 3 && 'md:grid-cols-3',
            safePhases.length === 4 && 'md:grid-cols-4',
          )}
        >
          {safePhases.map((phase, pIndex) => {
            const PhaseIcon = getPhaseIcon(phase.label)
            const isLast = pIndex === safePhases.length - 1
            return (
              <div key={phase.id || pIndex} className="p-5 md:p-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary_red/10 text-primary_red">
                    <PhaseIcon className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground">
                    {phase.label}
                    {!isLast && <ArrowRight className="hidden h-3.5 w-3.5 flex-none text-gray-300 md:block" />}
                  </h3>
                </div>
                <ul className={cn(hasDescriptions ? 'space-y-4' : 'space-y-2.5')}>
                  {(phase.items || []).map((item, iIndex) => (
                    <li key={item.id || iIndex} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary_red/10 text-primary_red">
                        <Check className="h-3 w-3" />
                      </span>
                      <div>
                        <div className={cn(hasDescriptions && 'font-semibold text-foreground')}>{item.text}</div>
                        {hasDescriptions && item.description && (
                          <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </Reveal>

        {ctaLabel && ctaUrl && (
          <div className="mt-6 flex justify-center md:mt-7">
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
