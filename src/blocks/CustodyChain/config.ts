import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const CustodyChain: Block = {
  slug: 'custodyChain',
  interfaceName: 'CustodyChainBlock',
  labels: {
    singular: 'Custody Chain',
    plural: 'Custody Chains',
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
      name: 'steps',
      type: 'array',
      label: 'Chain Steps',
      minRows: 3,
      maxRows: 8,
      admin: { description: 'Short single words/phrases, shown in order connected by arrows, e.g. "Tag".' },
      fields: [
        { name: 'text', type: 'text', required: true, localized: true },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description (optional)',
          localized: true,
          admin: {
            description: 'Optional — explains how this step is actually done. Shown as a detail list below the chain once any step has one.',
          },
        },
      ],
    },
    ...ctaFields(''),
  ],
}
