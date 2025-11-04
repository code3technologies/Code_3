import type { Block } from 'payload'

export const CurrentOpenings: Block = {
  slug: 'currentOpenings',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
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
        },
      ],
      defaultValue: [
        { value: 'elv', label: 'ELV' },
        { value: 'design', label: 'Design' },
        { value: 'cybersecurity', label: 'Cybersecurity' },
        { value: 'development', label: 'Development' },
        { value: 'av-services', label: 'AV Services' },
        { value: 'it-support', label: 'IT & Support' },
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
        },
        {
          name: 'title',
          type: 'text',
          label: 'Job Title',
          required: true,
        },
        {
          name: 'category',
          type: 'text',
          label: 'Category',
          required: true,
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
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          defaultValue: 'Remote',
          required: true,
        },
        {
          name: 'type',
          type: 'text',
          label: 'Job Type',
          defaultValue: 'Full-time',
          required: true,
        },
        {
          name: 'viewJobText',
          type: 'text',
          label: 'View Job Button Text',
          defaultValue: 'View Job',
          required: true,
        },
        {
          name: 'viewJobLink',
          type: 'text',
          label: 'View Job Link',
        },
      ],
    },
  ],
  interfaceName: 'CurrentOpeningsBlock',
}