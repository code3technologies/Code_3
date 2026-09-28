// Explicit per-emirate areaServed entries for structured data (Organization,
// Service schema). A single "United Arab Emirates" Country entity is a much
// weaker local-relevance signal than naming each emirate CODE3 actually
// serves - this is what tells Google/AI answer engines to surface CODE3 for
// "IT support Abu Dhabi" style queries, not just generic/global ones.
export const UAE_EMIRATES_AREA_SERVED = [
  { '@type': 'City', name: 'Dubai' },
  { '@type': 'City', name: 'Abu Dhabi' },
  { '@type': 'City', name: 'Sharjah' },
  { '@type': 'City', name: 'Ajman' },
  { '@type': 'City', name: 'Umm Al Quwain' },
  { '@type': 'City', name: 'Ras Al Khaimah' },
  { '@type': 'City', name: 'Fujairah' },
] as const

export const UAE_AREA_SERVED = [
  ...UAE_EMIRATES_AREA_SERVED,
  { '@type': 'Country', name: 'United Arab Emirates' },
]
