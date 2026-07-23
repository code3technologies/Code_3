import type { Block } from 'payload'

export const Code3Process: Block = {
  slug: 'code3Process',
  interfaceName: 'Code3ProcessBlock',
  labels: {
    singular: 'Delivery Process Timeline',
    plural: 'Delivery Process Timelines',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'OUR DELIVERY PROCESS',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'A proven approach to delivering technology excellence',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'stepLabel',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "STEP 01"' },
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
