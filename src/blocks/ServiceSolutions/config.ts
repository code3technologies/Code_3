import type { Block } from 'payload'

export const ServiceSolutions: Block = {
  slug: 'serviceSolutions',
  fields: [
    {
      name: 'serviceType',
      type: 'select',
      label: 'Service Type',
      options: [
        { label: 'Infrastructure Services', value: 'infrastructure' },
        { label: 'Digital Services', value: 'digital' },
      ],
      required: true,
      admin: {
        description: 'Select which type of services to display in this block',
      },
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'Services',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
    {
      name: 'headerAlignment',
      type: 'select',
      label: 'Header Alignment',
      options: [
        { label: 'Left (Start)', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right (End)', value: 'right' },
      ],
      defaultValue: 'left',
      required: true,
    },
  ],
  interfaceName: 'ServiceSolutionsBlock',
}
