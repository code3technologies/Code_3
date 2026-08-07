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
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      localized: true,
    },
    {
      name: 'cultureBadge',
      type: 'text',
      label: 'Culture card badge',
      defaultValue: 'OUR CULTURE',
      localized: true,
    },
    {
      name: 'cultureHeading',
      type: 'text',
      label: 'Culture card heading',
      defaultValue: 'A Place to Learn, Grow & Thrive',
      localized: true,
    },
    {
      name: 'cultureDescription',
      type: 'textarea',
      label: 'Culture card description',
      defaultValue:
        'We believe in building a culture of trust, collaboration and continuous learning. Here, your ideas matter and your growth is our priority.',
      localized: true,
    },
    {
      name: 'cultureLinkText',
      type: 'text',
      label: 'Culture card link text',
      defaultValue: 'Learn More About Us',
      localized: true,
    },
    {
      name: 'cultureLinkHref',
      type: 'text',
      label: 'Culture card link URL',
      defaultValue: '/about-us',
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