import type { Block } from 'payload'

export const PathCompare: Block = {
  slug: 'pathCompare',
  interfaceName: 'PathCompareBlock',
  labels: {
    singular: 'Path Compare',
    plural: 'Path Compares',
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
      name: 'variant',
      type: 'select',
      label: 'Style',
      defaultValue: 'flow',
      options: [
        { label: 'Flow — numbered steps joined by chevrons', value: 'flow' },
        { label: 'List — plain checklist items', value: 'list' },
      ],
      admin: { description: 'Use "List" when the items are situations or criteria rather than an ordered process.' },
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Paths',
      minRows: 2,
      maxRows: 3,
      admin: {
        description:
          'Each path renders as an equal-weight card with a numbered top-to-bottom step list. Use it for "either / or" journeys, not a good-vs-bad comparison.',
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption (optional)',
          localized: true,
          admin: { description: 'One line under the label, e.g. who this path is for.' },
        },
        {
          name: 'steps',
          type: 'array',
          label: 'Steps (top to bottom)',
          minRows: 2,
          fields: [{ name: 'text', type: 'text', required: true, localized: true }],
        },
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
