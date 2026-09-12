import type { AVCategorySpotlightBlock as AVCategorySpotlightBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import {
  ArrowRight,
  Briefcase,
  Cast,
  GraduationCap,
  Image,
  Landmark,
  LayoutGrid,
  MessageSquare,
  Monitor,
  Music,
  Presentation,
  Video,
  Volume2,
  type LucideIcon,
} from 'lucide-react'

type Props = {
  className?: string
} & AVCategorySpotlightBlockProps

function CheckDot() {
  return <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-primary_red" />
}

function getCategoryIcon(text?: string | null): LucideIcon {
  const t = (text || '').toLowerCase()
  if (t.includes('boardroom')) return Briefcase
  if (t.includes('conference room')) return Presentation
  if (t.includes('meeting')) return MessageSquare
  if (t.includes('video conferencing')) return Video
  if (t.includes('interactive')) return Monitor
  if (t.includes('signage')) return Image
  if (t.includes('video wall')) return LayoutGrid
  if (t.includes('casting') || t.includes('wireless presentation')) return Cast
  if (t.includes('classroom')) return GraduationCap
  if (t.includes('auditorium')) return Landmark
  if (t.includes('pa ') || t.includes('speaker') || t.includes('public address')) return Volume2
  if (t.includes('background') || t.includes('multi-room audio') || t.includes('multi room audio')) return Music
  return Monitor
}

export const AVCategorySpotlightBlock: React.FC<Props> = ({
  className,
  badge,
  title,
  description,
  bulletsLabel,
  bullets = [],
  reverse,
  ctaLabel,
  ctaUrl,
}) => {
  const Icon = getCategoryIcon(title)
  const safeBullets = bullets || []

  return (
    <section className={cn('bg-white py-7 md:py-9', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <Reveal className={cn(reverse && 'md:order-last')}>
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDEBEC] text-primary_red">
              <Icon className="h-6 w-6" />
            </span>
            {badge && <Eyebrow>{badge}</Eyebrow>}
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
            {ctaLabel && ctaUrl && (
              <Link
                href={ctaUrl}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary_red/30 px-5 py-2.5 text-sm font-semibold text-primary_red transition-colors hover:bg-[#FDEBEC]"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </Reveal>

          {safeBullets.length > 0 && (
            <Reveal delayMs={100} className={cn(reverse && 'md:order-first')}>
              <div className="rounded-2xl border border-border bg-gray-50/60 p-6 md:p-7">
                {bulletsLabel && (
                  <div className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-400">{bulletsLabel}</div>
                )}
                <ul className="space-y-3">
                  {safeBullets.map((b, i) => (
                    <li key={b.id || i} className="flex items-start gap-3 text-sm text-foreground">
                      <CheckDot />
                      {b.text}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
