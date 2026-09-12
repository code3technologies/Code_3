import type { Block } from 'payload'

export const AVArchitectureFlow: Block = {
  slug: 'avArchitectureFlow',
  interfaceName: 'AVArchitectureFlowBlock',
  labels: {
    singular: 'AV Architecture Flow',
    plural: 'AV Architecture Flows',
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
      name: 'mainFlow',
      type: 'array',
      label: 'Main Signal Path',
      minRows: 2,
      admin: {
        description: 'Rendered as a vertical chain of stages connected by arrows, e.g. Source → Connectivity → Processing → Output.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        {
          name: 'examples',
          type: 'text',
          label: 'Examples (optional)',
          localized: true,
          admin: { description: 'Generic category examples only, e.g. "Laptop / Camera / Microphone / Media" — avoid naming specific equipment unless actually supplied.' },
        },
      ],
    },
    {
      name: 'secondaryFlows',
      type: 'array',
      label: 'Secondary Flows (optional)',
      admin: {
        description: 'Additional parallel systems shown below the main path, e.g. Audio, Collaboration, Control.',
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        {
          name: 'style',
          type: 'select',
          label: 'Style',
          defaultValue: 'list',
          options: [
            { label: 'Chain (items linked by arrows)', value: 'chain' },
            { label: 'List (items shown together, no arrows)', value: 'list' },
          ],
        },
        {
          name: 'items',
          type: 'array',
          label: 'Items',
          minRows: 1,
          fields: [{ name: 'text', type: 'text', required: true, localized: true }],
        },
        {
          name: 'connectFromPrevious',
          type: 'checkbox',
          label: 'Show a connecting arrow from the flow above',
          defaultValue: false,
          admin: { description: 'e.g. Collaboration tools feeding into Control.' },
        },
      ],
    },
    {
      name: 'note',
      type: 'text',
      label: 'Footer Note (optional)',
      localized: true,
    },
  ],
}
