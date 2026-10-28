export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
}

export interface GoogleOpeningHoursSpec {
  dayOfWeek: string
  opens: string
  closes: string
}

export interface GoogleReviewsData {
  reviews: GoogleReview[]
  rating: number | null
  userRatingsTotal: number | null
  mapsUrl: string | null
  geo: { lat: number; lng: number } | null
  openingHours: GoogleOpeningHoursSpec[] | null
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Places API returns opening hours as "0900"/"1800" - schema.org's
// openingHoursSpecification wants "09:00"/"18:00".
const formatTime = (time: string) => `${time.slice(0, 2)}:${time.slice(2, 4)}`

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACES_ID

  if (!apiKey || !placeId) return null

  try {
    // Google caps the reviews field at 5 no matter what, with no pagination
    // available - so sort for substance (its "most relevant" default) rather
    // than "newest", which can surface a bare star rating with no comment
    // ahead of reviews that are worth showing. rating/user_ratings_total/url
    // give the overall "4.9 ★★★★★ 13 Google reviews" summary badge.
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId,
    )}&fields=reviews,rating,user_ratings_total,url,geometry,opening_hours&reviews_sort=most_relevant&key=${apiKey}`

    // Without a timeout, a slow/hanging Google Places API response blocks the
    // entire page's server render - cap it so a bad external call can't do that.
    const res = await fetch(url, {
      next: { revalidate: 3600, tags: ['google-reviews'] },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null

    const data = await res.json()
    if (data.status !== 'OK' || !data.result) return null

    const reviews = Array.isArray(data.result.reviews)
      ? data.result.reviews
          // Drop reviews with no real comment (e.g. a bare star rating) - not
          // "good content" even though they're genuine reviews.
          .filter((r: GoogleReview) => (r.text || '').trim().length >= 20)
          .map((r: GoogleReview) => ({
            author_name: r.author_name,
            rating: r.rating,
            text: r.text,
            relative_time_description: r.relative_time_description,
          }))
      : []

    const location = data.result.geometry?.location
    const geo =
      location && typeof location.lat === 'number' && typeof location.lng === 'number'
        ? { lat: location.lat, lng: location.lng }
        : null

    const periods = data.result.opening_hours?.periods
    const openingHours =
      Array.isArray(periods) && periods.length > 0
        ? periods
            // A place open 24/7 reports a single period with no `close` key at all.
            .filter((p: { open?: { day: number; time: string }; close?: { day: number; time: string } }) => p.open && p.close)
            .map((p: { open: { day: number; time: string }; close: { day: number; time: string } }) => ({
              dayOfWeek: DAY_NAMES[p.open.day],
              opens: formatTime(p.open.time),
              closes: formatTime(p.close.time),
            }))
        : null

    return {
      reviews,
      rating: typeof data.result.rating === 'number' ? data.result.rating : null,
      userRatingsTotal: typeof data.result.user_ratings_total === 'number' ? data.result.user_ratings_total : null,
      mapsUrl: typeof data.result.url === 'string' ? data.result.url : null,
      geo,
      openingHours: openingHours && openingHours.length > 0 ? openingHours : null,
    }
  } catch {
    return null
  }
}
