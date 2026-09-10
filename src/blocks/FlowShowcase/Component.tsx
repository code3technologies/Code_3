import type { FlowShowcaseBlock as FlowShowcaseBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowRight,
  Bell,
  Camera,
  Car,
  CheckCircle2,
  ClipboardCheck,
  Fence,
  Fingerprint,
  HardDrive,
  KeySquare,
  ScanEye,
  ScanLine,
  Settings2,
  ShieldCheck,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per flow node, matched by keyword.
function getNodeIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('person') || t.includes('approach')) return User
  if (t.includes('plate')) return ScanLine
  if (t.includes('vehicle')) return Car
  if (t.includes('camera') || t.includes('existing cctv')) return Camera
  if (t.includes('detect')) return ScanEye
  if (t.includes('access-control') || t.includes('access control')) return Fingerprint
  if (t.includes('authorization') || t.includes('authorisation')) return KeySquare
  if (t.includes('verification') || t.includes('verified') || t.includes('granted')) return CheckCircle2
  if (t.includes('gate')) return Fence
  if (t.includes('record')) return HardDrive
  if (t.includes('response')) return ShieldCheck
  if (t.includes('compatibility') || t.includes('assessment')) return ClipboardCheck
  if (t.includes('analytics') || t.includes('ai-capable') || t.includes('ai capable')) return Sparkles
  if (t.includes('configuration')) return Settings2
  if (t.includes('alert') || t.includes('monitoring')) return Bell
  return Sparkles
}

type Props = {
  className?: string
} & FlowShowcaseBlockProps

// A single, bold flow on a dark gradient panel — numbered glass step cards
// laid out in a left-to-right grid, each with an icon, label and detail
// line. Reserved for a flow important enough to deserve its own visual
// moment, distinct from the plain-white timelines used elsewhere.
export const FlowShowcaseBlock: React.FC<Props> = ({ className, badge, title, intro, steps = [], note, ctaLabel, ctaUrl }) => {
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
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1113] via-[#3a0f14] to-primary_red px-5 py-8 shadow-[0_24px_60px_-24px_rgba(201,14,29,0.5)] sm:px-8 md:py-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-white/[0.06] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-black/20 blur-3xl"
          />

          <div
            className={cn(
              'relative grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4',
              safeSteps.length !== 4 && safeSteps.length !== 2 && 'lg:grid-cols-3',
            )}
          >
            {safeSteps.map((step, index) => {
              const Icon = getNodeIcon(step.label)
              return (
                <div
                  key={step.id || index}
                  className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white text-primary_red shadow-md">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold text-white/40">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="text-sm font-bold leading-snug text-white">{step.label}</div>
                  {step.description && (
                    <p className="text-sm leading-relaxed text-white/65">{step.description}</p>
                  )}
                </div>
              )
            })}
          </div>
        </Reveal>

        {note && (
          <Reveal delayMs={150} className="mx-auto mt-6 max-w-2xl text-center">
            <p className="text-sm text-gray-500">{note}</p>
          </Reveal>
        )}

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
