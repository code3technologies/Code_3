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
      localized: true,
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
      maxRows: 40,
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
          defaultValue: '+971 54 360 4546',
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
          name: 'mapEmbedUrl',
          type: 'text',
          label: 'Google Map Embed URL',
          defaultValue:
            'https://maps.google.com/maps?q=CODE3%20Technologies%2C%20Office%20209%2C%20AL%20Mozna%20Building%2C%20Dubai%2C%20United%20Arab%20Emirates&t=&z=15&ie=UTF8&iwloc=&output=embed',
          admin: {
            description:
              'Paste the iframe "src" URL from Google Maps: open the location on Google Maps → Share → Embed a map → Copy HTML, then take just the src="..." value.',
          },
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
              localized: true,
              required: true,
            },
            {
              name: 'time',
              type: 'text',
              label: 'Time',
              defaultValue: '9am—6pm',
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Links',
      fields: [
        { name: 'twitter', type: 'text', label: 'X / Twitter URL' },
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
        { name: 'instagram', type: 'text', label: 'Instagram URL' },
        { name: 'youtube', type: 'text', label: 'YouTube URL' },
        {
          name: 'googleBusiness',
          type: 'text',
          label: 'Google Business Profile URL',
          admin: {
            description:
              "Share link from the Google Business Profile listing - included in sitewide structured data (sameAs) so Google ties the website and listing to the same entity. Doesn't show as a footer icon.",
          },
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
          localized: true,
          required: true,
        },
        {
          name: 'exploreServicesText',
          type: 'text',
          label: 'Explore Services Text',
          defaultValue: 'Explore our services',
          localized: true,
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
