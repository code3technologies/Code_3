import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string, defaultValue?: { text: string }[]) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
  ...(defaultValue ? { defaultValue } : {}),
})

export const Microsoft365Estimator: Block = {
  slug: 'microsoft365Estimator',
  interfaceName: 'Microsoft365EstimatorBlock',
  labels: {
    singular: 'Microsoft 365 Estimator',
    plural: 'Microsoft 365 Estimators',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'PLAN YOUR MICROSOFT 365 SETUP',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Request a Microsoft 365 Assessment',
      localized: true,
    },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    {
      name: 'businessSizeLabel',
      type: 'text',
      label: 'Business Size Question Label',
      defaultValue: 'How many users need Microsoft 365?',
      localized: true,
    },
    optionsField('businessSizeOptions', [
      { text: '1-10 users' },
      { text: '11-50 users' },
      { text: '51-200 users' },
      { text: '200+ users' },
    ]),
    {
      name: 'currentSetupLabel',
      type: 'text',
      label: 'Current Setup Question Label',
      defaultValue: 'What best describes your current setup?',
      localized: true,
    },
    optionsField('currentSetupOptions', [
      { text: 'No Microsoft 365 yet' },
      { text: 'Using Microsoft 365 but not fully configured' },
      { text: 'Migrating from another email provider' },
      { text: 'Existing Microsoft 365 needs security or admin help' },
    ]),
    {
      name: 'priorityLabel',
      type: 'text',
      label: 'Priority Question Label',
      defaultValue: 'What matters most right now?',
      localized: true,
    },
    optionsField('priorityOptions', [
      { text: 'New setup & migration' },
      { text: 'Security & compliance' },
      { text: 'Ongoing admin & support' },
      { text: 'Licensing & cost optimization' },
    ]),
    {
      name: 'workStyleLabel',
      type: 'text',
      label: 'Work Style Question Label',
      defaultValue: 'How does your team work?',
      localized: true,
    },
    optionsField('workStyleOptions', [
      { text: 'Fully in-office' },
      { text: 'Hybrid' },
      { text: 'Fully remote or multi-location' },
    ]),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My Microsoft 365 Assessment',
      localized: true,
    },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our Microsoft 365 Experts'),
  ],
}
