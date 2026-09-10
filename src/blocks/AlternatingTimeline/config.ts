import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const AlternatingTimeline: Block = {
  slug: 'alternatingTimeline',
  interfaceName: 'AlternatingTimelineBlock',
  labels: {
    singular: 'Alternating Timeline',
    plural: 'Alternating Timelines',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro / Disclaimer Line',
      localized: true,
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      minRows: 2,
      maxRows: 8,
      admin: {
        description: 'Rendered as a spacious, alternating left/right timeline connected by a central spine — a deliberately different, more editorial look for an important sequential story.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
    },
    ...ctaFields(''),
  ],
}
