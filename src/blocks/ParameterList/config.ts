import type { Block } from 'payload'

export const ParameterList: Block = {
  slug: 'parameterList',
  interfaceName: 'ParameterListBlock',
  labels: {
    singular: 'Parameter List',
    plural: 'Parameter Lists',
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
      label: 'Parameters',
      minRows: 2,
      admin: {
        description: 'Rendered as a borderless reference list — term on the left, description on the right, hairline dividers. No cards.',
      },
      fields: [
        { name: 'term', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
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
      defaultValue: '/contact',
    },
  ],
}
