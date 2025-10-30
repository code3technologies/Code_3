import type { Block } from 'payload'

export const Careers: Block = {
  slug: 'careers',
  labels: {
    singular: 'Careers Block',
    plural: 'Careers Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'CAREERS',
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      defaultValue: 'Join Us. Build the Future.',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'At CODE3, we believe in people who push boundaries, embrace challenges, and create impactful solutions.',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'See Open Positions',
    },
    {
      name: 'buttonLink',
      type: 'text',
      defaultValue: '#',
    },
    {
      name: 'teamImages',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'hasTopMargin',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'isVisibleOnMobile',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'isVisibleOnTablet',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'isVisibleOnDesktop',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
  interfaceName: 'CareersBlock',
}