import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
})

export const BGMEstimator: Block = {
  slug: 'bgmEstimator',
  interfaceName: 'BGMEstimatorBlock',
  labels: {
    singular: 'Background Music Estimator',
    plural: 'Background Music Estimators',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'PLAN YOUR AUDIO SYSTEM',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Find Your Background Music Requirement',
      localized: true,
    },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    { name: 'spaceLabel', type: 'text', label: 'Space Type Question Label', defaultValue: 'What type of space do you have?', localized: true },
    optionsField('spaceOptions'),
    { name: 'areaLabel', type: 'text', label: 'Approximate Area Question Label', defaultValue: 'Approximate Area', localized: true },
    optionsField('areaOptions'),
    { name: 'zonesLabel', type: 'text', label: 'Number of Zones Question Label', defaultValue: 'Number of Zones', localized: true },
    optionsField('zonesOptions'),
    { name: 'speakerLabel', type: 'text', label: 'Speaker Placement Question Label', defaultValue: 'Where will speakers be installed?', localized: true },
    optionsField('speakerOptions'),
    { name: 'volumeLabel', type: 'text', label: 'Independent Volume Control Question Label', defaultValue: 'Do you need independent volume control?', localized: true },
    optionsField('volumeOptions'),
    { name: 'multiLocationLabel', type: 'text', label: 'Multiple Locations Question Label', defaultValue: 'Do you need music across multiple locations?', localized: true },
    optionsField('multiLocationOptions'),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My BGM Recommendation',
      localized: true,
    },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our Experts'),
  ],
}
