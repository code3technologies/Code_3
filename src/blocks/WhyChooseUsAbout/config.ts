import type { Block } from 'payload'

export const WhyChooseUsAbout: Block = {
  slug: 'whyChooseUsAbout',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'WHY CHOOSE US',
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
      name: 'features',
      type: 'array',
      label: 'Features',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon Image',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Feature Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Feature Description',
          required: true,
        },
      ],
    },
  ],
  interfaceName: 'WhyChooseUsAboutBlock',
}