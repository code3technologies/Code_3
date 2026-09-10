import type { Block } from 'payload'

export const ChecklistCard: Block = {
  slug: 'checklistCard',
  interfaceName: 'ChecklistCardBlock',
  labels: {
    singular: 'Checklist Card',
    plural: 'Checklist Cards',
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
      label: 'Items',
      minRows: 2,
      admin: {
        description: 'Rendered as a single unified checklist card with striped rows — a deliberately different look from the separate-card grids used elsewhere.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', label: 'Description (optional)', localized: true },
      ],
    },
    {
      name: 'note',
      type: 'text',
      label: 'Disclaimer Note (optional)',
      localized: true,
      admin: { description: 'Shown as a highlighted bar at the bottom of the card, e.g. a compatibility disclaimer.' },
    },
  ],
}
