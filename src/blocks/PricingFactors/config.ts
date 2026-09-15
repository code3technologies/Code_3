import type { Block } from 'payload'

export const PricingFactors: Block = {
  slug: 'pricingFactors',
  interfaceName: 'PricingFactorsBlock',
  labels: {
    singular: 'Pricing Factors',
    plural: 'Pricing Factors',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      localized: true,
    },
    {
      name: 'factors',
      type: 'array',
      label: 'Factors',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji)',
          admin: { description: 'e.g. "👥"' },
        },
        {
          name: 'text',
          type: 'text',
          label: 'Factor',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description (optional)',
          localized: true,
          admin: {
            description: 'Optional — switches this section to a more detailed card layout once any factor has one.',
          },
        },
      ],
    },
    {
      name: 'ctaHeading',
      type: 'text',
      label: 'CTA Heading',
      localized: true,
    },
    {
      name: 'ctaDescription',
      type: 'textarea',
      label: 'CTA Description',
      localized: true,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label',
      localized: true,
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA Button URL',
      defaultValue: '/contact',
    },
  ],
}
