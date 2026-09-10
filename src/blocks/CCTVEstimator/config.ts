import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
})

export const CCTVEstimator: Block = {
  slug: 'cctvEstimator',
  interfaceName: 'CCTVEstimatorBlock',
  labels: {
    singular: 'CCTV Estimator',
    plural: 'CCTV Estimators',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'PLAN YOUR CCTV SYSTEM',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Find Your CCTV Requirement',
      localized: true,
    },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    { name: 'propertyLabel', type: 'text', label: 'Property Type Question Label', defaultValue: 'What type of property are you securing?', localized: true },
    optionsField('propertyOptions'),
    { name: 'areaLabel', type: 'text', label: 'Approximate Area Question Label', defaultValue: 'Approximate Area', localized: true },
    optionsField('areaOptions'),
    { name: 'camerasLabel', type: 'text', label: 'Number of Cameras Question Label', defaultValue: 'Approximate Number of Cameras', localized: true },
    optionsField('camerasOptions'),
    { name: 'coverageLabel', type: 'text', label: 'Coverage Area Question Label', defaultValue: 'Where do you need coverage?', localized: true },
    optionsField('coverageOptions'),
    { name: 'remoteViewingLabel', type: 'text', label: 'Remote Viewing Question Label', defaultValue: 'Do you need remote viewing?', localized: true },
    optionsField('remoteViewingOptions'),
    { name: 'aiLabel', type: 'text', label: 'AI Analytics Question Label', defaultValue: 'Do you need intelligent/AI analytics?', localized: true },
    optionsField('aiOptions'),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My CCTV Recommendation',
      localized: true,
    },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our Experts'),
  ],
}
