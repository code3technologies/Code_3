import type { Block } from 'payload'

export const MissionAndValues: Block = {
  slug: 'missionAndValues',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'MISSION & VALUES',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      required: true,
    },
    {
      name: 'missionCard',
      type: 'group',
      label: 'Mission Card',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon Image',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Card Title',
          defaultValue: 'OUR MISSION',
          required: true,
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Mission Content',
          required: true,
        },
      ],
    },
    {
      name: 'valuesCard',
      type: 'group',
      label: 'Values Card',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon Image',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Card Title',
          defaultValue: 'VALUES',
          required: true,
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Values Content',
          required: true,
        },
      ],
    },
  ],
  interfaceName: 'MissionAndValuesBlock',
}