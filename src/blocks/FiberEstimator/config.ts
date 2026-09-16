import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
})

export const FiberEstimator: Block = {
  slug: 'fiberEstimator',
  interfaceName: 'FiberEstimatorBlock',
  labels: {
    singular: 'Fiber Estimator',
    plural: 'Fiber Estimators',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'PLAN YOUR FIBER NETWORK',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Plan Your Fiber Network',
      localized: true,
    },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    {
      name: 'projectTypeLabel',
      type: 'text',
      label: 'Project Type Question Label',
      defaultValue: 'What type of project are you planning?',
      localized: true,
    },
    optionsField('projectTypeOptions'),
    {
      name: 'distanceLabel',
      type: 'text',
      label: 'Distance Question Label',
      defaultValue: 'Approximate distance?',
      localized: true,
    },
    optionsField('distanceOptions'),
    {
      name: 'needLabel',
      type: 'text',
      label: 'Need Question Label',
      defaultValue: 'What do you need?',
      localized: true,
    },
    optionsField('needOptions'),
    {
      name: 'existingLabel',
      type: 'text',
      label: 'Existing Infrastructure Question Label',
      defaultValue: 'Existing infrastructure?',
      localized: true,
    },
    optionsField('existingOptions'),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My Fiber Recommendation',
      localized: true,
    },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our Fiber Infrastructure Experts'),
  ],
}
