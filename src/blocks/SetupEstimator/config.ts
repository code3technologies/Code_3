import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const SetupEstimator: Block = {
  slug: 'setupEstimator',
  interfaceName: 'SetupEstimatorBlock',
  labels: {
    singular: 'Setup Estimator',
    plural: 'Setup Estimators',
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
      name: 'questions',
      type: 'array',
      label: 'Questions',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        {
          name: 'selectionType',
          type: 'select',
          label: 'Selection Type',
          defaultValue: 'single',
          options: [
            { label: 'Single choice (used for sizing)', value: 'single' },
            { label: 'Single choice (informational only, not scored)', value: 'singleInfo' },
            { label: 'Multiple choice (checklist, shown in result)', value: 'multi' },
          ],
        },
        {
          name: 'options',
          type: 'array',
          label: 'Options',
          minRows: 1,
          fields: [{ name: 'text', type: 'text', required: true, localized: true }],
        },
      ],
    },
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My Setup Recommendation',
      localized: true,
    },
    {
      name: 'sizeTiers',
      type: 'array',
      label: 'Size Tiers',
      admin: {
        description:
          'Matched against the combined score of the single-choice questions only (option index = points). Shown as the recommended scope in the result panel.',
      },
      minRows: 1,
      fields: [
        { name: 'minScore', type: 'number', required: true },
        { name: 'maxScore', type: 'number', required: true },
        { name: 'tierName', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
      ],
    },
    {
      name: 'resultEyebrow',
      type: 'text',
      label: 'Result Eyebrow (optional)',
      localized: true,
      admin: { description: 'Small label above the recommended tier name, e.g. "Your recommended AV solution scope". Defaults to "Recommended Scope".' },
    },
    {
      name: 'disclaimer',
      type: 'text',
      label: 'Disclaimer',
      localized: true,
    },
    ...ctaFields('Talk to Our Experts'),
  ],
}
