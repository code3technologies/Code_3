import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
})

export const WiFiEstimator: Block = {
  slug: 'wifiEstimator',
  interfaceName: 'WiFiEstimatorBlock',
  labels: {
    singular: 'Wi-Fi Estimator',
    plural: 'Wi-Fi Estimators',
  },
  fields: [
    { name: 'badge', type: 'text', label: 'Badge Text', defaultValue: 'PLAN YOUR BUSINESS WI-FI', localized: true },
    { name: 'title', type: 'text', label: 'Title', required: true, defaultValue: 'Plan Your Business Wi-Fi', localized: true },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },

    { name: 'sizeLabel', type: 'text', label: 'Business Size Question', defaultValue: 'How many people will use the Wi-Fi?', localized: true },
    optionsField('sizeOptions'),
    { name: 'floorsLabel', type: 'text', label: 'Floors Question', defaultValue: 'How many floors need coverage?', localized: true },
    optionsField('floorsOptions'),
    { name: 'areaLabel', type: 'text', label: 'Area Question', defaultValue: 'Approximate area to cover', localized: true },
    optionsField('areaOptions'),
    { name: 'devicesLabel', type: 'text', label: 'Devices Question', defaultValue: 'Roughly how many devices connect?', localized: true },
    optionsField('devicesOptions'),
    { name: 'existingLabel', type: 'text', label: 'Existing Wi-Fi Question', defaultValue: 'Is this a new setup or an upgrade?', localized: true },
    optionsField('existingOptions'),
    {
      name: 'reqLabel',
      type: 'text',
      label: 'Requirements Question',
      defaultValue: 'What do you need? (choose all that apply)',
      localized: true,
    },
    optionsField('reqOptions'),

    { name: 'submitLabel', type: 'text', label: 'Submit Button Label', defaultValue: 'Get My Wi-Fi Recommendation', localized: true },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our Experts'),
  ],
}
