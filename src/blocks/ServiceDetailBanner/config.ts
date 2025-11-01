import type { Block } from 'payload'

export const ServiceDetailBanner: Block = {
  slug: 'serviceDetailBanner',
  fields: [
    {
      name: 'serviceName',
      type: 'text',
      label: 'Service Name',
      defaultValue: 'IT AMC',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      defaultValue: 'Peace of Mind, Powered by IT AMC.',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        'From technology infrastructure to digital growth, we deliver end-to-end solutions that help your business run smarter and grow faster.',
      required: true,
    },
    {
      name: 'showGradientLine',
      type: 'checkbox',
      label: 'Show Gradient Line',
      defaultValue: true,
    },
  ],
  interfaceName: 'ServiceDetailBannerBlock',
}
