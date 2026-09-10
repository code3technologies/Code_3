import React from 'react'
import { CheckCircle2, Handshake, Smile, Users, type LucideIcon } from 'lucide-react'
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
        // When animated, this section paints nothing — the Service Detail
        // Banner above renders one tall background layer that bleeds down
        // behind here, so there is a single unbroken background.
        animatedBackground ? 'relative pb-14 pt-6 md:pb-20 md:pt-8' : 'bg-white pt-2 pb-8 md:pt-3 md:pb-10',
        className,
      )}
    >
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
