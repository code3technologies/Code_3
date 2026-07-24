import type { Block } from 'payload'
import { ICON_PRESET_OPTIONS } from '@/components/site/icons'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
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
          name: 'icon',
          type: 'select',
          options: [...ICON_PRESET_OPTIONS],
          defaultValue: 'check',
          admin: {
            description: 'Used only when no icon image is uploaded below.',
          },
        },
        {
          name: 'iconMedia',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon Image (overrides preset)',
        },
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
