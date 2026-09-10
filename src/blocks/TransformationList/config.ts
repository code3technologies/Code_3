import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const TransformationList: Block = {
  slug: 'transformationList',
  interfaceName: 'TransformationListBlock',
  labels: {
    singular: 'Transformation List',
    plural: 'Transformation Lists',
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
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    { name: 'fromLabel', type: 'text', label: 'From Column Label', localized: true },
    { name: 'toLabel', type: 'text', label: 'To Column Label', localized: true },
    {
      name: 'pairs',
      type: 'array',
      label: 'Before → After Pairs',
      minRows: 2,
      admin: {
        description: 'One row per point, e.g. "Sign-in sheets" → "Digital records" - a unified list rather than two separate boxes.',
      },
      fields: [
        { name: 'from', type: 'text', label: 'From', required: true, localized: true },
        { name: 'to', type: 'text', label: 'To', required: true, localized: true },
      ],
    },
    ...ctaFields(''),
  ],
}
