import type { Block } from 'payload'

const INDUSTRY_ICON_OPTIONS = [
  { label: 'Corporate Offices', value: 'Corporate Offices' },
  { label: 'Government', value: 'Government' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Education', value: 'Education' },
  { label: 'Hospitality', value: 'Hospitality' },
  { label: 'Retail', value: 'Retail' },
  { label: 'Banking & Finance', value: 'Banking & Finance' },
  { label: 'Manufacturing', value: 'Manufacturing' },
  { label: 'Logistics & Warehousing', value: 'Logistics & Warehousing' },
  { label: 'Construction', value: 'Construction' },
  { label: 'Real Estate', value: 'Real Estate' },
  { label: 'Residential', value: 'Residential' },
  { label: 'Small & Medium Businesses (SMBs)', value: 'Small & Medium Businesses (SMBs)' },
  { label: 'Enterprise Organizations', value: 'Enterprise Organizations' },
]

export const Code3Industries: Block = {
  slug: 'code3Industries',
  interfaceName: 'Code3IndustriesBlock',
  labels: {
    singular: 'Industries We Serve',
    plural: 'Industries We Serve',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'INDUSTRIES WE SERVE',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Technology solutions tailored for every industry',
    },
    {
      name: 'industries',
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
          name: 'iconPreset',
          type: 'select',
          label: 'Icon (matches title)',
          required: true,
          options: INDUSTRY_ICON_OPTIONS,
          admin: {
            description: 'Pick the preset icon closest to this industry.',
          },
        },
      ],
    },
  ],
}
