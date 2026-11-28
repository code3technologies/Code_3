'use client'

import React, { useEffect, useState } from 'react'

import { TestimonialCard, type TestimonialCardData } from './TestimonialCard'

// The scrolling row needs three copies of the reviews to loop seamlessly, but
// rendering all three on the server put every review in the HTML three times,
// which reads as boilerplate to Google and AI crawlers. The server now sends one
// copy; the two loop copies (hidden from screen readers) and the scroll
// animation are added in the browser once the page has loaded.
export const TestimonialTrack: React.FC<{ cards: TestimonialCardData[] }> = ({ cards }) => {
  const [looping, setLooping] = useState(false)
  useEffect(() => setLooping(true), [])

  const copies = looping && cards.length > 0 ? 3 : 1

  return (
    <div
      className={
        looping
          ? 'flex items-stretch gap-6 animate-scroll-veryslow hover:[animation-play-state:paused]'
          : 'flex items-stretch gap-6'
      }
      style={{ width: 'max-content' }}
    >
      {Array.from({ length: copies }).flatMap((_, copy) =>
        cards.map((t, i) => (
          <div
            key={`${copy}-${t.name}-${i}`}
            className="w-[320px] sm:w-[380px] flex-none"
            aria-hidden={copy > 0 ? true : undefined}
          >
            <TestimonialCard t={t} />
          </div>
        )),
      )}
    </div>
  )
}
