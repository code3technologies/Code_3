import type { Block } from 'payload'

export const ServiceSolutions: Block = {
  slug: 'serviceSolutions',
  fields: [
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
      defaultValue: 'Solutions We Deliver',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        'We go beyond technology—we create future-ready solutions that empower businesses to perform better, stay secure, and grow faster. With expertise across IT, ICT, Cybersecurity, and AV, we are your single point of contact for all technology needs.',
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
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Service Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Service Description',
          required: true,
        },
        {
          name: 'showButton',
          type: 'checkbox',
          label: 'Show Button',
          defaultValue: true,
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Button Text',
          defaultValue: 'Explore Service',
          admin: {
            condition: (_, siblingData) => siblingData.showButton,
          },
        },
        {
          name: 'buttonLink',
          type: 'text',
          label: 'Button Link',
          defaultValue: '#',
          admin: {
            condition: (_, siblingData) => siblingData.showButton,
          },
        },
        {
          name: 'gridSpan',
          type: 'select',
          label: 'Column Width',
          options: [
            { label: '2 Columns out of 6, Tab(50%) and Desktop(33%)', value: '2' },
            { label: '3 Columns in Tablet(50%) and 3 Columns in Desktop(50%) out of 6', value: '3' },
            { label: '6 Columns in Tablet(100%) and 3 Columns in Desktop(50%) out of 6', value: '2-3' },
          ],
          defaultValue: '2',
          required: true,
        },
      ]
    },
  ],
  interfaceName: 'ServiceSolutionsBlock',
}