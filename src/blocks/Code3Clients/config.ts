import type { Block } from 'payload'

export const Code3Clients: Block = {
  slug: 'code3Clients',
  interfaceName: 'Code3ClientsBlock',
  labels: {
    singular: 'Happy Clients Grid',
    plural: 'Happy Clients Grids',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'OUR HAPPY CLIENTS',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Our Happy Clients',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'clients',
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
