import type { Block } from 'payload'

export const CurrentOpenings: Block = {
  slug: 'currentOpenings',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
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
      name: 'showFilter',
      type: 'checkbox',
      label: 'Show Department Filter',
      defaultValue: true,
    },
    {
      name: 'departments',
      type: 'array',
      label: 'Departments',
      minRows: 1,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Department Value',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Department Label',
          required: true,
          localized: true,
        },
      ],
      defaultValue: [
        { value: 'sales', label: 'Sales' },
        { value: 'ict-elv', label: 'ICT & ELV' },
      ],
    },
    {
      name: 'jobListings',
      type: 'array',
      label: 'Job Listings',
      minRows: 1,
      fields: [
        {
          name: 'department',
          type: 'text',
          label: 'Department',
          required: true,
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Job Title',
          required: true,
          localized: true,
        },
        {
          name: 'category',
          type: 'text',
          label: 'Category',
          required: true,
          localized: true,
        },
        {
          name: 'categoryColor',
          type: 'select',
          label: 'Category Color',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Pink', value: 'pink' },
            { label: 'Green', value: 'green' },
            { label: 'Orange', value: 'orange' },
          ],
          defaultValue: 'blue',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Job Description',
          required: true,
          localized: true,
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          defaultValue: 'Remote',
          required: true,
          localized: true,
        },
        {
          name: 'type',
          type: 'text',
          label: 'Job Type',
          defaultValue: 'Full-time',
          required: true,
          localized: true,
        },
        {
          name: 'responsibilitiesText',
          type: 'textarea',
          label: 'Key Responsibilities (one per line)',
          localized: true,
          admin: {
            description: 'Shown in the "View More Details" modal, one bullet point per line.',
          },
        },
        {
          name: 'requirementsText',
          type: 'textarea',
          label: 'Requirements (one per line)',
          localized: true,
          admin: {
            description: 'Shown in the "View More Details" modal, one bullet point per line.',
          },
        },
      ],
    },
  ],
  interfaceName: 'CurrentOpeningsBlock',
}