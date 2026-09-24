import type { Block } from 'payload'

// A self-hiding strip of the latest published case studies. Renders nothing
// until at least one exists, so it's safe to place on a page in advance.
export const CaseStudies: Block = {
  slug: 'caseStudies',
  interfaceName: 'CaseStudiesBlock',
  labels: { singular: 'Case Studies Strip', plural: 'Case Studies Strips' },
  fields: [
    { name: 'badge', type: 'text', label: 'Badge Text', defaultValue: 'CASE STUDIES', localized: true },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Real projects, real results',
      localized: true,
    },
    { name: 'subtitle', type: 'text', localized: true },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 6,
      admin: { description: 'How many of the latest case studies to show.' },
    },
    { name: 'ctaLabel', type: 'text', defaultValue: 'View all case studies', localized: true },
  ],
}
