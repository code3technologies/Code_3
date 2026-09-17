import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string, defaultValue?: { text: string }[]) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
  ...(defaultValue ? { defaultValue } : {}),
})

export const LedWallEstimator: Block = {
  slug: 'ledWallEstimator',
  interfaceName: 'LedWallEstimatorBlock',
  labels: {
    singular: 'LED Wall Estimator',
    plural: 'LED Wall Estimators',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'PLAN YOUR LED WALL',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Plan Your LED Wall',
      localized: true,
    },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    {
      name: 'environmentLabel',
      type: 'text',
      label: 'Environment Question Label',
      defaultValue: 'Where will the LED wall be installed?',
      localized: true,
    },
    optionsField('environmentOptions', [
      { text: 'Indoor' },
      { text: 'Outdoor' },
      { text: 'Not sure' },
    ]),
    {
      name: 'applicationLabel',
      type: 'text',
      label: 'Application Question Label',
      defaultValue: 'What is the primary application?',
      localized: true,
    },
    optionsField('applicationOptions', [
      { text: 'Corporate' },
      { text: 'Retail' },
      { text: 'Auditorium / Events' },
      { text: 'Control Room' },
      { text: 'Showroom' },
      { text: 'Hospitality' },
      { text: 'Digital Signage' },
      { text: 'Other' },
    ]),
    {
      name: 'viewingDistanceLabel',
      type: 'text',
      label: 'Viewing Distance Question Label',
      defaultValue: 'What is the typical viewing distance?',
      localized: true,
    },
    optionsField('viewingDistanceOptions', [
      { text: 'Close range (under 3m)' },
      { text: 'Standard room (3-10m)' },
      { text: 'Large space (10m+)' },
      { text: 'Not sure' },
    ]),
    {
      name: 'contentTypeLabel',
      type: 'text',
      label: 'Content Type Question Label',
      defaultValue: 'What content will be displayed?',
      localized: true,
    },
    optionsField('contentTypeOptions', [
      { text: 'Presentations' },
      { text: 'Video' },
      { text: 'Digital signage' },
      { text: 'Live events / camera feeds' },
      { text: 'Mixed content' },
    ]),
    {
      name: 'existingLabel',
      type: 'text',
      label: 'Existing Infrastructure Question Label',
      defaultValue: 'What best describes your current setup?',
      localized: true,
    },
    optionsField('existingOptions', [
      { text: 'New installation' },
      { text: 'Upgrading an existing display' },
      { text: 'Existing AV system in place' },
      { text: 'Existing network infrastructure' },
    ]),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My LED Wall Recommendation',
      localized: true,
    },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our AV Experts'),
  ],
}
