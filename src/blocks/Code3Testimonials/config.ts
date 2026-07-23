import type { Block } from 'payload'

export const Code3Testimonials: Block = {
  slug: 'code3Testimonials',
  interfaceName: 'Code3TestimonialsBlock',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'CLIENT VOICES',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Trusted by IT managers, directors, and operations leaders',
    },
    {
      name: 'useGoogleReviews',
      type: 'checkbox',
      label: 'Pull live reviews from Google Places',
      defaultValue: true,
      admin: {
        description:
          'Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACES_ID env vars. Falls back to the quotes below if not configured or the fetch fails.',
      },
    },
    {
      name: 'fallbackQuotes',
      type: 'array',
      label: 'Fallback Quotes',
      minRows: 1,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
