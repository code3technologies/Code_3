import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'showLogo',
      type: 'checkbox',
      label: 'Show Badge',
      defaultValue: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
    },
    linkGroup({
      appearances: ['default', 'outline', 'buttonWithGradientOnHover'],
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
    },
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
