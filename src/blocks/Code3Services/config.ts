import type { Block } from 'payload'

const ICON_OPTIONS = [
  { label: 'Managed IT', value: 'managed-it' },
  { label: 'IT Infrastructure', value: 'it-infra' },
  { label: 'Cyber Security', value: 'cyber-security' },
  { label: 'Network', value: 'network' },
  { label: 'Cloud & Microsoft', value: 'cloud-ms' },
  { label: 'Backup & Continuity', value: 'backup-bc' },
  { label: 'Unified Communication', value: 'unified-comm' },
  { label: 'Audio Visual', value: 'av' },
  { label: 'Security & Surveillance', value: 'security-surveillance' },
  { label: 'Hardware & Software', value: 'hw-sw' },
  { label: 'Professional Services', value: 'professional' },
]

export const Code3Services: Block = {
  slug: 'code3Services',
  interfaceName: 'Code3ServicesBlock',
  labels: {
    singular: 'Services Explorer',
    plural: 'Services Explorers',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'OUR SERVICES',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Your technology partner in every step',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'categories',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: ICON_OPTIONS,
        },
        {
          name: 'services',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
