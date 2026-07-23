import type { Block } from 'payload'
import { linkGroup } from '@/fields/linkGroup'

export const Code3AboutTeaser: Block = {
  slug: 'code3AboutTeaser',
  interfaceName: 'Code3AboutTeaserBlock',
  labels: {
    singular: 'About Teaser',
    plural: 'About Teasers',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'ABOUT CODE3',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue:
        'Built by engineers who believe infrastructure should be invisible — until you need it.',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    linkGroup({
      overrides: {
        maxRows: 1,
        admin: {
          description: 'Optional button (defaults to "Read our full story" → #contact if left empty).',
        },
      },
    }),
  ],
}
