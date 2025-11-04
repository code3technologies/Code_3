import type { Block } from 'payload'

export const WhyChooseUs: Block = {
  slug: 'whyChooseUs',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      defaultValue: 'WHY CHOOSE US',
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
      name: 'features',
      type: 'array',
      label: 'Feature Cards',
      minRows: 4,
      maxRows: 4,
      fields: [
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Feature Image',
          required: true,
        },
        {
          name: 'colSpan',
          type: 'select',
          label: 'Column Span',
          options: [
            { label: '4 columns (Left/Top)', value: '4' },
            { label: '5 columns (Right/Bottom)', value: '5' },
          ],
          defaultValue: '4',
          required: true,
        },
        {
          name: 'hasGradient',
          type: 'checkbox',
          label: 'Has Dark Gradient Overlay',
          defaultValue: false,
        },
        {
          name: 'textColor',
          type: 'select',
          label: 'Text Color',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
          ],
          defaultValue: 'white',
        },
        {
          name: 'contentPosition',
          type: 'select',
          label: 'Content Position',
          options: [
            { label: 'Bottom', value: 'bottom' },
            { label: 'Center', value: 'center' },
          ],
          defaultValue: 'bottom',
        },
      ],
    },
  ],
  interfaceName: 'WhyChooseUsBlock',
}