export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
}

export async function getGoogleReviews(): Promise<GoogleReview[] | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACES_ID

  if (!apiKey || !placeId) return null

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId,
    )}&fields=reviews&reviews_sort=newest&key=${apiKey}`

    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null

    const data = await res.json()
    if (data.status !== 'OK' || !Array.isArray(data.result?.reviews)) return null

    return data.result.reviews.slice(0, 3).map((r: GoogleReview) => ({
      author_name: r.author_name,
      rating: r.rating,
      text: r.text,
      relative_time_description: r.relative_time_description,
    }))
  } catch {
    return null
  }
}
