import type { ScopeChecklistBlock as ScopeChecklistBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import type { Media } from 'src/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  Activity,
  AlertTriangle,
  ArrowUpCircle,
  Banknote,
  Cable,
  Camera,
  CalendarCheck,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Cloud,
  Cpu,
  Database,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  Flag,
  FolderKanban,
  FolderOpen,
  Handshake,
  HardDrive,
  Headset,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Lock,
  Mail,
  MessageSquare,
  Mic,
  Monitor,
  MonitorCheck,
  Network,
  Phone,
  PlugZap,
  Presentation,
  Projector,
  Radar,
  Recycle,
  RefreshCw,
  RotateCw,
  ScrollText,
  Server,
  Settings2,
  ShieldCheck,
  Shuffle,
  Sliders,
  Snowflake,
  TabletSmartphone,
  Target,
  Ticket,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  Video,
  Volume2,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

type Props = {
  className?: string
} & ScopeChecklistBlockProps

function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={cn('flex-none', className)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

// Best-effort icon per item, matched by keyword — shared by the Monthly
// Cadence layout and the Checklist Grid's optional "keyword" icon style, so
// any future item list gets a sensible icon rather than just AMC's 9.
function getKeywordIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  // IT outsourcing / service-management / security-access keywords — checked
  // first since some (e.g. "mfa where supported") would otherwise be caught by
  // a broader generic term below (e.g. "support").
  if (t.includes('mfa') || t.includes('credential')) return KeyRound
  if (t.includes('access')) return Lock
  if (t.includes('account')) return Users
  if (t.includes('approval')) return CheckCircle2
  if (t.includes('logging')) return ScrollText
  if (t.includes('removal')) return Trash2
  if (t.includes('document')) return FileText
  if (t.includes('scope')) return Layers
  if (t.includes('priority')) return Flag
  if (t.includes('escalation')) return ArrowUpCircle
  if (t.includes('response') || t.includes('resolution') || t.includes('target')) return Target
  if (t.includes('communication')) return MessageSquare
  if (t.includes('review')) return CalendarCheck
  if (t.includes('issue')) return CircleAlert
  if (t.includes('alert')) return AlertTriangle
  if (t.includes('device') || t.includes('status')) return MonitorCheck
  if (t.includes('project')) return FolderKanban
  // AV programming / control-system equipment keywords
  if (t.includes('projector')) return Projector
  if (t.includes('audio visual') || t.includes('video conferencing') || t.includes('video conference')) return Video
  if (t.includes('microphone') || t.includes('mic')) return Mic
  if (t.includes('speaker')) return Volume2
  if (t.includes('audio processor') || t.includes('processor')) return Sliders
  if (t.includes('switcher')) return Shuffle
  if (t.includes('presentation')) return Presentation
  if (t.includes('touch panel') || t.includes('touchscreen') || t.includes('touch screen')) return TabletSmartphone
  if (t.includes('motorized screen') || t.includes('screen') || t.includes('display')) return Monitor
  if (t.includes('lighting')) return Lightbulb
  // Smart building / building-automation keywords
  if (t.includes('room control') || t.includes('room automation')) return Cpu
  if (t.includes('automation')) return Settings2
  if (t.includes('building technology') || t.includes('technology integration')) return Network
  // Microsoft 365 / managed-IT cross-link keywords
  if (t.includes('managed it')) return Headset
  if (t.includes('azure')) return Server
  if (t.includes('outsourcing')) return Handshake
  if (t.includes('office')) return LayoutDashboard
  // Microsoft 365 application keywords
  if (t.includes('microsoft word')) return FileText
  if (t.includes('excel')) return FileSpreadsheet
  if (t.includes('powerpoint')) return Presentation
  if (t.includes('outlook')) return Mail
  if (t.includes('exchange')) return Mail
  if (t.includes('sharepoint')) return FolderOpen
  if (t.includes('onedrive')) return HardDrive
  if (t.includes('entra')) return KeyRound
  if (t.includes('intune')) return MonitorCheck
  if (t.includes('defender')) return ShieldCheck
  if (t.includes('purview')) return ClipboardList
  if (t.includes('microsoft 365')) return Cloud
  // IT security consultation keywords
  if (t.includes('infrastructure')) return Server
  if (t.includes('firewall')) return ShieldCheck
  if (t.includes('endpoint')) return MonitorCheck
  if (t.includes('email')) return Mail
  if (t.includes('cloud')) return Cloud
  if (t.includes('identit')) return Users
  if (t.includes('data protection')) return FileText
  if (t.includes('vulnerab')) return AlertTriangle
  if (t.includes('incident')) return CircleAlert
  // Microsoft 365 migration keywords
  if (t.includes('teams')) return MessageSquare
  if (t.includes('calendar')) return CalendarCheck
  if (t.includes('file share')) return FolderOpen
  if (t.includes('file server')) return Server
  if (t.includes('google workspace')) return Cloud
  if (t.includes('dropbox')) return FolderOpen
  // Azure workload keywords
  if (t.includes('virtual machine')) return Cpu
  if (t.includes('virtual desktop')) return Monitor
  if (t.includes('database')) return Database
  if (t.includes('analytics')) return Database
  if (t.includes('disaster recovery')) return RefreshCw
  if (t.includes('hybrid')) return Network
  if (t.includes('development')) return Settings2
  if (t.includes('container')) return Layers
  if (t.includes('application')) return Cpu
  // Data center / server room relocation keywords — checked first since they're
  // more specific than the generic terms below (e.g. "network core" vs "network").
  if (t.includes('server')) return Server
  if (t.includes('storage')) return HardDrive
  if (t.includes('asset') || t.includes('inventor')) return ClipboardList
  if (t.includes('disconnect')) return PlugZap
  if (t.includes('packed') || t.includes('transport')) return Truck
  if (t.includes('rack') || t.includes('cabinet')) return Layers
  if (t.includes('power') || t.includes('ups')) return Zap
  if (t.includes('cooling') || t.includes('environmental')) return Snowflake
  if (t.includes('connectivity')) return Activity
  if (t.includes('validated') || t.includes('validation')) return CheckCircle2
  if (t.includes('monitoring') || t.includes('sensor')) return Radar
  if (t.includes('handover')) return Handshake
  if (t.includes('cabling') || t.includes('cable')) return Cable
  if (t.includes('telephony') || t.includes('voip') || t.includes('phone')) return Phone
  if (t.includes('amc')) return Wrench
  if (t.includes('disposal') || t.includes('recycl')) return Recycle
  if (t.includes('network core')) return Network
  if (t.includes('troubleshoot')) return Wrench
  if (t.includes('configuration')) return Settings2
  if (t.includes('testing')) return Activity
  if (t.includes('replacement')) return RefreshCw
  if (t.includes('meeting-room') || t.includes('meeting room')) return Users
  if (t.includes('upgrade')) return TrendingUp
  if (t.includes('biometric')) return Fingerprint
  if (t.includes('controller')) return Cpu
  if (t.includes('access zone')) return Lock
  if (t.includes('centralized')) return LayoutDashboard
  if (t.includes('cctv')) return Camera
  if (t.includes('payroll')) return Banknote
  if (t.includes('maintenance')) return Wrench
  if (t.includes('health')) return Activity
  if (t.includes('network')) return Wifi
  if (t.includes('security')) return ShieldCheck
  if (t.includes('backup')) return HardDrive
  if (t.includes('support') || t.includes('assistance')) return Headset
  if (t.includes('ticket')) return Ticket
  if (t.includes('report')) return FileText
  if (t.includes('recommend') || t.includes('improvement')) return Lightbulb
  return CheckIcon as unknown as LucideIcon
}

function ChecklistGrid({ badge, title, subtitle, items, note, iconStyle, ctaText, ctaLabel, ctaUrl }: ScopeChecklistBlockProps) {
  const safeItems = items || []
  const hasDescriptions = safeItems.some((item) => item.description)
  const useKeywordIcons = iconStyle === 'keyword'

  return (
    <>
      <Reveal className="max-w-2xl mb-6">
        {badge && <Eyebrow>{badge}</Eyebrow>}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
      </Reveal>

      <Reveal
        delayMs={100}
        className={cn(
          'grid gap-3 md:gap-4',
          hasDescriptions
            ? safeItems.length === 4
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        )}
      >
        {safeItems.map((item, index) => {
          const cardClassName = cn(
            'rounded-xl border border-border bg-gray-50/60 transition-colors',
            hasDescriptions
              ? 'flex flex-col gap-3 p-5 text-left hover:border-primary_red/40 hover:bg-[#FDEBEC]/40'
              : 'flex items-center gap-2.5 px-4 py-3 hover:border-primary_red/40 hover:bg-[#FDEBEC]/40',
          )
          const KeywordIcon = useKeywordIcons ? getKeywordIcon(item.text) : null
          const logo = item.logo && typeof item.logo === 'object' ? (item.logo as Media) : null
          const iconEl = (
            <span
              className={cn(
                'flex flex-none items-center justify-center rounded-full',
                logo ? 'bg-white ring-1 ring-border' : 'bg-[#FDEBEC] text-primary_red',
                hasDescriptions ? 'h-10 w-10' : 'h-7 w-7',
              )}
            >
              {logo?.url ? (
                <Image
                  src={logo.url}
                  alt={logo.alt || item.text || ''}
                  width={hasDescriptions ? 22 : 16}
                  height={hasDescriptions ? 22 : 16}
                  className="h-auto w-auto max-h-[65%] max-w-[65%] object-contain"
                />
              ) : KeywordIcon ? (
                <KeywordIcon className={hasDescriptions ? 'h-5 w-5' : 'h-4 w-4'} />
              ) : (
                <CheckIcon />
              )}
            </span>
          )
          const titleEl = (
            <span className={cn(hasDescriptions ? 'text-base font-semibold text-foreground' : 'text-sm font-medium text-foreground')}>
              {item.text}
            </span>
          )
          const content = hasDescriptions ? (
            <>
              <div className="flex items-center gap-3">
                {iconEl}
                {titleEl}
              </div>
              {item.description && <span className="text-sm leading-relaxed text-gray-600">{item.description}</span>}
            </>
          ) : (
            <>
              {iconEl}
              {titleEl}
            </>
          )

          if (item.url) {
            return (
              <Link key={item.id || index} href={item.url} className={cardClassName}>
                {content}
              </Link>
            )
          }

          return (
            <div key={item.id || index} className={cardClassName}>
              {content}
            </div>
          )
        })}
      </Reveal>

      {note && <p className="mt-5 text-sm text-gray-500">{note}</p>}

      {ctaLabel && ctaUrl && (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          {ctaText && <p className="text-sm font-medium text-gray-600">{ctaText}</p>}
          <Link
            href={ctaUrl}
            className="inline-flex items-center gap-2 rounded-full bg-primary_red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </>
  )
}

// A dense, wrapped cloud of pill chips — for a broad illustrative list of
// examples ("a system can include: ...") that shouldn't compete visually
// with a fuller card-grid section elsewhere on the same page.
function TagCloud({ badge, title, subtitle, items, note }: ScopeChecklistBlockProps) {
  const safeItems = items || []

  return (
    <>
      <Reveal className="mx-auto mb-7 max-w-2xl text-center">
        {badge && <Eyebrow className="justify-center">{badge}</Eyebrow>}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>}
      </Reveal>

      <Reveal delayMs={100} className="rounded-3xl border border-border bg-gray-50/60 p-6 md:p-10">
        <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
          {safeItems.map((item, index) => {
            const chipClassName = cn(
              'inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors',
              item.url && 'hover:border-primary_red/40 hover:text-primary_red hover:bg-[#FDEBEC]/40',
            )
            const content = (
              <>
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#FDEBEC] text-primary_red">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {item.text}
              </>
            )

            if (item.url) {
              return (
                <Link key={item.id || index} href={item.url} className={chipClassName}>
                  {content}
                </Link>
              )
            }

            return (
              <span key={item.id || index} className={chipClassName}>
                {content}
              </span>
            )
          })}
        </div>
      </Reveal>

      {note && <p className="mt-5 text-center text-sm text-gray-500">{note}</p>}
    </>
  )
}

function MonthlyCadence({ badge, title, subtitle, items, note }: ScopeChecklistBlockProps) {
  const hasDescriptions = (items || []).some((item) => item.description)

  return (
    <Reveal className="overflow-hidden rounded-3xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_24px_50px_-24px_rgba(0,0,0,0.18)]">
      <div className="grid md:grid-cols-[300px_1fr]">
        <div className="relative flex flex-col justify-center gap-4 overflow-hidden bg-gradient-to-br from-[#1c1113] via-[#3a0f14] to-primary_red px-7 py-10 md:px-8">
          <RotateCw className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 text-white/[0.06]" strokeWidth={1.5} />
          {badge && <Eyebrow className="text-white/70">{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-[26px] font-semibold leading-tight text-white text-balance">{title}</h2>
          {subtitle && <p className="text-sm leading-relaxed text-white/70">{subtitle}</p>}
          {note && (
            <div className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white">
              <RotateCw className="h-3.5 w-3.5 flex-none" />
              {note}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3">
          {(items || []).map((item, index) => {
            const Icon = getKeywordIcon(item.text)
            const col = index % 3
            const row = Math.floor(index / 3)
            const isLastMobile = index === (items?.length ?? 0) - 1
            return (
              <div
                key={item.id || index}
                className={cn(
                  'flex gap-3 border-border px-6 py-5 transition-colors hover:bg-gray-50/80',
                  hasDescriptions ? 'items-start' : 'items-center',
                  !isLastMobile && 'border-b sm:border-b-0',
                  col > 0 && 'sm:border-l',
                  row > 0 && 'sm:border-t',
                )}
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#FDEBEC] text-primary_red">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <span className="text-sm font-semibold text-foreground">{item.text}</span>
                  {hasDescriptions && item.description && (
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Reveal>
  )
}

export const ScopeChecklistBlock: React.FC<Props> = (props) => {
  const { className, items = [], layoutStyle } = props
  if (!items || items.length === 0) return null

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        {layoutStyle === 'monthly' ? (
          <MonthlyCadence {...props} />
        ) : layoutStyle === 'tags' ? (
          <TagCloud {...props} />
        ) : (
          <ChecklistGrid {...props} />
        )}
      </div>
    </section>
  )
}
