import type { Block } from 'payload'

export const SolutionRail: Block = {
  slug: 'solutionRail',
  interfaceName: 'SolutionRailBlock',
  labels: {
    singular: 'Solution Rail',
    plural: 'Solution Rails',
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
      label: 'Solutions',
      minRows: 2,
      admin: {
        description: 'Rendered as a horizontally scrolling card rail — a deliberately different look from the grid/list blocks used elsewhere.',
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
