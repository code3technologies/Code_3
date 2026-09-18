import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

const optionsField = (name: string, defaultValue?: { text: string }[]) => ({
  name,
  type: 'array' as const,
  minRows: 2,
  fields: [{ name: 'text', type: 'text' as const, required: true, localized: true }],
  ...(defaultValue ? { defaultValue } : {}),
})

export const Microsoft365MigrationEstimator: Block = {
  slug: 'microsoft365MigrationEstimator',
  interfaceName: 'Microsoft365MigrationEstimatorBlock',
  labels: {
    singular: 'Microsoft 365 Migration Estimator',
    plural: 'Microsoft 365 Migration Estimators',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'PLAN YOUR MIGRATION',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      defaultValue: 'Plan Your Microsoft 365 Migration',
      localized: true,
    },
    { name: 'subtitle', type: 'textarea', label: 'Subtitle', localized: true },
    {
      name: 'businessSizeLabel',
      type: 'text',
      label: 'Business Size Question Label',
      defaultValue: 'How many users need to be migrated?',
      localized: true,
    },
    optionsField('businessSizeOptions', [
      { text: '1-10 users' },
      { text: '11-50 users' },
      { text: '51-200 users' },
      { text: '200+ users' },
    ]),
    {
      name: 'sourceLabel',
      type: 'text',
      label: 'Source Environment Question Label',
      defaultValue: 'What are you migrating from?',
      localized: true,
    },
    optionsField('sourceOptions', [
      { text: 'On-premises Exchange or file servers' },
      { text: 'Google Workspace' },
      { text: 'Another Microsoft 365 tenant' },
      { text: 'Not sure yet' },
    ]),
    {
      name: 'priorityLabel',
      type: 'text',
      label: 'Priority Question Label',
      defaultValue: 'What matters most for your migration?',
      localized: true,
    },
    optionsField('priorityOptions', [
      { text: 'Minimal downtime' },
      { text: 'Data & permission accuracy' },
      { text: 'Speed of migration' },
      { text: 'Security during transition' },
    ]),
    {
      name: 'approachLabel',
      type: 'text',
      label: 'Migration Approach Question Label',
      defaultValue: 'How do you want to migrate?',
      localized: true,
    },
    optionsField('approachOptions', [
      { text: 'All at once' },
      { text: 'Phased in waves' },
      { text: 'Pilot group first' },
      { text: 'Not sure yet' },
    ]),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Get My Migration Plan',
      localized: true,
    },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer', localized: true },
    ...ctaFields('Talk to a Microsoft 365 Expert'),
  ],
}
