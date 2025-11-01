import type { Block } from 'payload'

export const WhyWorkWithUs: Block = {
  slug: 'whyWorkWithUs',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'WHY WORK WITH US',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Main Title',
      defaultValue: 'Why Businesses Trust Us',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      defaultValue:
        "Choosing the right technology partner isn't just about products — it's about reliability, expertise, and support that never stops",
      required: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      minRows: 1,
      maxRows: 4,
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
          label: 'Feature Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Feature Description',
          required: true,
        },
        {
          name: 'colSpan',
          type: 'select',
          label: 'Column Span (Desktop)',
          options: [
            { label: '4 columns', value: '4' },
            { label: '5 columns', value: '5' },
          ],
          defaultValue: '4',
          required: true,
        },
        {
          name: 'iconAlignment',
          type: 'select',
          label: 'Icon Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'left',
          required: true,
        },
      ],
    },
  ],
  interfaceName: 'WhyWorkWithUsBlock',
}