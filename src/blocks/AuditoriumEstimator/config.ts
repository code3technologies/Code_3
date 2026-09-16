import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
})

export const AuditoriumEstimator: Block = {
  slug: 'auditoriumEstimator',
  interfaceName: 'AuditoriumEstimatorBlock',
  labels: {
    singular: 'Auditorium Estimator',
    plural: 'Auditorium Estimators',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'PLAN YOUR AUDITORIUM AV SYSTEM',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Plan Your Auditorium AV System',
      localized: true,
    },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    { name: 'venueTypeLabel', type: 'text', label: 'Venue Type Question Label', defaultValue: 'What type of venue is it?', localized: true },
    optionsField('venueTypeOptions'),
    { name: 'audienceSizeLabel', type: 'text', label: 'Audience Size Question Label', defaultValue: 'Audience Size', localized: true },
    optionsField('audienceSizeOptions'),
    {
      name: 'primaryRequirementLabel',
      type: 'text',
      label: 'Primary Requirement Question Label',
      defaultValue: 'What is the primary requirement?',
      localized: true,
    },
    optionsField('primaryRequirementOptions'),
    { name: 'visualLabel', type: 'text', label: 'Visual Question Label', defaultValue: 'Visual', localized: true },
    optionsField('visualOptions'),
    { name: 'audioLabel', type: 'text', label: 'Audio Question Label', defaultValue: 'Audio', localized: true },
    optionsField('audioOptions'),
    {
      name: 'additionalLabel',
      type: 'text',
      label: 'Additional Requirements Question Label',
      defaultValue: 'Additional Requirements',
      localized: true,
    },
    optionsField('additionalOptions'),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My Recommended AV Scope',
      localized: true,
    },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our Auditorium AV Experts'),
  ],
}
