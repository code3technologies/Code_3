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
  ChevronDown,
  ChevronRight,
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

// A single, bold flow on a dark gradient panel: a horizontal row of large
// connected icon nodes, and — inside the same panel — a numbered detail
// list beneath it. Reserved for a flow important enough to deserve its own
// visual moment, distinct from the plain-white timelines used elsewhere.
export const FlowShowcaseBlock: React.FC<Props> = ({ className, badge, title, intro, steps = [], note, ctaLabel, ctaUrl }) => {
  const safeSteps = steps || []
  if (safeSteps.length === 0) return null
  const hasDescriptions = safeSteps.some((step) => step.description)

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
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1113] via-[#3a0f14] to-primary_red px-5 py-9 shadow-[0_24px_60px_-24px_rgba(201,14,29,0.5)] sm:px-8 md:py-11"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-white/[0.06] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-black/20 blur-3xl"
          />

          {/* Flow row */}
          <div className="relative flex flex-col items-center gap-2 overflow-x-auto md:flex-row md:flex-nowrap md:justify-center md:gap-1.5 md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
            {safeSteps.map((step, index) => {
              const Icon = getNodeIcon(step.label)
              const isLast = index === safeSteps.length - 1
              return (
                <React.Fragment key={step.id || index}>
                  <div className="flex w-24 flex-none flex-col items-center gap-2 text-center">
                    <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white text-primary_red shadow-lg sm:h-14 sm:w-14">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <span className="text-xs font-bold leading-tight text-white sm:text-sm">{step.label}</span>
                  </div>
                  {!isLast && (
                    <>
                      <ChevronDown className="h-5 w-5 flex-none text-white/40 md:hidden" strokeWidth={2.5} />
                      <ChevronRight className="hidden h-5 w-5 flex-none text-white/40 md:block" strokeWidth={2.5} />
                    </>
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Detail list — same panel, below the flow */}
          {hasDescriptions && (
            <div className="relative mt-8 border-t border-white/10 pt-8">
              <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                {safeSteps.map((step, index) => (
                  <div key={step.id || index} className="flex gap-3">
                    <span className="flex-none text-base font-black leading-none text-white/25">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="text-sm font-bold leading-snug text-white">{step.label}</div>
                      {step.description && (
                        <p className="mt-1 text-sm leading-relaxed text-white/60">{step.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
