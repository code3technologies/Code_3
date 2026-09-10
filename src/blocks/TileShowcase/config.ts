import type { Block } from 'payload'

export const TileShowcase: Block = {
  slug: 'tileShowcase',
  interfaceName: 'TileShowcaseBlock',
  labels: {
    singular: 'Tile Showcase',
    plural: 'Tile Showcases',
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
      label: 'Intro Line (optional)',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Tiles',
      minRows: 2,
      admin: {
        description: 'Rendered as a bold, alternating dark/red checkerboard tile grid — a deliberately different, high-contrast look from the white-card grids used elsewhere.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}
