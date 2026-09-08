import type { Block } from 'payload'
import { ICON_PRESET_OPTIONS } from '@/components/site/icons'
import { ctaFields } from '@/fields/ctaFields'

export const ScenarioFlows: Block = {
  slug: 'scenarioFlows',
  interfaceName: 'ScenarioFlowsBlock',
  labels: {
    singular: 'Scenario Flows',
    plural: 'Scenario Flows',
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
      name: 'scenarios',
      type: 'array',
      label: 'Scenarios',
      minRows: 2,
      maxRows: 8,
      admin: {
        description: 'Each scenario is a short, real-world flow through the system, e.g. "Main Office: Employee enters → biometric authentication → attendance recorded."',
      },
      fields: [
        { name: 'label', type: 'text', label: 'Scenario Label', required: true, localized: true, admin: { description: 'e.g. "Main Office"' } },
        {
          name: 'steps',
          type: 'array',
          label: 'Flow Steps',
          minRows: 2,
          maxRows: 6,
          fields: [
            { name: 'text', type: 'text', required: true, localized: true },
            {
              name: 'icon',
              type: 'select',
              label: 'Icon (optional)',
              options: [...ICON_PRESET_OPTIONS],
            },
          ],
        },
      ],
    },
    ...ctaFields('Talk to Our Experts'),
  ],
}
