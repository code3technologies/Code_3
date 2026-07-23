import type { Block } from 'payload'

export const Code3Why: Block = {
  slug: 'code3Why',
  interfaceName: 'Code3WhyBlock',
  labels: {
    singular: 'Why Choose Us (Index Cards)',
    plural: 'Why Choose Us (Index Cards)',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'WHY BUSINESSES CHOOSE CODE3',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Certified expertise. Proactive support. Solutions built to scale.',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'indexLabel',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "01 / EXPERTISE"' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
