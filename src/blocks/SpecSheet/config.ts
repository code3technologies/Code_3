import type { Block } from 'payload'

export const SpecSheet: Block = {
  slug: 'specSheet',
  interfaceName: 'SpecSheetBlock',
  labels: {
    singular: 'Spec Sheet',
    plural: 'Spec Sheets',
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
      label: 'Spec Rows',
      minRows: 2,
      admin: {
        description: 'Rendered as a technical datasheet — numbered rows on a blueprint-grid panel, two columns on desktop.',
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
