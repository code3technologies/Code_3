import type { DetailedFeatureGridBlock as DetailedFeatureGridBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  Activity,
  AlertTriangle,
  Aperture,
  ArrowRight,
  Building2,
  Briefcase,
  Cable,
  CalendarDays,
  Camera,
  Car,
  Cloud,
  CloudSun,
  DraftingCompass,
  Factory,
  Fingerprint,
  Footprints,
  Globe,
  GraduationCap,
  Grid2x2,
  Home,
  Hotel,
  Laptop,
  LayoutDashboard,
  Layers,
  Lock,
  MapPin,
  Moon,
  Network,
  PencilRuler,
  Plug,
  Printer,
  Radar,
  RefreshCw,
  Route,
  Router,
  ScanEye,
  ScanLine,
  Server,
  ShieldCheck,
  Sparkles,
  Split,
  Stethoscope,
  Store,
  Sun,
  Thermometer,
  TrendingUp,
  Users,
  UsersRound,
  Utensils,
  Warehouse,
  Wifi,
  Wrench,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react'

// Best-effort icon per item, matched by keyword — mirrors RoomSizeGuide's
// camera-type mapping so the same item reads consistently across blocks.
function getItemIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  // Networking / infrastructure keywords (LAN & WAN pages) — checked first so
  // "design"/"approach" summary cards don't fall through to a camera icon.
  if (t.includes('how code3') || t.includes('code3 design') || t.includes('approach') || t.includes('designs your'))
    return DraftingCompass
  // Load balancing router feature keywords
  if (t.includes('wan port')) return Router
  if (t.includes('failover')) return RefreshCw
  if (t.includes('policy') || t.includes('routing')) return Route
  if (t.includes('health check')) return Activity
  if (t.includes('connection management')) return LayoutDashboard
  // Wi-Fi security keywords
  if (t.includes('authentication')) return Fingerprint
  if (t.includes('rogue')) return AlertTriangle
  if (t.includes('guest')) return Users
  // Wi-Fi / wireless environments (checked before the generic wi-fi rule)
  if (t.includes('warehouse')) return Warehouse
  if (t.includes('hospitality') || t.includes('hotel')) return Hotel
  if (t.includes('education') || t.includes('school') || t.includes('classroom') || t.includes('campus'))
    return GraduationCap
  if (t.includes('retail') || t.includes('store') || t.includes('shop')) return Store
  if (t.includes('restaurant') || t.includes('dining') || t.includes('cafe')) return Utensils
  if (t.includes('clinic') || t.includes('medical') || t.includes('healthcare') || t.includes('hospital ')) return Stethoscope
  if (t.includes('event')) return CalendarDays
  if (t.includes('commercial') || t.includes('building')) return Building2
  if (t.includes('industrial') || t.includes('factory') || t.includes('plant floor')) return Factory
  if (t.includes('high-density') || t.includes('high density') || t.includes('density')) return UsersRound
  if (t.includes('multi-floor') || t.includes('multi floor') || t.includes('floor')) return Layers
  if (t.includes('multi-site') || t.includes('multi site')) return Globe
  // Multi-floor / large-building Wi-Fi design keywords
  if (t.includes('placement')) return MapPin
  if (t.includes('coverage') || t.includes('overlap')) return Wifi
  if (t.includes('capacity')) return UsersRound
  if (t.includes('poe') || t.includes('power over ethernet')) return Plug
  if (t.includes('roaming')) return Footprints
  if (t.includes('centraliz') || t.includes('central management') || t.includes('controller'))
    return Server
  if (t.includes('small business') || t.includes('smb')) return Briefcase
  if (t.includes('corporate') || t.includes('office wi-fi') || t.includes('office wifi')) return Building2
  if (
    t.includes('cisco') ||
    t.includes('ubiquiti') ||
    t.includes('unifi') ||
    t.includes('ruijie') ||
    t.includes('aruba') ||
    t.includes('meraki')
  )
    return Wifi
  if (t.includes('wan monitor') || t.includes('network monitor') || t === 'monitoring') return Radar
  if (t.includes('firewall') || t.includes('threat')) return ShieldCheck
  if (t.includes('access control')) return Lock
  if (t.includes('secure') || t.includes('site-to-site') || t.includes('vpn')) return Lock
  if (t.includes('traffic')) return Network
  if (t.includes('internet')) return Globe
  if (
    t.includes('expansion') ||
    t.includes('expand') ||
    t.includes('scal') ||
    t.includes('grow') ||
    t.includes('optim')
  )
    return TrendingUp
  if (t.includes('installation') || t.includes('install')) return Wrench
  if (t.includes('design') || t.includes('architecture')) return PencilRuler
  if (t.includes('segment')) return Split
  if (t.includes('switch')) return Network
  if (t.includes('router')) return Router
  if (t.includes('access point') || t.includes('wi-fi') || t.includes('wifi') || t.includes('wireless'))
    return Wifi
  if (
    t.includes('ethernet') ||
    t.includes('cabling') ||
    t.includes('cat6') ||
    t.includes('cat 6') ||
    t.includes('fiber') ||
    t.includes('fibre')
  )
    return Cable
  if (t.includes('data center') || t.includes('datacenter') || t.includes('data centre')) return Server
  if (t.includes('server')) return Server
  if (t.includes('printer')) return Printer
  if (
    t.includes('end-user') ||
    t.includes('end user') ||
    t.includes('endpoint') ||
    t.includes('workstation') ||
    t.includes('laptop')
  )
    return Laptop
  if (t.includes('headquarter') || t.includes('head office')) return Building2
  if (t.includes('branch') || t.includes('office lan') || t.includes('office')) return Building2
  if (t.includes('remote site') || t.includes('remote')) return MapPin
  if (t.includes('cloud')) return Cloud
  if (t.includes('geographical') || t.includes('separated location') || t.includes('multi-site')) return Globe
  if (t.includes('connectivity') || t.includes('network')) return Network
  if (t.includes('dome')) return Building2
  if (t.includes('bullet')) return Sun
  if (t.includes('turret')) return Camera
  if (t.includes('ptz')) return ZoomIn
  if (t.includes('ai camera') || t.includes('ai-camera')) return Sparkles
  if (t.includes('anpr')) return Car
  if (t.includes('thermal')) return Thermometer
  if (t.includes('low-light') || t.includes('low light')) return Moon
  if (t.includes('outdoor')) return CloudSun
  if (t.includes('indoor')) return Home
  if (t.includes('intrusion')) return AlertTriangle
  if (t.includes('loiter')) return Footprints
  if (t.includes('people counting')) return Users
  if (t.includes('object detection')) return ScanEye
  if (t.includes('line crossing')) return ScanLine
  if (t.includes('area') || t.includes('zone monitoring')) return Grid2x2
  if (t.includes('vehicle detection')) return Car
  if (t.includes('unusual activity')) return Radar
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
