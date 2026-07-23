import type { Block } from 'payload'

export const Code3FAQ: Block = {
  slug: 'code3Faq',
  interfaceName: 'Code3FAQBlock',
  labels: {
    singular: 'FAQ Accordion',
    plural: 'FAQ Accordions',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'FAQS',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Frequently asked questions',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'faqs',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
