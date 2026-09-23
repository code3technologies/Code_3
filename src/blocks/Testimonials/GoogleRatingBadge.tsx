import React from 'react'
import { cn } from '@/utilities/ui'

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? '#FBBC05' : 'none'}
      stroke={filled ? '#FBBC05' : '#D4D4D8'}
      strokeWidth="1.5"
      className="h-5 w-5"
    >
      <path d="M12 2.5l2.9 6.1 6.6.8-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.1 1.2-6.6-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4 flex-none">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  )
}

export function GoogleRatingBadge({
  rating,
  userRatingsTotal,
  mapsUrl,
  className,
}: {
  rating: number
  userRatingsTotal: number | null
  mapsUrl: string | null
  className?: string
}) {
  const content = (
    <>
      <span className="text-2xl font-bold text-foreground">{rating.toFixed(1)}</span>
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < Math.round(rating)} />
        ))}
      </span>
      {typeof userRatingsTotal === 'number' && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 group-hover:text-primary_red">
          <GoogleIcon />
          Google reviews
        </span>
      )}
    </>
  )

  const rootClassName = cn('group inline-flex items-center gap-2.5', className)

  if (mapsUrl) {
    return (
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={rootClassName}>
        {content}
      </a>
    )
  }

  return <div className={rootClassName}>{content}</div>
}
