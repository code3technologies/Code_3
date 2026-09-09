import type { IconFeatureGridBlock as IconFeatureGridBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  Activity,
  AlertTriangle,
  AppWindow,
  Aperture,
  ArrowRight,
  ArrowRightLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  Cable,
  Calendar,
  Camera,
  Check,
  Car,
  Cloud,
  CloudMoon,
  Columns3,
  CreditCard,
  Crosshair,
  DoorOpen,
  Factory,
  Fence,
  FileText,
  Fingerprint,
  Footprints,
  Frame,
  GraduationCap,
  Grid2x2,
  Grid3x3,
  Hand,
  Handshake,
  HardDrive,
  Headset,
  Home,
  Image as ImageIcon,
  KeySquare,
  Laptop,
  Layers,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  ListVideo,
  Lock,
  Mail,
  Maximize2,
  Megaphone,
  Mic,
  Minimize2,
  Monitor,
  Moon,
  Music,
  Network,
  Palette,
  PenLine,
  Phone,
  Presentation,
  Printer,
  Projector,
  Radar,
  RefreshCw,
  Ruler,
  ScanEye,
  ScanFace,
  ScanLine,
  Server,
  Settings2,
  Share2,
  ShieldCheck,
  Signpost,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Speaker,
  Store,
  Sun,
  SunMedium,
  Tablet,
  Truck,
  User,
  Users,
  UtensilsCrossed,
  Video,
  Volume2,
  Warehouse,
  Wifi,
  Wrench,
  Zap,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per item, matched by keyword.
function getItemIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('workstation') || t.includes('desktop') || t.includes('laptop')) return Laptop
  if (t.includes('windows')) return AppWindow
  if (t.includes('macos') || t.includes('mac os')) return Laptop
  if (t.includes('chromeos') || t.includes('chrome os')) return Cloud
  if (t.includes('android')) return Tablet
  // Word-boundary match: bare `includes('ios')` would false-positive on "kiosk", "radios", "studios", etc.
  if (/\bios\b/.test(t)) return Smartphone
  if (t.includes('wi-fi') || t.includes('wifi')) return Wifi
  if (t.includes('network')) return Network
  if (t.includes('managed it')) return Settings2
  if (t.includes('it infrastructure')) return Server
  if (t.includes('audio visual')) return Video
  if (t.includes('backup') || t.includes('business continuity')) return HardDrive
  if (t.includes('security & surveillance') || t.includes('security and surveillance')) return Camera
  if (t.includes('server')) return Server
  if (t.includes('cloud')) return Cloud
  if (t.includes('cyber') || t.includes('security') || t.includes('firewall')) return ShieldCheck
  if (t.includes('ip cctv') || t.includes('ip-based cctv')) return Network
  if (t.includes('hd cctv')) return Video
  if (t.includes('ai-powered') || t.includes('ai powered')) return Sparkles
  if (t.includes('indoor cctv')) return Home
  if (t.includes('outdoor cctv')) return Sun
  if (t.includes('ptz')) return ZoomIn
  if (t.includes('nvr')) return Server
  if (t.includes('storage') || t.includes('retention')) return HardDrive
  if (t.includes('cctv monitoring')) return Monitor
  if (t.includes('remote viewing')) return Smartphone
  if (t.includes('commissioning') || t.includes('installation')) return Wrench
  if (t.includes('maintenance')) return Headset
  if (t.includes('configuration')) return Settings2
  if (t.includes('dome')) return Building2
  if (t.includes('bullet')) return Sun
  if (t.includes('restricted')) return Lock
  if (t.includes('delivery')) return Truck
  if (t.includes('resident')) return Home
  if (t.includes('staff')) return Users
  if (t.includes('multi-lane') || t.includes('multi lane')) return Columns3
  if (t.includes('authorized vehicle')) return Check
  if (t.includes('visitor vehicle')) return Users
  if (t.includes('watchlist')) return AlertTriangle
  if (t.includes('vehicle') || t.includes('anpr')) return Car
  if (t.includes('people detection') || t.includes('people counting')) return Users
  if (t.includes('intrusion')) return AlertTriangle
  if (t.includes('loiter')) return Footprints
  if (t.includes('object recognition') || t.includes('object detection')) return ScanEye
  if (t.includes('line crossing')) return ScanLine
  if (t.includes('unusual activity')) return Radar
  if (t.includes('night vision') || t.includes('ir camera') || t.includes('ir /')) return Moon
  if (t.includes('low-light') || t.includes('low light')) return CloudMoon
  if (t.includes('lighting-assisted') || t.includes('lighting assisted')) return Lightbulb
  if (t.includes('unauthorized')) return DoorOpen
  if (t.includes('perimeter breach') || t.includes('perimeter')) return Fence
  if (t.includes('occupancy')) return Users
  if (t.includes('certified')) return BadgeCheck
  if (t.includes('multi-vendor') || t.includes('multi vendor')) return Handshake
  if (t.includes('infrastructure experience')) return Server
  if (t.includes('av expertise')) return Video
  if (t.includes('remote support')) return Headset
  if (t.includes('on-site deployment') || t.includes('on site deployment')) return Wrench
  if (t.includes('project management')) return ListChecks
  if (t.includes('customer first')) return Users
  if (/^integrity$/.test(t.trim())) return ShieldCheck
  if (t.includes('technical excellence')) return Settings2
  if (t.includes('continuous improvement')) return RefreshCw
  if (t.includes('reliable service')) return Headset
  if (t.includes('night surveillance')) return Moon
  if (t.includes('parking')) return Car
  if (t.includes('warehouse')) return Warehouse
  if (t.includes('loading')) return Truck
  if (t.includes('gate communication')) return Mic
  if (t.includes('tenant')) return Building2
  if (t.includes('visitor')) return Users
  if (t.includes('entry') || t.includes('exit')) return DoorOpen
  if (t.includes('fingerprint')) return Fingerprint
  if (t.includes('facial recognition')) return ScanFace
  if (t.includes('rfid') || t.includes('access card')) return CreditCard
  if (t.includes('pin authentication') || t.includes('pin code')) return KeySquare
  if (t.includes('mobile credential')) return Smartphone
  if (t.includes('multi-factor') || t.includes('multi factor')) return Layers
  if (t.includes('boom barrier')) return Fence
  if (t.includes('sliding gate')) return DoorOpen
  if (t.includes('swing gate')) return ArrowRightLeft
  if (t.includes('bollard')) return Lock
  if (t.includes('industrial')) return Factory
  if (t.includes('integrated access control')) return Network
  if (t.includes('camera resolution')) return Aperture
  // Checked before the shorter "event-based recording" rule below, since
  // "Continuous or event-based recording" contains that phrase as a substring.
  if (t.includes('continuous or event')) return RefreshCw
  if (t.includes('continuous recording')) return RefreshCw
  if (t.includes('event-based recording') || t.includes('event based recording')) return Zap
  if (t.includes('motion-based recording') || t.includes('motion based recording')) return Footprints
  if (t.includes('recording mode')) return Video
  if (t.includes('frame rate')) return Activity
  if (t.includes('compression')) return Layers
  if (t.includes('recording day')) return Calendar
  if (t.includes('number of sites')) return Building2
  if (t.includes('platform-dependent') || t.includes('platform dependent')) return Settings2
  if (t.includes('gate automation')) return Fence
  if (t.includes('ai camera')) return Sparkles
  if (t.includes('+ intercom')) return Mic
  if (t.includes('cctv') || t.includes('access control') || t.includes('camera')) return Camera
  if (t.includes('remote authorization') || t.includes('remote authorisation')) return Smartphone
  if (t.includes('video intercom')) return Video
  if (t.includes('multi-unit') || t.includes('multi unit')) return Building2
  if (t.includes('gate intercom')) return DoorOpen
  if (t.includes('ip intercom')) return Network
  if (t.includes('intercom')) return Mic
  if (t.includes('contractor')) return Wrench
  if (t.includes('printer') || t.includes('peripheral')) return Printer
  if (t.includes('present')) return Presentation
  if (t.includes('collaborate')) return Users
  if (t.includes('annotate')) return PenLine
  if (t.includes('video wall')) return Grid3x3
  if (t.includes('direct view')) return Maximize2
  if (t.includes('fine-pitch') || t.includes('fine pitch')) return ZoomIn
  if (t.includes('business projector')) return Briefcase
  if (t.includes('short-throw') || t.includes('short throw')) return Minimize2
  if (t.includes('laser')) return Zap
  if (t.includes('high-brightness') || t.includes('high brightness')) return SunMedium
  if (t.includes('large venue')) return Building2
  if (t.includes('interactive projector')) return Hand
  if (t.includes('projection') || t.includes('projector')) return Projector
  if (t.includes('2 × 2') || t.includes('2x2') || t.includes('2 x 2')) return Grid2x2
  if (t.includes('3 × 3') || t.includes('3x3') || t.includes('3 x 3')) return Grid3x3
  if (t.includes('4 × 4') || t.includes('4x4') || t.includes('4 x 4')) return LayoutGrid
  if (/\bcustom\b/.test(t)) return Settings2
  if (t.includes('screen size')) return Maximize2
  if (t.includes('room size')) return Home
  if (t.includes('ambient light')) return Lightbulb
  if (t.includes('viewing distance') || t.includes('distance')) return Ruler
  if (t.includes('room dimension') || t.includes('dimension')) return Building2
  if (t.includes('resolution')) return Aperture
  if (t.includes('bezel')) return Frame
  if (t.includes('alignment')) return Crosshair
  if (t.includes('brightness')) return SunMedium
  if (t.includes('color')) return Palette
  if (t.includes('calibrat')) return SlidersHorizontal
  if (t.includes('mounting')) return Wrench
  if (t.includes('traffic speed') || t.includes('vehicle speed')) return Zap
  if (t.includes('lane')) return Columns3
  if (t.includes('lighting')) return Lightbulb
  if (t.includes('plate visibility') || t.includes('plate-reading')) return ScanEye
  if (t.includes('entry/exit angle') || t.includes('camera angle')) return Crosshair
  if (t.includes('weather')) return Sun
  if (t.includes('outdoor')) return Sun
  if (t.includes('indoor')) return Home
  if (t.includes('menu board') || t.includes('menu')) return UtensilsCrossed
  if (t.includes('reception')) return DoorOpen
  if (t.includes('wayfinding')) return Signpost
  if (t.includes('corporate communication')) return Building2
  if (t.includes('retail')) return Store
  if (t.includes('kiosk') || t.includes('touchscreen')) return Tablet
  if (t.includes('led display') || t.includes('led screen')) return Lightbulb
  if (t.includes('multi-screen') || t.includes('multi screen')) return Columns3
  if (t.includes('interactive')) return Hand
  if (t.includes('screen group')) return Grid2x2
  if (t.includes('evacuation')) return AlertTriangle
  if (t.includes('paging')) return Megaphone
  if (t.includes('single-zone') || t.includes('single zone')) return Home
  if (t.includes('multi-location') || t.includes('multi location')) return Building2
  if (t.includes('centralized') || t.includes('central')) return Settings2
  if (t.includes('zoned') || t.includes('zone')) return Grid2x2
  if (t.includes('background music') || t.includes('music')) return Music
  if (t.includes('ip-based') || t.includes('ip based')) return Network
  if (t.includes('ceiling')) return Aperture
  if (t.includes('commercial')) return Building2
  if (t.includes('microphone')) return Mic
  if (t.includes('speaker')) return Speaker
  if (t.includes('amplifier') || t.includes('volume')) return Volume2
  if (t.includes('audio controller')) return SlidersHorizontal
  if (t.includes('promotion')) return Megaphone
  if (t.includes('schedule')) return Calendar
  if (t.includes('playlist')) return ListVideo
  if (t.includes('update')) return RefreshCw
  if (t.includes('image')) return ImageIcon
  if (t.includes('meeting') || t.includes('video')) return Video
  if (t.includes('content')) return FileText
  if (t.includes('usage')) return Activity
  if (t.includes('teach')) return GraduationCap
  if (t.includes('365') || t.includes('microsoft') || t.includes('email')) return Mail
  if (t.includes('communication') || t.includes('phone') || t.includes('voip') || t.includes('call')) return Phone
  if (t.includes('cabling') || t.includes('cable') || t.includes('source')) return Cable
  if (t.includes('user') || t.includes('account')) return User
  if (t.includes('share')) return Share2
  return LayoutGrid
}

