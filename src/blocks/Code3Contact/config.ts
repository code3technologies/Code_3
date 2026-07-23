import type { Block } from 'payload'

export const Code3Contact: Block = {
  slug: 'code3Contact',
  interfaceName: 'Code3ContactBlock',
  labels: {
    singular: 'Contact Section',
    plural: 'Contact Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'GET IN TOUCH',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Ready to transform your business with technology?',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      defaultValue: '+971 50 504 2547',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      defaultValue: 'info@code3.ae',
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      defaultValue: 'Office 209, Al Mozna Building, Dubai, UAE',
    },
    {
      name: 'hours',
      type: 'text',
      required: true,
      defaultValue: 'Monday – Saturday, 8:00 AM – 6:00 PM',
    },
  ],
}
