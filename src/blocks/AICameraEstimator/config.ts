import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
})

export const AICameraEstimator: Block = {
  slug: 'aiCameraEstimator',
  interfaceName: 'AICameraEstimatorBlock',
  labels: {
    singular: 'AI Camera Estimator',
    plural: 'AI Camera Estimators',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'PLAN YOUR AI CAMERA SYSTEM',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Find the Right AI Surveillance Solution',
      localized: true,
    },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    {
      name: 'propertyLabel',
      type: 'text',
      label: 'Property Type Question Label',
      defaultValue: 'What type of property are you securing?',
      localized: true,
    },
    optionsField('propertyOptions'),
    { name: 'areaLabel', type: 'text', label: 'Approximate Area Question Label', defaultValue: 'Approximate Area', localized: true },
    optionsField('areaOptions'),
    {
      name: 'coverageLabel',
      type: 'text',
      label: 'Coverage Requirement Question Label',
      defaultValue: 'Where do you need coverage?',
      localized: true,
    },
    optionsField('coverageOptions'),
    {
      name: 'featureLabel',
      type: 'text',
      label: 'AI Features Question Label',
      defaultValue: 'Which AI feature matters most to you?',
      localized: true,
    },
    optionsField('featureOptions'),
    {
      name: 'existingCctvLabel',
      type: 'text',
      label: 'Existing CCTV Question Label',
      defaultValue: 'Do you have an existing CCTV system?',
      localized: true,
    },
    optionsField('existingCctvOptions'),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My AI Camera Recommendation',
      localized: true,
    },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our Experts'),
  ],
}