type Props = {
  className?: string
} & IconFeatureGridBlockProps

export const IconFeatureGridBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  subtitle,
  items = [],
  footer,
  ctaLabel,
  ctaUrl,
}) => {
  const safeItems = items || []
  if (safeItems.length === 0) return null
  const hasDescriptions = safeItems.some((item) => item.description)

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
            'mx-auto grid max-w-5xl gap-3 md:gap-4',
            hasDescriptions
              ? cn('grid-cols-1 sm:grid-cols-2', safeItems.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')
              : cn(
                  'grid-cols-2 sm:grid-cols-3',
                  safeItems.length <= 4 ? 'md:grid-cols-4' : safeItems.length <= 6 ? 'md:grid-cols-6' : 'md:grid-cols-5',
                ),
          )}
        >
          {safeItems.map((item, index) => {
            const Icon = getItemIcon(item.text)
            const cardClassName = cn(
              'group flex rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary_red/30 hover:shadow-md',
              hasDescriptions ? 'flex-col gap-2 p-5 text-left' : 'flex-col items-center gap-2.5 p-4 text-center md:p-5',
            )
            const inner = (
              <>
                <span
                  className={cn(
                    'flex flex-none items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red transition-transform duration-300 group-hover:scale-105',
                    hasDescriptions ? 'h-12 w-12' : 'h-11 w-11',
                  )}
                >
                  <Icon className={hasDescriptions ? 'h-6 w-6' : 'h-5 w-5'} />
                </span>
                <span className="text-sm font-semibold leading-snug text-foreground">{item.text}</span>
                {item.description && (
                  <span className="text-sm leading-relaxed text-gray-600">{item.description}</span>
                )}
              </>
            )

            if (item.url) {
              return (
                <Link key={item.id || index} href={item.url} className={cardClassName}>
                  {inner}
                </Link>
              )
            }

            return (
              <div key={item.id || index} className={cardClassName}>
                {inner}
              </div>
            )
          })}
        </Reveal>

        {footer && (
          <Reveal delayMs={150} className="mx-auto mt-6 max-w-2xl text-center md:mt-7">
            <p className="text-gray-600 leading-relaxed">{footer}</p>
          </Reveal>
        )}

        {ctaLabel && ctaUrl && (
          <div className="mt-6 flex flex-col items-center gap-3 text-center md:mt-7">
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
