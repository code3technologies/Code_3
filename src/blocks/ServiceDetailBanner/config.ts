import type { Block } from 'payload'

export const ServiceDetailBanner: Block = {
  slug: 'serviceDetailBanner',
  fields: [
    {
      name: 'serviceBadge',
      type: 'text',
      label: 'Service Badge Text For Sub-Services',
    },
    {
      name: 'serviceName',
      type: 'text',
      label: 'Service Name',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title for Services  ',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
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
