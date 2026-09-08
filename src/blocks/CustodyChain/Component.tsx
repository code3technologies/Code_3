import type { CustodyChainBlock as CustodyChainBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Cpu,
  Database,
  Handshake,
  LayoutDashboard,
  Lock,
  MapPin,
  Network,
  PenTool,
  Plug,
  Tag,
  Truck,
  Tv,
  Unplug,
  Users,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per chain step, matched by keyword.
function getStepIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('tag')) return Tag
  if (t.includes('photo')) return Camera
  if (t.includes('disconnect')) return Unplug
  if (t.includes('secure')) return Lock
  if (t.includes('transport')) return Truck
  if (t.includes('reinstall') || t.includes('install')) return Plug
  if (t.includes('verify') || t.includes('test')) return CheckCircle2
  if (t.includes('handover') || t.includes('hand over')) return Handshake
  if (t.includes('creation') || t.includes('create')) return PenTool
  if (t.includes('management system') || t.includes('cms')) return Database
  if (t.includes('player')) return Cpu
  if (t.includes('dashboard')) return LayoutDashboard
  if (t.includes('location')) return MapPin
  if (t.includes('network')) return Network
  if (t.includes('display') || t.includes('screen')) return Tv
  if (t.includes('audience')) return Users
  return CheckCircle2
}

type Props = {
  className?: string
} & CustodyChainBlockProps

export const CustodyChainBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  steps = [],
  ctaLabel,
  ctaUrl,
}) => {
  const safeSteps = steps || []
  if (safeSteps.length === 0) return null
  const hasDescriptions = safeSteps.some((step) => step.description)

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="mx-auto mb-6 max-w-2xl text-center md:mb-7">
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground text-balance">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        {hasDescriptions ? (
          // With descriptions, render a literal connected chain of icon nodes
          // rather than a flat card grid - it leans into the "chain of
          // custody" name itself, and keeps captions short instead of dense
          // paragraph cards.
          <>
            <Reveal delayMs={100} className="relative mx-auto hidden max-w-6xl pt-6 md:block">
              <div className="absolute left-0 right-0 top-[52px] h-[6px] rounded-full bg-gradient-to-r from-primary_red/20 via-primary_red to-primary_red/20" />
              <div className="relative flex justify-between">
                {safeSteps.map((step, index) => {
                  const Icon = getStepIcon(step.text)
                  return (
                    <div key={step.id || index} className="flex w-[11%] flex-col items-center text-center">
                      <div className="relative flex h-[72px] w-[72px] flex-none items-center justify-center rounded-full border-4 border-white bg-primary_red text-white shadow-[0_6px_16px_rgba(220,38,38,0.3)] ring-2 ring-primary_red/25 transition-transform duration-300 hover:scale-105">
                        <Icon className="h-7 w-7" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-foreground text-[10px] font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-foreground">{step.text}</h3>
                      {step.description && (
                        <p className="mt-1 text-xs leading-snug text-gray-500">{step.description}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </Reveal>

            <Reveal delayMs={100} className="relative mx-auto max-w-sm md:hidden">
              <div className="absolute bottom-2 left-[23px] top-2 w-[4px] rounded-full bg-gradient-to-b from-primary_red/20 via-primary_red to-primary_red/20" />
              <div className="flex flex-col gap-5">
                {safeSteps.map((step, index) => {
                  const Icon = getStepIcon(step.text)
                  return (
                    <div key={step.id || index} className="relative flex items-center gap-4">
                      <div className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full border-4 border-white bg-primary_red text-white shadow-[0_4px_10px_rgba(220,38,38,0.3)] ring-2 ring-primary_red/25">
                        <Icon className="h-5 w-5" />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-foreground text-[9px] font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{step.text}</h3>
                        {step.description && (
                          <p className="text-xs leading-snug text-gray-500">{step.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          </>
        ) : (
          <Reveal
            delayMs={100}
            className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-gray-50/60"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-primary_red via-red-400 to-primary_red" />
            <div className="flex flex-wrap items-center justify-center gap-2.5 p-6 md:p-8">
              {safeSteps.map((step, index) => {
                const Icon = getStepIcon(step.text)
                // The arrow travels with the chip it leads into (not the one before it),
                // so if this pair wraps to a new line the arrow doesn't dangle alone.
                return (
                  <span key={step.id || index} className="inline-flex items-center gap-2.5">
                    {index > 0 && <ArrowRight className="h-4 w-4 flex-none text-primary_red/40" strokeWidth={2.5} />}
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary_red/20 bg-white px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary_red/10 text-primary_red">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {step.text}
                    </span>
                  </span>
                )
              })}
            </div>
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
