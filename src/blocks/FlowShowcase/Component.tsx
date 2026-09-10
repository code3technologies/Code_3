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

// A single, bold flow on a dark gradient panel — a vertical spine of large
// white icon nodes, each with its own label and detail line. Reserved for a
// flow important enough to deserve its own visual moment, distinct from the
// plain-white timelines used elsewhere on the site.
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
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1113] via-[#3a0f14] to-primary_red px-6 py-10 shadow-[0_24px_60px_-24px_rgba(201,14,29,0.5)] sm:px-10 md:py-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-white/[0.06] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-black/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-xl">
            {/* Spine through the icon nodes */}
            <div className="absolute left-6 top-3 bottom-3 w-px -translate-x-1/2 bg-white/15 sm:left-7" />

            <ol className="relative space-y-6 md:space-y-7">
              {safeSteps.map((step, index) => {
                const Icon = getNodeIcon(step.label)
                return (
                  <li key={step.id || index} className="flex gap-4 sm:gap-5">
                    <span className="relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white text-primary_red shadow-lg sm:h-14 sm:w-14">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <div className="pt-1">
                      <div className="text-sm font-bold leading-snug text-white sm:text-base">{step.label}</div>
                      {step.description && (
                        <p className="mt-1 text-sm leading-relaxed text-white/70">{step.description}</p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
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
