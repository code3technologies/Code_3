import type { Block } from 'payload'
import { ICON_PRESET_OPTIONS } from '@/components/site/icons'
import { ctaFields } from '@/fields/ctaFields'

export const ProcessTimeline: Block = {
  slug: 'processTimeline',
  interfaceName: 'ProcessTimelineBlock',
  labels: {
    singular: 'Process Timeline',
    plural: 'Process Timelines',
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
      name: 'startLabel',
      type: 'text',
      label: 'Start Milestone (optional)',
      localized: true,
      admin: {
        description:
          'Optional unnumbered marker shown before step 1, e.g. "EMPTY OFFICE" — styled as a plain badge, not a numbered step.',
      },
    },
    {
      name: 'emphasizeFinalStep',
      type: 'checkbox',
      label: 'Emphasize final step as a destination (filled marker)',
      defaultValue: false,
      admin: {
        description: 'Use for a "you\'ve arrived" milestone like "Go Live" — fills the last step\'s marker solid.',
      },
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      minRows: 2,
      maxRows: 7,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon (optional)',
          options: [...ICON_PRESET_OPTIONS],
          admin: {
            description: 'Optional — shows this icon in the step marker instead of the step number.',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Step Title',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Step Description',
          required: true,
          localized: true,
        },
      ],
    },
    ...ctaFields('Talk to Our Team'),
  ],
}
