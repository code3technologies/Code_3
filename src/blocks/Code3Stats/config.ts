import type { Block } from 'payload'

export const Code3Stats: Block = {
  slug: 'code3Stats',
  interfaceName: 'Code3StatsBlock',
  labels: {
    singular: 'Stats Strip',
    plural: 'Stats Strips',
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
        },
        {
          name: 'suffix',
          type: 'text',
          defaultValue: '+',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
