import type { Block } from 'payload'

export const BrandDeviceGrid: Block = {
  slug: 'brandDeviceGrid',
  interfaceName: 'BrandDeviceGridBlock',
  labels: {
    singular: 'Brand Device Grid',
    plural: 'Brand Device Grids',
  },
  fields: [
    {
      name: 'brand',
      type: 'select',
      required: true,
      options: ['Yealink', 'Logitech', 'Jabra', 'Cisco', 'Poly'],
      admin: {
        description: "Which brand's devices (from the Devices collection) to list here.",
      },
    },
  ],
}
