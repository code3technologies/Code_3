import type { Block } from 'payload'
import { ctaFields } from '@/fields/ctaFields'

export const RoomSizeCards: Block = {
  slug: 'roomSizeCards',
  interfaceName: 'RoomSizeCardsBlock',
  labels: {
    singular: 'Room Size Cards',
    plural: 'Room Size Cards Blocks',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'ROOM SIZES',
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
      name: 'unitLabel',
      type: 'text',
      label: 'Unit Label',
      defaultValue: 'People',
      localized: true,
      admin: {
        description: 'Shown next to the big value on each card, e.g. "People" or "Fiber Spec".',
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Card Icon',
      defaultValue: 'users',
      options: [
        { label: 'People', value: 'users' },
        { label: 'Cable', value: 'cable' },
        { label: 'Network', value: 'network' },
        { label: 'Wi-Fi', value: 'wifi' },
        { label: 'Server', value: 'server' },
      ],
    },
    {
      name: 'tiers',
      type: 'array',
      label: 'Room Tiers',
      admin: {
        description: 'List from smallest/first to largest/last — the color ramp on each card gets darker as you go down the list.',
      },
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, admin: { description: 'e.g. "Huddle Rooms"' } },
        {
          name: 'valueLabel',
          type: 'text',
          admin: {
            description: 'Overrides the big value shown on the card, e.g. "OS2". Leave blank to auto-compute from min/max capacity below.',
          },
        },
        {
          name: 'minCapacity',
          type: 'number',
          admin: { description: 'Used to compute the big value unless Value Label above is set.' },
        },
        {
          name: 'maxCapacity',
          type: 'number',
          admin: { description: 'Leave blank for the top tier to show "X+"' },
        },
        { name: 'description', type: 'textarea', required: true, localized: true },
        {
          name: 'url',
          type: 'text',
          label: 'Link URL (optional)',
          admin: { description: 'If set, the whole card links here, e.g. "/service/meeting-room-solutions"' },
        },
      ],
    },
    ...ctaFields('Talk to Our Experts', 'Want to see how we can support your business?'),
  ],
}
