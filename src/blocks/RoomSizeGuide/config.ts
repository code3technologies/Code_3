import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const RoomSizeGuide: Block = {
  slug: 'roomSizeGuide',
  interfaceName: 'RoomSizeGuideBlock',
  labels: {
    singular: 'Room Size Guide',
    plural: 'Room Size Guides',
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
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    {
      name: 'rows',
      type: 'array',
      label: 'Room → Recommended Size',
      minRows: 2,
      fields: [
        { name: 'room', type: 'text', required: true, localized: true },
        { name: 'recommended', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Closing Guidance (optional)',
      localized: true,
      admin: {
        description: 'Shown centered below the table, e.g. "The right method depends on your workforce, environment, and existing infrastructure."',
      },
    },
    ...ctaFields('Talk to Our Experts'),
  ],
}
