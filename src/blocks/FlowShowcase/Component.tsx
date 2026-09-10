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

// A single, bold flow on a dark gradient panel — the steps themselves are
// elevated cards (number, icon, label, detail) laid out left-to-right in a
// grid. Reserved for a flow important enough to deserve its own visual
// moment, distinct from the plain-white timelines used elsewhere.
export const FlowShowcaseBlock: React.FC<Props> = ({ className, badge, title, intro, steps = [], note, ctaLabel, ctaUrl }) => {
  const safeSteps = steps || []
  if (safeSteps.length === 0) return null
  const cols = safeSteps.length % 3 === 0 ? 3 : safeSteps.length === 4 ? 2 : safeSteps.length <= 3 ? safeSteps.length : 3

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
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1c1113] via-[#3a0f14] to-primary_red p-5 shadow-[0_28px_70px_-28px_rgba(201,14,29,0.55)] sm:p-7 md:p-9"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-white/[0.07] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-black/25 blur-3xl"
          />

          <div
            className={cn(
              'relative grid gap-3 sm:gap-4',
              cols === 2 && 'sm:grid-cols-2',
              cols === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
            )}
          >
            {safeSteps.map((step, index) => {
              const Icon = getNodeIcon(step.label)
              return (
                <div
                  key={step.id || index}
                  className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.07] p-5 ring-1 ring-inset ring-white/[0.03] transition-colors duration-300 hover:bg-white/[0.11]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-3 select-none text-3xl font-black leading-none text-white/[0.08]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mb-3 flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white text-primary_red shadow-lg">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold leading-snug text-white">{step.label}</h3>
                  {step.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-white/65">{step.description}</p>
                  )}
                </div>
              )
            })}
          </div>

          {note && (
            <p className="relative mt-6 border-t border-white/10 pt-5 text-center text-sm text-white/55">{note}</p>
          )}
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
