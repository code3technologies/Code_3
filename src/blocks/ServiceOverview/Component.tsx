import React from 'react'
import {
  Camera,
  Cctv,
  CheckCircle2,
  HardDrive,
  Handshake,
  Monitor,
  ScanEye,
  Smile,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/site/Reveal'

interface ServiceOverviewProps {
  badge?: string
  title?: string
  description?: string
  image?: string | MediaType | null
  highlights?: { value?: string | null; label?: string | null; id?: string | null }[] | null
  animatedBackground?: boolean
  // Most service pages pair this block with a QuickEnquiry form that floats
  // absolutely over the top-right of the page, so the text column normally
  // needs to stay narrow even without an image to avoid running under it.
  // Standalone pages (e.g. About Us) with no such sidebar should pass false
  // to use the full width instead of leaving a dead gap on the right.
  reserveSidebarSpace?: boolean
  className?: string
}

// Decorative CCTV icons drifting through the dark background, continuing
// the treatment from the Service Detail Banner above.
function FloatingCctvIcons() {
  const icons: { Icon: LucideIcon; style: React.CSSProperties; duration: string; delay: string }[] = [
    { Icon: Cctv, style: { top: '18%', right: '10%' }, duration: '19s', delay: '-2s' },
    { Icon: Video, style: { bottom: '16%', left: '4%' }, duration: '23s', delay: '-9s' },
    { Icon: ScanEye, style: { top: '55%', right: '32%' }, duration: '21s', delay: '-13s' },
    { Icon: Camera, style: { top: '24%', left: '46%' }, duration: '18s', delay: '-6s' },
    { Icon: HardDrive, style: { bottom: '22%', right: '4%' }, duration: '22s', delay: '-4s' },
    { Icon: Monitor, style: { top: '10%', left: '10%' }, duration: '20s', delay: '-11s' },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
      {icons.map(({ Icon, style, duration, delay }, i) => (
        <Icon
          key={i}
          strokeWidth={1}
          className="animate-drift absolute h-9 w-9 text-white/[0.09]"
          style={{ ...style, animationDuration: duration, animationDelay: delay }}
        />
      ))}
    </div>
  )
}

// Best-effort icon per highlight label, matched by keyword - mirrors the
// same real stats and icon choices already used in the site's heroes.
function getHighlightIcon(label?: string | null): LucideIcon {
  const t = (label || '').toLowerCase()
  if (t.includes('partner')) return Handshake
  if (t.includes('project')) return CheckCircle2
  if (t.includes('customer') || t.includes('client')) return Smile
  return Users
}

const ServiceOverviewComponent: React.FC<ServiceOverviewProps> = ({
  className,
  badge,
  title,
  description,
  image,
  highlights,
  animatedBackground,
  reserveSidebarSpace = true,
}) => {
  const hasImage = !!image && typeof image === 'object'
  const safeHighlights = !hasImage ? highlights || [] : []
  const hasHighlights = safeHighlights.length > 0
  const hasSideContent = hasImage || hasHighlights

  return (
    <section
      className={cn(
        animatedBackground ? 'relative overflow-hidden pb-14 pt-6 md:pb-20 md:pt-8' : 'bg-white pt-2 pb-8 md:pt-3 md:pb-10',
        className,
      )}
    >
      {animatedBackground && (
        <>
          {/* Starts on exactly the banner's bottom tone (#2d0e0e) and eases
              darker, so the seam between the two sections is invisible */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, #2d0e0e 0%, #230a0a 55%, #1a0808 100%)' }}
          />
          <div
            aria-hidden
            className="animate-drift pointer-events-none absolute -left-24 top-0 h-[26rem] w-[26rem] rounded-full bg-secondary_red/20 blur-[140px]"
            style={{ animationDuration: '22s' }}
          />
          <div
            aria-hidden
            className="animate-drift pointer-events-none absolute -bottom-40 right-0 h-[24rem] w-[24rem] rounded-full bg-white/10 blur-[130px]"
            style={{ animationDuration: '18s', animationDelay: '-7s' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="animate-streak-sway absolute -top-1/4 left-[14%] h-[180%] w-16 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent"
              style={{ animationDuration: '16s', animationDelay: '-3s' }}
            />
            <div
              className="animate-streak-sway absolute -top-1/4 left-[62%] h-[180%] w-24 bg-gradient-to-b from-transparent via-secondary_red/[0.22] to-transparent"
              style={{ animationDuration: '14s', animationDelay: '-8s' }}
            />
          </div>
          <FloatingCctvIcons />
        </>
      )}
      <div className={cn('container mx-auto px-4 sm:px-6', animatedBackground && 'relative z-10')}>
        <div className={cn('flex flex-col items-start gap-6', hasSideContent && 'md:flex-row md:gap-8')}>
          <Reveal
            className={cn(
              'flex flex-1 flex-col items-start gap-4 text-left',
              !hasSideContent && reserveSidebarSpace && 'lg:max-w-[calc(100%-420px)]',
            )}
          >
            {badge && (
              <span className="inline-block w-max rounded-full border border-secondary_red bg-primary_red px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white">
                {badge}
              </span>
            )}
            <h2
              className={cn(
                'text-3xl font-bold leading-tight md:text-4xl',
                animatedBackground ? 'text-white' : 'text-gray-900',
              )}
            >
              {title}
            </h2>
            {description && (
              <div
                className={cn(
                  'max-w-3xl space-y-4 text-base md:text-lg',
                  animatedBackground ? 'text-white/75' : 'text-gray-600',
                  hasSideContent && 'max-w-lg',
                  !hasSideContent && 'max-w-none',
                )}
              >
                {/* Blank-line-separated paragraphs render as distinct <p> tags
                    instead of one run-on block - a single-paragraph
                    description (the common case) still renders exactly as
                    before, just wrapped in one extra div. */}
                {description.split(/\n\s*\n/).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}
          </Reveal>

          {hasImage && (
            <Reveal delayMs={100} className="flex-1">
              <Media resource={image!} imgClassName="w-full h-full rounded-[2rem] object-cover" />
            </Reveal>
          )}

          {!hasImage && hasHighlights && (
            <Reveal delayMs={100} className="grid w-full flex-none grid-cols-2 gap-4 md:w-auto">
              {safeHighlights.map((stat, i) => {
                const Icon = getHighlightIcon(stat.label)
                return (
                  <div
                    key={stat.id || i}
                    className={cn(
                      'flex w-full flex-col items-start gap-2 rounded-2xl border p-5 md:w-40',
                      animatedBackground ? 'border-white/15 bg-white/10' : 'border-border bg-[#FDEBEC]/40',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-10 w-10 flex-none items-center justify-center rounded-full',
                        animatedBackground ? 'bg-white/15 text-white' : 'bg-primary_red/10 text-primary_red',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className={cn('text-2xl font-bold leading-none', animatedBackground ? 'text-white' : 'text-gray-900')}>
                      {stat.value}
                    </div>
                    <div className={cn('text-xs font-medium leading-snug', animatedBackground ? 'text-white/60' : 'text-gray-500')}>
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

const ServiceOverviewBlock: React.FC<ServiceOverviewProps> = (props) => {
  return <ServiceOverviewComponent {...props} />
}

export { ServiceOverviewBlock }
