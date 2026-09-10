import type { Block } from 'payload'

export const ZonedFlow: Block = {
  slug: 'zonedFlow',
  interfaceName: 'ZonedFlowBlock',
  labels: {
    singular: 'Zoned Flow',
    plural: 'Zoned Flows',
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
      label: 'Intro Line',
      localized: true,
    },
    {
      name: 'zones',
      type: 'array',
      label: 'Zones (top to bottom)',
      minRows: 2,
      admin: {
        description:
          'Each zone is a labelled band containing one or more stages. Use it to show a boundary, e.g. Your Site / The Edge / Beyond.',
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        {
          name: 'emphasis',
          type: 'checkbox',
          label: 'Highlight this zone',
          defaultValue: false,
          admin: { description: 'Tints the band and makes the label chip solid red — use for the pivotal zone.' },
        },
        {
          name: 'connectorNote',
          type: 'text',
          label: 'Connector Caption (optional)',
          localized: true,
          admin: { description: 'Small caption on the arrow leading to the next zone. Ignored on the last zone.' },
        },
        {
          name: 'stages',
          type: 'array',
          label: 'Stages',
          minRows: 1,
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            { name: 'description', type: 'textarea', required: true, localized: true },
          ],
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
