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
        { label: 'Tag Cloud (compact wrapped chips)', value: 'tags' },
        { label: 'Monthly Cadence (dark panel + icon rows)', value: 'monthly' },
      ],
      admin: {
        description:
          'Tag Cloud suits a broad illustrative list of examples that a fuller section elsewhere already explains in depth. Monthly Cadence is meant for recurring/ongoing-service content, e.g. "what happens every month."',
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
    {
      name: 'iconStyle',
      type: 'select',
      label: 'Icon Style (Checklist Grid only)',
      defaultValue: 'check',
      options: [
        { label: 'Checkmark (default)', value: 'check' },
        { label: 'Keyword-matched icon per item', value: 'keyword' },
      ],
      admin: {
        description: 'Keyword-matched suits a list of distinct services/topics; checkmark suits a literal "these are included" checklist.',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label (optional)',
      localized: true,
      admin: { description: 'Leave blank to show no button. Shown below the checklist, e.g. linking to a related service page.' },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA Button URL',
      admin: { description: 'e.g. "/service/new-office-it-setup-dubai-uae".' },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Lead-in Text (optional)',
      localized: true,
      admin: { description: 'Short line shown above the button, e.g. "Need the New Office IT Setup Too?"' },
    },
  ],
}
