import type { Block } from 'payload'

export const FlowShowcase: Block = {
  slug: 'flowShowcase',
  interfaceName: 'FlowShowcaseBlock',
  labels: {
    singular: 'Flow Showcase',
    plural: 'Flow Showcases',
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
      name: 'steps',
      type: 'array',
      label: 'Flow Steps',
      minRows: 2,
      maxRows: 8,
      admin: {
        description: 'Short labels only (1-4 words) — rendered as large connected nodes on a bold colored panel. Reserved for a single, important, eye-catching flow rather than a plain step list.',
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description (optional)',
          localized: true,
          admin: {
            description: 'Optional — adds a numbered detail breakdown below the flow panel once any step has one.',
          },
        },
      ],
    },
    {
      name: 'note',
      type: 'text',
      label: 'Note (optional)',
      localized: true,
      admin: { description: 'Shown below the flow, e.g. a compatibility disclaimer.' },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label (optional)',
      localized: true,
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA Button URL (optional)',
    },
  ],
}
