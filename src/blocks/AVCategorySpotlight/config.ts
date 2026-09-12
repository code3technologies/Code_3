import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const AVCategorySpotlight: Block = {
  slug: 'avCategorySpotlight',
  interfaceName: 'AVCategorySpotlightBlock',
  labels: {
    singular: 'AV Category Spotlight',
    plural: 'AV Category Spotlights',
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
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      localized: true,
    },
    {
      name: 'bulletsLabel',
      type: 'text',
      label: 'Bullets Lead-in (optional)',
      defaultValue: 'Typically includes:',
      localized: true,
    },
    {
      name: 'bullets',
      type: 'array',
      label: 'Bullets (optional)',
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'reverse',
      type: 'checkbox',
      label: 'Reverse layout (bullets on the left)',
      defaultValue: false,
      admin: { description: 'Alternate true/false between consecutive spotlights for visual rhythm.' },
    },
    ...ctaFields('Talk to Our AV Team'),
  ],
}
