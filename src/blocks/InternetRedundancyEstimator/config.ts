import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
})

export const InternetRedundancyEstimator: Block = {
  slug: 'internetRedundancyEstimator',
  interfaceName: 'InternetRedundancyEstimatorBlock',
  labels: {
    singular: 'Internet Redundancy Estimator',
    plural: 'Internet Redundancy Estimators',
  },
  fields: [
    { name: 'badge', type: 'text', label: 'Badge Text', defaultValue: 'PLAN YOUR INTERNET REDUNDANCY', localized: true },
    { name: 'title', type: 'text', label: 'Title', required: true, defaultValue: 'Plan Your Internet Redundancy', localized: true },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },

    { name: 'connectionsLabel', type: 'text', label: 'Connections Question', defaultValue: 'How many internet connections?', localized: true },
    optionsField('connectionsOptions'),
    { name: 'setupLabel', type: 'text', label: 'Current Setup Question', defaultValue: 'What is your current setup?', localized: true },
    optionsField('setupOptions'),
    { name: 'sizeLabel', type: 'text', label: 'Business Size Question', defaultValue: 'How many people will use the network?', localized: true },
    optionsField('sizeOptions'),
    { name: 'locationsLabel', type: 'text', label: 'Locations Question', defaultValue: 'How many locations?', localized: true },
    optionsField('locationsOptions'),
    {
      name: 'reqLabel',
      type: 'text',
      label: 'Requirements Question',
      defaultValue: 'What do you need? (choose all that apply)',
      localized: true,
    },
    optionsField('reqOptions'),

    { name: 'submitLabel', type: 'text', label: 'Submit Button Label', defaultValue: 'Get My Network Recommendation', localized: true },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our Experts'),
  ],
}
