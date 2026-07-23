import type { Block } from 'payload'

export const Code3Accreditations: Block = {
  slug: 'code3Accreditations',
  interfaceName: 'Code3AccreditationsBlock',
  labels: {
    singular: 'Technology Partners Marquee',
    plural: 'Technology Partners Marquees',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'TRUSTED BY LEADING TECHNOLOGY PARTNERS',
    },
    {
      name: 'partners',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional — shows as a bold text wordmark until a logo is uploaded.',
          },
        },
      ],
    },
  ],
}
