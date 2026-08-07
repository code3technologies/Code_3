import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const WhyChooseUsAbout: Block = {
  slug: 'whyChooseUsAbout',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'WHY CHOOSE US',
      localized: true,
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      localized: true,
      required: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon Image',
          admin: {
            description: 'Optional — the feature renders cleanly without one.',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Feature Title',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Feature Description',
          localized: true,
          required: true,
        },
      ],
    },
    ...ctaFields(
      'Talk to Our Experts',
      'Want to see how we can support your business?',
    ),
  ],
  interfaceName: 'WhyChooseUsAboutBlock',
}