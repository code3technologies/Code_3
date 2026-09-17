import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string, defaultValue?: { text: string }[]) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
  ...(defaultValue ? { defaultValue } : {}),
})

export const ItOutsourcingEstimator: Block = {
  slug: 'itOutsourcingEstimator',
  interfaceName: 'ItOutsourcingEstimatorBlock',
  labels: {
    singular: 'IT Outsourcing Estimator',
    plural: 'IT Outsourcing Estimators',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'PLAN YOUR IT OUTSOURCING',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Plan Your IT Outsourcing',
      localized: true,
    },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    {
      name: 'businessSizeLabel',
      type: 'text',
      label: 'Business Size Question Label',
      defaultValue: 'How many employees does your business have?',
      localized: true,
    },
    optionsField('businessSizeOptions', [
      { text: '1-25 employees' },
      { text: '26-50 employees' },
      { text: '51-100 employees' },
      { text: '100+ employees' },
    ]),
    {
      name: 'locationsLabel',
      type: 'text',
      label: 'Locations Question Label',
      defaultValue: 'How many locations do you operate?',
      localized: true,
    },
    optionsField('locationsOptions', [{ text: '1 location' }, { text: '2-5 locations' }, { text: '6+ locations' }]),
    {
      name: 'currentModelLabel',
      type: 'text',
      label: 'Current IT Model Question Label',
      defaultValue: 'What best describes your current IT setup?',
      localized: true,
    },
    optionsField('currentModelOptions', [
      { text: 'No internal IT' },
      { text: 'One IT employee' },
      { text: 'IT team' },
      { text: 'Existing outsourced provider' },
    ]),
    {
      name: 'engagementLabel',
      type: 'text',
      label: 'Engagement Model Question Label',
      defaultValue: 'Which engagement model appeals most?',
      localized: true,
    },
    optionsField('engagementOptions', [
      { text: 'Fully outsourced' },
      { text: 'Co-managed' },
      { text: 'Dedicated resource' },
      { text: 'Project-based' },
      { text: 'Specialist support' },
      { text: 'Not sure' },
    ]),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My IT Assessment',
      localized: true,
    },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our IT Outsourcing Experts'),
  ],
}
