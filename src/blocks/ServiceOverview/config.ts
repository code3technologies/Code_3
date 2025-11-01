import type { Block } from 'payload'

export const ServiceOverview: Block = {
  slug: 'serviceOverview',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'SERVICES OVERVIEW',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Why IT AMC Matters for Your Business',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        "Downtime can cost your business both time and money. With our AMC, you'll get preventive care, real-time monitoring, and expert support whenever you need it. Our team ensures that your IT environment stays healthy, secure, and ready for growth.",
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      required: true,
    },
  ],
  interfaceName: 'ServiceOverviewBlock',
}
