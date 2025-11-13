import type { Block } from 'payload'

export const ContactUs: Block = {
  slug: 'contactUs',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Main Heading',
      defaultValue: 'CONTACT US',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
    {
      name: 'formFields',
      type: 'group',
      label: 'Form Configuration',
      fields: [
        {
          name: 'fullNameLabel',
          type: 'text',
          label: 'Full Name Label',
        },
        {
          name: 'fullNamePlaceholder',
          type: 'text',
          label: 'Full Name Placeholder',
        },
        {
          name: 'emailLabel',
          type: 'text',
          label: 'Email Label',
        },
        {
          name: 'emailPlaceholder',
          type: 'text',
          label: 'Email Placeholder',
        },
        {
          name: 'phoneLabel',
          type: 'text',
          label: 'Phone Label',
        },
        {
          name: 'phonePlaceholder',
          type: 'text',
          label: 'Phone Placeholder',
        },
        {
          name: 'subjectLabel',
          type: 'text',
          label: 'Subject Label',
        },
        {
          name: 'messageLabel',
          type: 'text',
          label: 'Message Label',
        },
        {
          name: 'messagePlaceholder',
          type: 'text',
          label: 'Message Placeholder',
        },
        {
          name: 'privacyText',
          type: 'text',
          label: 'Privacy Policy Text',
        },
        {
          name: 'privacyLink',
          type: 'text',
          label: 'Privacy Policy Link',
        },
        {
          name: 'submitButtonText',
          type: 'text',
          label: 'Submit Button Text',
        },
      ],
    },
    {
      name: 'countryOptions',
      type: 'array',
      label: 'Country Options',
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
      ],
      defaultValue: [
        { value: '+971', label: 'UAE' },
        { value: '+91', label: 'IND' },
      ],
    },
    {
      name: 'subjectOptions',
      type: 'array',
      label: 'Subject Options',
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
      ],
      defaultValue: [
        { value: 'general', label: 'General Inquiry' },
        { value: 'technical', label: 'Technical Support' },
        { value: 'sales', label: 'Sales Inquiry' },
        { value: 'partnership', label: 'Partnership' },
      ],
    },
  ],
  interfaceName: 'ContactUsBlock',
}