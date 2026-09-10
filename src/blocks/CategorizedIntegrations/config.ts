import type { Block } from 'payload'

export const CategorizedIntegrations: Block = {
  slug: 'categorizedIntegrations',
  interfaceName: 'CategorizedIntegrationsBlock',
  labels: {
    singular: 'Categorized Integrations',
    plural: 'Categorized Integrations Blocks',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'INTEGRATIONS',
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
      name: 'checklistStyle',
      type: 'checkbox',
      label: 'Use Checkmark Bullets (Checklist Style)',
      defaultValue: false,
      admin: {
        description: 'Swaps the plain dot bullets for checkmarks — use for genuine checklists (e.g. project phases) rather than categorized feature/integration lists.',
      },
    },
    {
      name: 'groups',
      type: 'array',
      label: 'Categories',
      labels: { singular: 'Category', plural: 'Categories' },
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'heading', type: 'text', required: true, localized: true, admin: { description: 'e.g. "Video Conferencing"' } },
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          fields: [{ name: 'text', type: 'text', required: true, localized: true }],
        },
      ],
    },
  ],
}
