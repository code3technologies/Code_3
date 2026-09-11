import type { TeamConvergenceBlock as TeamConvergenceBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowRight,
  Building2,
  Camera,
  Cast,
  CheckCircle2,
  ChevronsDown,
  ClipboardList,
  Cloud,
  Handshake,
  KeyRound,
  Mail,
  Monitor,
  Network,
  Phone,
  Presentation,
  Server,
  ShieldCheck,
  User,
  Users,
  UsersRound,
  Wifi,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per scattered item, matched by keyword.
function getItemIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('presenter')) return User
  if (t.includes('cast')) return Cast
  if (t.includes('interactive') || t.includes('display')) return Monitor
  if (t.includes('wi-fi') || t.includes('wifi')) return Wifi
  if (t.includes('network')) return Network
  if (t.includes('server')) return Server
  if (t.includes('cyber') || t.includes('security')) return ShieldCheck
  if (t.includes('cctv') || t.includes('camera')) return Camera
  if (t.includes('access control')) return KeyRound
  if (t.includes('av') || t.includes('audio') || t.includes('video')) return Presentation
  if (t.includes('365') || t.includes('microsoft') || t.includes('email')) return Mail
  return Network
}

// Best-effort icon per destination breakdown item, matched by keyword.
function getDestinationIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('manager')) return User
  if (t.includes('team')) return UsersRound
  if (t.includes('plan')) return ClipboardList
  if (t.includes('handover')) return Handshake
  if (t.includes('server')) return Server
  if (t.includes('wi-fi') || t.includes('wifi')) return Wifi
  if (t.includes('voip') || t.includes('phone')) return Phone
  if (t.includes('cloud')) return Cloud
  if (t.includes('user')) return Users
  return CheckCircle2
}

// Best-effort icon for the main destination hero card, matched by keyword.
// Defaults to UsersRound (a unified team) since that's the block's original use case.
function getHeroIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('screen') || t.includes('display')) return Monitor
  if (t.includes('room')) return Building2
  return UsersRound
}

// Small alternating tilt per chip so the "before" state reads as scattered
// rather than another tidy grid — kept subtle (max 3deg) so text stays crisp.
const TILTS = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.5, -1, 2]

type Props = {
  className?: string
} & TeamConvergenceBlockProps

export const TeamConvergenceBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  beforeLabel,
  items = [],
  afterLabel,
  teamLabel,
  destinationItems = [],
  size,
  ctaLabel,
  ctaUrl,
}) => {
  const safeItems = items || []
  const safeDestinationItems = destinationItems || []
  if (safeItems.length === 0) return null
  const isLarge = size === 'large'

  return (
    <section className={cn('bg-white', isLarge ? 'py-14 md:py-20' : 'py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className={cn('mx-auto max-w-2xl text-center', isLarge ? 'mb-10 md:mb-12' : 'mb-7 md:mb-8')}>
          {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
          <h2
            className={cn(
              'font-semibold tracking-tight text-foreground text-balance',
              isLarge ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl',
            )}
          >
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-gray-600 leading-relaxed">{subtitle}</p>}
        </Reveal>

        <Reveal
          delayMs={100}
          className={cn('mx-auto flex flex-col items-center', isLarge ? 'max-w-3xl gap-6' : 'max-w-2xl gap-5')}
        >
          {beforeLabel && <p className="text-center text-sm font-medium text-gray-500">{beforeLabel}</p>}

          {/* Scattered — fragmented vendors/specialties, muted and loosely tilted */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {safeItems.map((item, index) => {
              const Icon = getItemIcon(item.text)
              return (
                <span
                  key={item.id || index}
                  style={{ transform: `rotate(${TILTS[index % TILTS.length]}deg)` }}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 font-medium text-gray-600',
                    isLarge ? 'px-4 py-2 text-base' : 'px-3.5 py-1.5 text-sm',
                  )}
                >
                  <Icon className={cn('flex-none text-gray-400', isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5')} />
                  {item.text}
                </span>
              )
            })}
          </div>

          <ChevronsDown className={cn('flex-none text-gray-300', isLarge ? 'h-9 w-9' : 'h-7 w-7')} strokeWidth={2.5} />

          {afterLabel && <p className="text-center text-sm font-medium text-gray-500">{afterLabel}</p>}

          {/* Destination — one unified, branded team */}
          <div
            className={cn(
              'inline-flex items-center gap-3 rounded-2xl bg-primary_red shadow-[0_16px_36px_-16px_rgba(201,14,29,0.55)]',
              isLarge ? 'px-9 py-5 md:px-12 md:py-7' : 'px-7 py-4 md:px-9 md:py-5',
            )}
          >
            <span
              className={cn(
                'flex flex-none items-center justify-center rounded-full bg-white/15 text-white',
                isLarge ? 'h-12 w-12' : 'h-9 w-9',
              )}
            >
              {(() => {
                const HeroIcon = getHeroIcon(teamLabel)
                return <HeroIcon className={isLarge ? 'h-6 w-6' : 'h-5 w-5'} />
              })()}
            </span>
            <span
              className={cn(
                'font-bold uppercase tracking-wide text-white',
                isLarge ? 'text-xl md:text-3xl' : 'text-base md:text-lg',
              )}
            >
              {teamLabel}
            </span>
          </div>

          {safeDestinationItems.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2.5">
              {safeDestinationItems.map((item, index) => {
                const Icon = getDestinationIcon(item.text)
                return (
                  <span
                    key={item.id || index}
                    className="inline-flex items-center gap-2 rounded-full border border-primary_red/20 bg-[#FDEBEC] px-4 py-2 text-sm font-semibold text-foreground"
                  >
                    <Icon className="h-4 w-4 flex-none text-primary_red" />
                    {item.text}
                  </span>
                )
              })}
            </div>
          )}
        </Reveal>

        {ctaLabel && ctaUrl && (
          <div className={cn('flex justify-center', isLarge ? 'mt-10 md:mt-12' : 'mt-6 md:mt-7')}>
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 rounded-full border border-primary_red px-6 py-3 text-sm font-semibold text-primary_red transition-colors hover:bg-[#FDEBEC]"
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
