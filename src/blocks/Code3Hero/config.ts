import type { Block } from 'payload'

export const Code3Hero: Block = {
  slug: 'code3Hero',
  interfaceName: 'Code3HeroBlock',
  labels: {
    singular: 'Hero Slider',
    plural: 'Hero Sliders',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
          required: true,
        },
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Eyebrow Label',
          required: true,
        },
        {
          name: 'headlineText',
          type: 'text',
          label: 'Headline (plain part)',
          required: true,
        },
        {
          name: 'headlineHighlight',
          type: 'text',
          label: 'Headline (highlighted part)',
          required: true,
        },
        {
          name: 'subtext',
          type: 'textarea',
          label: 'Subtext',
          required: true,
        },
      ],
    },
  ],
}
