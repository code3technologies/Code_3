import type { Block } from 'payload'

export const PipelineFlow: Block = {
  slug: 'pipelineFlow',
  interfaceName: 'PipelineFlowBlock',
  labels: {
    singular: 'Pipeline Flow',
    plural: 'Pipeline Flows',
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
      admin: { description: 'e.g. "A properly designed CCTV environment typically connects multiple components into one surveillance system."' },
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps (top to bottom)',
      minRows: 2,
      admin: {
        description: 'Rendered as a single vertical stack connected by arrows, e.g. Camera → Network → NVR → Storage → Monitoring.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'textarea', label: 'Description (optional)', localized: true },
      ],
    },
    {
      name: 'footer',
      type: 'textarea',
      label: 'Footer Note (optional)',
      localized: true,
      admin: { description: 'e.g. a closing line about optional integrations with other systems.' },
    },
  ],
}
