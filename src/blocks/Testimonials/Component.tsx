import React from 'react'
import type { TestimonialsBlock as TestimonialsBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Reveal } from '@/components/site/Reveal'
import { getGoogleReviews } from './getGoogleReviews'
import { TestimonialCard } from './TestimonialCard'
import { GoogleRatingBadge } from './GoogleRatingBadge'
import { CtaButton } from '@/components/site/CtaButton'

type Props = {
  className?: string
} & TestimonialsBlockProps

const FALLBACK_QUOTES = [
  {
    quote:
      'CODE3 has been a reliable technology partner for our organization. Their proactive approach and rapid response significantly improved the stability of our IT environment.',
    name: 'IT Manager',
    role: 'UAE-Based Enterprise',
  },
  {
    quote:
      'The team demonstrated exceptional professionalism throughout the project. From consultation to implementation, every stage was delivered efficiently and exceeded expectations.',
    name: 'Operations Manager',
    role: 'Retail Sector',
  },
  {
    quote:
      "CODE3's expertise in IT infrastructure and cybersecurity has strengthened our technology environment while ensuring uninterrupted business operations.",
    name: 'Director',
    role: 'Healthcare Organization',
  },
]

export const TestimonialsBlock: React.FC<Props> = async ({
  className,
  badge = 'CLIENT VOICES',
  title,
  useGoogleReviews = true,
  fallbackQuotes,
  ctaText,
  ctaLabel,
  ctaUrl,
}) => {
  const googleReviews = useGoogleReviews ? await getGoogleReviews() : null

  const cards: { quote: string; name: string; role: string; rating?: number; isGoogle?: boolean }[] =
    googleReviews && googleReviews.reviews.length > 0
      ? googleReviews.reviews.map((r) => ({
          quote: r.text,
          name: r.author_name,
          role: r.relative_time_description || '',
          rating: r.rating,
          isGoogle: true,
        }))
      : fallbackQuotes && fallbackQuotes.length > 0
        ? fallbackQuotes
        : FALLBACK_QUOTES

  // Duplicate the list so the marquee loop is seamless (matches the TrustedBrands pattern).
  const duplicatedCards = cards.length > 0 ? [...cards, ...cards, ...cards] : cards

  return (
    <section className={cn('bg-white py-8 md:py-10 overflow-hidden', className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-10">
          {badge && <Eyebrow>{badge}</Eyebrow>}
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
          {googleReviews && typeof googleReviews.rating === 'number' && (
            <GoogleRatingBadge
              rating={googleReviews.rating}
              userRatingsTotal={googleReviews.userRatingsTotal}
              mapsUrl={googleReviews.mapsUrl}
              className="mt-4"
            />
          )}
        </Reveal>
      </div>

      <Reveal delayMs={100} className="relative w-full">
        {/* Gradient fade masks */}
        <div className="absolute -left-1 top-0 w-16 md:w-24 h-full bg-gradient-to-r from-white via-white/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute -right-1 top-0 w-16 md:w-24 h-full bg-gradient-to-l from-white via-white/30 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <div
            className="flex items-stretch gap-6 animate-scroll-veryslow hover:[animation-play-state:paused]"
            style={{ width: 'max-content' }}
          >
            {duplicatedCards.map((t, i) => (
              <div key={t.name + i} className="w-[320px] sm:w-[380px] flex-none">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="container mx-auto px-4 sm:px-6">
        <CtaButton text={ctaText} label={ctaLabel} url={ctaUrl} className="mt-8" />
      </div>
    </section>
  )
}
