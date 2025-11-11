import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  admin: {
    hidden: ({ user }) => user?.role !== 'admin',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Company Logo',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Company Description',
      defaultValue: 'From technology infrastructure to digital growth, we deliver end-to-end solutions that help your business run smarter and grow faster.',
      required: true,
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          defaultValue: '‪+971 54 360 4546‬',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          defaultValue: 'info@code3.ae',
          required: true,
        },
        {
          name: 'address',
          type: 'group',
          label: 'Address',
          fields: [
            {
              name: 'companyName',
              type: 'text',
              label: 'Company Name',
              defaultValue: 'Code3 Technologies FZCO',
              required: true,
            },
            {
              name: 'building',
              type: 'text',
              label: 'Building',
              defaultValue: 'Building A1, Dubai Silicon Oasis',
              required: true,
            },
            {
              name: 'poBox',
              type: 'text',
              label: 'P.O Box',
              defaultValue: 'P.O Box 342001, Dubai United Arab Emirates',
              required: true,
            },
          ],
        },
        {
          name: 'workingHours',
          type: 'group',
          label: 'Working Hours',
          fields: [
            {
              name: 'days',
              type: 'text',
              label: 'Days',
              defaultValue: 'Mo—Fri',
              required: true,
            },
            {
              name: 'time',
              type: 'text',
              label: 'Time',
              defaultValue: '9am—6pm',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'bottomBar',
      type: 'group',
      label: 'Bottom Bar',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          label: 'Copyright Text',
          defaultValue: '© 2025 — Copyright',
          required: true,
        },
        {
          name: 'madeBy',
          type: 'text',
          label: 'Made By',
          defaultValue: 'mirrorfolio.com',
          required: true,
        },
        {
          name: 'exploreServicesText',
          type: 'text',
          label: 'Explore Services Text',
          defaultValue: 'Explore our services',
          required: true,
        },
        {
          name: 'exploreServicesImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Explore Services Background Image',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
