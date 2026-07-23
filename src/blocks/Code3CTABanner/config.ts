import type { Block } from 'payload'

export const Code3CTABanner: Block = {
  slug: 'code3CtaBanner',
  interfaceName: 'Code3CTABannerBlock',
  labels: {
    singular: 'CTA Banner (slim)',
    plural: 'CTA Banners (slim)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Book a Free Consultation',
    },
    {
      name: 'buttonHref',
      type: 'text',
      defaultValue: '#contact',
    },
  ],
}
