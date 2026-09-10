import React from 'react'
import Link from 'next/link'
import { Camera, Cctv, HardDrive, Monitor, ScanEye, Video, type LucideIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'

interface ServiceDetailBannerBlockProps {
  serviceName?: string
  title?: string
  description?: string
  showGradientLine?: boolean
  animatedBackground?: boolean
  className?: string
  serviceBadge?: string
  backLinkLabel?: string
  backLinkUrl?: string
  cardBadge?: string
  cardHeading?: string
  cardDescription?: string
  cardLinkText?: string
  cardLinkHref?: string
}

type Props = ServiceDetailBannerBlockProps

// Purely decorative — a handful of thin outlined CCTV icons drifting through
// the hero's open background space, mirroring the homepage hero treatment.
function FloatingCctvIcons() {
  const icons: { Icon: LucideIcon; style: React.CSSProperties; duration: string; delay: string }[] = [
    { Icon: Cctv, style: { top: '12%', left: '54%' }, duration: '18s', delay: '0s' },
    { Icon: Camera, style: { top: '16%', right: '7%' }, duration: '22s', delay: '-5s' },
    { Icon: ScanEye, style: { top: '56%', left: '61%' }, duration: '20s', delay: '-10s' },
    { Icon: HardDrive, style: { bottom: '16%', left: '3%' }, duration: '24s', delay: '-3s' },
    { Icon: Monitor, style: { bottom: '12%', right: '32%' }, duration: '19s', delay: '-8s' },
    { Icon: Video, style: { top: '40%', left: '2%' }, duration: '21s', delay: '-14s' },
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

export const ServiceDetailBannerBlock: React.FC<Props> = ({
  className,
  serviceBadge,
  serviceName,
  title,
  description,
  animatedBackground,
  backLinkLabel,
  backLinkUrl,
  cardBadge,
  cardHeading,
  cardDescription,
  cardLinkText,
  cardLinkHref,
}) => {
  const showCard = Boolean(cardHeading)

  const content = (
    <div className={cn('grid gap-10', showCard && 'lg:grid-cols-[1fr_360px] lg:items-start')}>
      <Reveal className={cn('max-w-2xl', !showCard && 'lg:max-w-[calc(100%-420px)]')}>
        {backLinkLabel && backLinkUrl && (
          <Link
            href={backLinkUrl}
            className={cn(
              'mb-3 flex w-fit items-center gap-1.5 text-sm font-medium transition-colors',
              animatedBackground
                ? 'text-white/60 hover:text-white'
                : 'text-gray-500 hover:text-primary_red',
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {backLinkLabel}
          </Link>
        )}
        {(serviceBadge || serviceName) && (
          <Eyebrow className={cn(animatedBackground && 'text-red-300')}>{serviceBadge || serviceName}</Eyebrow>
        )}
        <h1
          className={cn(
            'text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight',
            animatedBackground ? 'text-white' : 'text-foreground',
          )}
        >
          {title || serviceName}
        </h1>
        {description && (
          <p className={cn('mt-4 leading-relaxed', animatedBackground ? 'text-white/80' : 'text-gray-600')}>
            {description}
          </p>
        )}
      </Reveal>

      {showCard && (
        <Reveal delayMs={100}>
          <div
            className={cn(
              'rounded-2xl p-8 md:p-10',
              animatedBackground ? 'border border-white/15 bg-white/10 backdrop-blur-sm' : 'bg-gray-50',
            )}
          >
            {cardBadge && (
              <span
                className={cn(
                  'text-sm md:text-base font-semibold uppercase tracking-[0.12em]',
                  animatedBackground ? 'text-red-300' : 'text-primary_red',
                )}
              >
                {cardBadge}
              </span>
            )}
            <h2
              className={cn(
                'mt-3 text-2xl md:text-3xl font-bold tracking-tight',
                animatedBackground ? 'text-white' : 'text-foreground',
              )}
            >
              {cardHeading}
            </h2>
            {cardDescription && (
              <p className={cn('mt-4 leading-relaxed', animatedBackground ? 'text-white/75' : 'text-gray-600')}>
                {cardDescription}
              </p>
            )}
            {cardLinkText && cardLinkHref && (
              <a
                href={cardLinkHref}
                className={cn(
                  'mt-6 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
                  animatedBackground
                    ? 'border-white/20 bg-white/10 text-white hover:border-white/50'
                    : 'border-border bg-white text-foreground hover:border-primary_red hover:text-primary_red',
                )}
              >
                {cardLinkText}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            )}
          </div>
        </Reveal>
      )}
    </div>
  )

  if (!animatedBackground) {
    return (
      <section className={cn('bg-white pt-8 pb-2 md:pt-10 md:pb-3', className)}>
        <div className="container mx-auto px-4 sm:px-6">{content}</div>
      </section>
    )
  }

  return (
    <section className={cn('relative w-full py-12 md:py-16', className)}>
      {/* Base layer — gradient + dot grid — deliberately taller than this
          section so it bleeds down behind the ServiceOverview block below
          (which renders transparent), giving one uninterrupted background
          from the top of the hero to just before the Stats block. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1600px] max-h-[220vh]">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #b3121f 0%, #8b0f1f 32%, #4a101a 60%, #1a0808 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Decorative motion layers — clipped to this section */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-drift absolute -right-24 -top-32 h-[32rem] w-[32rem] rounded-full bg-white/20 blur-[130px]"
          style={{ animationDuration: '16s' }}
        />
        <div
          className="animate-drift absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-black/30 blur-[120px]"
          style={{ animationDuration: '20s', animationDelay: '-6s' }}
        />
        <div
          className="animate-drift absolute right-0 top-1/3 h-[26rem] w-[26rem] rounded-full bg-secondary_red/25 blur-[150px]"
          style={{ animationDuration: '24s', animationDelay: '-12s' }}
        />
        <div
          className="animate-streak-sway absolute -top-1/4 left-[8%] h-[180%] w-20 bg-gradient-to-b from-transparent via-white/[0.07] to-transparent"
          style={{ animationDuration: '13s' }}
        />
        <div
          className="animate-streak-sway absolute -top-1/4 left-[40%] h-[180%] w-12 bg-gradient-to-b from-transparent via-white/[0.05] to-transparent"
          style={{ animationDuration: '17s', animationDelay: '-4s' }}
        />
        <div
          className="animate-streak-sway absolute -top-1/4 left-[70%] h-[180%] w-28 bg-gradient-to-b from-transparent via-secondary_red/[0.25] to-transparent"
          style={{ animationDuration: '15s', animationDelay: '-9s' }}
        />
      </div>

      <FloatingCctvIcons />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">{content}</div>
    </section>
  )
}
