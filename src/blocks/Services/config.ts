import type { Block } from 'payload'

export const Services: Block = {
  slug: 'services',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'OUR SERVICES',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      required: true,
    },
    {
      name: 'maxServices',
      type: 'number',
      label: 'Maximum Services to Display',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'Maximum number of service pages to display (pages with serviceCategory set)',
      },
    },
  ],
  interfaceName: 'ServicesBlock',
}
