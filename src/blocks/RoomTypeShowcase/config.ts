import type { Block } from 'payload'

export const RoomTypeShowcase: Block = {
  slug: 'roomTypeShowcase',
  interfaceName: 'RoomTypeShowcaseBlock',
  labels: {
    singular: 'Room Type Showcase',
    plural: 'Room Type Showcases',
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
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Spaces',
      minRows: 2,
      admin: {
        description: 'A horizontally scrolling strip of cards — one per room or space type. An icon is matched automatically by keyword.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
    },
    {
      name: 'note',
      type: 'text',
      label: 'Footer Note (optional)',
      localized: true,
    },
  ],
}
