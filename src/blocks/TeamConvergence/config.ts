import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const TeamConvergence: Block = {
  slug: 'teamConvergence',
  interfaceName: 'TeamConvergenceBlock',
  labels: {
    singular: 'Team Convergence',
    plural: 'Team Convergences',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      localized: true,
    },
    {
      name: 'beforeLabel',
      type: 'text',
      label: 'Lead-in Line (optional)',
      localized: true,
      admin: { description: 'Shown above the scattered items, e.g. "Instead of coordinating separate vendors for:"' },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Scattered Items',
      minRows: 2,
      maxRows: 12,
      admin: { description: 'The fragmented specialties/vendors shown converging into one team.' },
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'afterLabel',
      type: 'text',
      label: 'Transition Line (optional)',
      localized: true,
      admin: { description: 'Shown above the destination, e.g. "you have:"' },
    },
    {
      name: 'teamLabel',
      type: 'text',
      label: 'Destination Label',
      defaultValue: 'ONE CODE3 PROJECT TEAM',
      required: true,
      localized: true,
    },
    {
      name: 'destinationItems',
      type: 'array',
      label: 'Destination Breakdown (optional)',
      maxRows: 6,
      admin: {
        description: 'Optional concrete deliverables shown below the destination, e.g. "One Project Manager."',
      },
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'size',
      type: 'select',
      label: 'Section Size',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Large (hero-scale prominence)', value: 'large' },
      ],
    },
    ...ctaFields('Talk to Our Experts'),
  ],
}
