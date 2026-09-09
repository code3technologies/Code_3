import type { Block } from 'payload'

export const EcosystemDiagram: Block = {
  slug: 'ecosystemDiagram',
  interfaceName: 'EcosystemDiagramBlock',
  labels: {
    singular: 'Ecosystem Diagram',
    plural: 'Ecosystem Diagrams',
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
      name: 'hubLabel',
      type: 'text',
      label: 'Center Hub Label',
      required: true,
      admin: { description: 'e.g. "CCTV" — the system every spoke connects to.' },
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Connected Systems (spokes)',
      minRows: 3,
      maxRows: 8,
      admin: {
        description: 'Rendered as a radial diagram around the hub (desktop) / a simple connected list (mobile) — a deliberately different, non-linear visual for peer systems rather than a sequential process.',
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        {
          name: 'url',
          type: 'text',
          label: 'Link URL (optional)',
          admin: { description: 'If set, this spoke links to the given service page, e.g. "/service/anpr-systems-dubai-uae".' },
        },
      ],
    },
  ],
}
