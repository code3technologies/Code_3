import type { Block } from 'payload'

export const DetailedFeatureGrid: Block = {
  slug: 'detailedFeatureGrid',
  interfaceName: 'DetailedFeatureGridBlock',
  labels: {
    singular: 'Detailed Feature Grid',
    plural: 'Detailed Feature Grids',
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
      label: 'Items',
      minRows: 2,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
        {
          name: 'applications',
          type: 'array',
          label: 'Common Applications (optional)',
          admin: {
            description:
              'Optional short bullet list shown under the description, e.g. specific locations or use cases this item is suited for.',
          },
          fields: [{ name: 'text', type: 'text', required: true, localized: true }],
        },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Item Link Label (optional)',
          localized: true,
          admin: { description: 'e.g. "Explore: AI Camera Solutions" — shown as a link at the bottom of this card.' },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          label: 'Item Link URL (optional)',
        },
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
