import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const AccordionSection: Block = {
  slug: 'accordionSection',
  interfaceName: 'AccordionSectionBlock',
  labels: {
    singular: 'Accordion Section',
    plural: 'Accordion Sections',
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
      name: 'items',
      type: 'array',
      label: 'Accordion Items',
      minRows: 1,
      admin: {
        description:
          'Each item is a collapsible section — a compact summary is always visible, and the detailed checklist expands on click. Use this to compress a long page: keep the top-level cards short and put the granular technical detail here.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        {
          name: 'summary',
          type: 'textarea',
          label: 'Summary (always visible)',
          localized: true,
          admin: { description: 'A one-sentence summary shown even when this item is collapsed.' },
        },
        {
          name: 'detailSubtitle',
          type: 'textarea',
          label: 'Detail Subtitle (shown when expanded)',
          localized: true,
        },
        {
          name: 'detailItems',
          type: 'array',
          label: 'Detail Checklist (shown when expanded)',
          fields: [
            { name: 'text', type: 'text', required: true, localized: true },
            { name: 'description', type: 'textarea', localized: true },
          ],
        },
        {
          name: 'note',
          type: 'textarea',
          label: 'Note (shown when expanded, below the checklist)',
          localized: true,
        },
      ],
    },
    ...ctaFields('Ready to Move Forward?', undefined),
  ],
}
