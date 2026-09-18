import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string, defaultValue?: { text: string }[]) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
  ...(defaultValue ? { defaultValue } : {}),
})

export const CopilotEstimator: Block = {
  slug: 'copilotEstimator',
  interfaceName: 'CopilotEstimatorBlock',
  labels: {
    singular: 'Copilot Estimator',
    plural: 'Copilot Estimators',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'PLAN YOUR COPILOT ROLLOUT',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Request a Copilot Readiness Assessment',
      localized: true,
    },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    {
      name: 'businessSizeLabel',
      type: 'text',
      label: 'Business Size Question Label',
      defaultValue: 'How many users would use Copilot?',
      localized: true,
    },
    optionsField('businessSizeOptions', [
      { text: '1-10 users' },
      { text: '11-50 users' },
      { text: '51-200 users' },
      { text: '200+ users' },
    ]),
    {
      name: 'environmentLabel',
      type: 'text',
      label: 'Microsoft 365 Environment Question Label',
      defaultValue: 'What best describes your Microsoft 365 environment?',
      localized: true,
    },
    optionsField('environmentOptions', [
      { text: 'Not on Microsoft 365 yet' },
      { text: 'On Microsoft 365, not sure about licensing' },
      { text: 'Eligible Microsoft 365 plan already in place' },
      { text: 'Hybrid or on-premises email environment' },
    ]),
    {
      name: 'priorityLabel',
      type: 'text',
      label: 'Priority Question Label',
      defaultValue: 'What matters most for your rollout?',
      localized: true,
    },
    optionsField('priorityOptions', [
      { text: 'Readiness assessment' },
      { text: 'Licensing & cost planning' },
      { text: 'Security & data governance' },
      { text: 'User adoption & training' },
    ]),
    {
      name: 'rolloutLabel',
      type: 'text',
      label: 'Rollout Scope Question Label',
      defaultValue: 'How do you want to roll out Copilot?',
      localized: true,
    },
    optionsField('rolloutOptions', [
      { text: 'Pilot with a small group' },
      { text: 'Department-wide rollout' },
      { text: 'Organization-wide rollout' },
      { text: 'Not sure yet' },
    ]),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My Copilot Readiness Assessment',
      localized: true,
    },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to Our Microsoft Copilot Experts'),
  ],
}
