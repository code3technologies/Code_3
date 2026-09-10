import type { Block } from 'payload'

export const ConceptBreakdown: Block = {
  slug: 'conceptBreakdown',
  interfaceName: 'ConceptBreakdownBlock',
  labels: {
    singular: 'Concept Breakdown',
    plural: 'Concept Breakdowns',
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
      name: 'intro',
      type: 'textarea',
      label: 'Definition / Intro',
      localized: true,
      admin: {
        description:
          'Sits in the sticky left column above the list. Separate paragraphs with a blank line.',
      },
    },
    {
      name: 'asideLabel',
      type: 'text',
      label: 'Aside Heading (optional)',
      localized: true,
      admin: {
        description: 'e.g. "How CODE3 designs your LAN" — small heading above the aside passage.',
      },
    },
    {
      name: 'asideText',
      type: 'textarea',
      label: 'Aside Passage (optional)',
      localized: true,
      admin: {
        description:
          'A short passage shown under the intro in the left column, set off by a red rule. Separate paragraphs with a blank line.',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'List Items',
      minRows: 2,
      admin: {
        description:
          'Rendered as a borderless, hairline-divided reference list in the right column — term, then explanation. No cards, no icons.',
      },
      fields: [
        { name: 'term', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', required: true, localized: true },
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
