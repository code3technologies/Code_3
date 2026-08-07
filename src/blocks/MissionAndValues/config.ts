import type { Block } from 'payload'
import { ICON_PRESET_OPTIONS } from '@/components/site/icons'

export const MissionAndValues: Block = {
  slug: 'missionAndValues',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'MISSION, VISION & VALUES',
      required: true,
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      required: true,
      localized: true,
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
          localized: true,
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Mission Content',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'visionCard',
      type: 'group',
      label: 'Vision Card',
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
          defaultValue: 'OUR VISION',
          required: true,
          localized: true,
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Vision Content',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'valuesBadge',
      type: 'text',
      label: 'Values Section Badge Text',
      defaultValue: 'OUR CORE VALUES',
      localized: true,
    },
    {
      name: 'valuesTitle',
      type: 'text',
      label: 'Values Section Title',
      localized: true,
    },
    {
      name: 'values',
      type: 'array',
      label: 'Core Values',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'iconPreset',
          type: 'select',
          label: 'Icon',
          options: [...ICON_PRESET_OPTIONS],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Value Title',
          required: true,
          localized: true,
        },
        {
          name: 'itemsText',
          type: 'textarea',
          label: 'Checklist Items (one per line)',
          required: true,
          localized: true,
        },
      ],
    },
  ],
  interfaceName: 'MissionAndValuesBlock',
}
