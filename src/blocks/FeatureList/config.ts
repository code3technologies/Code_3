import type { Block } from 'payload'

export const FeatureList: Block = {
  slug: 'featureList',
  interfaceName: 'FeatureListBlock',
  labels: {
    singular: 'Feature List',
    plural: 'Feature Lists',
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
      label: 'Intro Line',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Features',
      minRows: 2,
      admin: {
        description: 'Rendered as a numbered two-column list with a large ghost numeral behind each icon — a deliberately different look from the bordered card grids used elsewhere.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
    },
    {
      name: 'footer',
      type: 'text',
      label: 'Footer Note (optional)',
      localized: true,
    },
  ],
}
