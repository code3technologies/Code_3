import type { Block } from 'payload'

export const ScopeChecklist: Block = {
  slug: 'scopeChecklist',
  interfaceName: 'ScopeChecklistBlock',
  labels: {
    singular: 'Scope Checklist',
    plural: 'Scope Checklists',
  },
  fields: [
    {
      name: 'layoutStyle',
      type: 'select',
      label: 'Layout Style',
      defaultValue: 'grid',
      options: [
        { label: 'Checklist Grid', value: 'grid' },
        { label: 'Monthly Cadence (dark panel + icon rows)', value: 'monthly' },
      ],
      admin: {
        description: 'Monthly Cadence is meant for recurring/ongoing-service content, e.g. "what happens every month."',
      },
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: "WHAT'S COVERED",
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
      name: 'items',
      type: 'array',
      label: 'Items',
      minRows: 1,
      fields: [
        { name: 'text', type: 'text', required: true, localized: true },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description (optional)',
          localized: true,
          admin: {
            description: 'Optional — switches every item in this list to a larger card with this detail line, once any item has one.',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Link URL (optional)',
          admin: { description: 'If set, this item links to the given URL, e.g. "/service/cyber-security".' },
        },
      ],
    },
    {
      name: 'note',
      type: 'text',
      label: 'Fine Print',
      admin: { description: 'e.g. "Also fully customizable based on your business needs and requirements."' },
      localized: true,
    },
  ],
}
