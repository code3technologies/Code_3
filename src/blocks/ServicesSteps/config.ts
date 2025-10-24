import type { Block } from 'payload'

export const ServicesSteps: Block = {
  slug: 'servicesSteps',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'Steps',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Simple Steps to Stress-Free IT',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      defaultValue: 'We handle the technical hassles so you can focus on growing your business.',
      required: true,
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'stepNumber',
          type: 'text',
          label: 'Step Number',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Step Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Step Description',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Image Icon',
          required: true,
        },
      ],
    },
  ],
  interfaceName: 'ServicesStepsBlock',
}
