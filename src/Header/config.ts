import type { GlobalConfig } from 'payload'

import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      required: true,
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          label: 'Link Type',
          options: [
            { label: 'Internal Page', value: 'internal' },
            { label: 'External URL', value: 'external' },
            { label: 'Anchor Link', value: 'anchor' },
            { label: 'Dropdown Menu', value: 'dropdown' },
            { label: 'Mega Menu', value: 'mega' },
          ],
          defaultValue: 'internal',
          required: true,
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in New Tab',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'external',
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (Lucide React icon name)',
          admin: {
            description: 'Enter the name of a Lucide React icon (e.g., "home", "user", "settings")',
          },
        },
        {
          name: 'showInMobile',
          type: 'checkbox',
          label: 'Show in Mobile Menu',
          defaultValue: true,
        },
        {
          name: 'showInDesktop',
          type: 'checkbox',
          label: 'Show in Desktop Menu',
          defaultValue: true,
        },
        {
          name: 'order',
          type: 'number',
          label: 'Display Order',
          defaultValue: 0,
          admin: {
            description: 'Lower numbers appear first',
          },
        },
        {
          name: 'cssClass',
          type: 'text',
          label: 'CSS Class',
          admin: {
            description: 'Additional CSS classes for styling',
          },
        },
        {
          name: 'subItems',
          type: 'array',
          label: 'Sub Menu Items',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.type === 'dropdown' || siblingData?.type === 'mega',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Sub Item Label',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              label: 'Sub Item Link',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                description: 'Optional description for the sub menu item',
              },
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon (Lucide React icon name)',
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              label: 'Open in New Tab',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'mega',
              },
            },
            {
              name: 'order',
              type: 'number',
              label: 'Display Order',
              defaultValue: 0,
            },
          ],
        },
        {
          name: 'megaMenuConfig',
          type: 'group',
          label: 'Mega Menu Configuration',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'mega',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Mega Menu Title',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Mega Menu Description',
            },
            {
              name: 'columns',
              type: 'number',
              label: 'Number of Columns',
              defaultValue: 3,
              min: 1,
              max: 6,
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
            },
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Background Color',
              admin: {
                description: 'CSS color value (e.g., #ff0000, rgb(255,0,0), red)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'megaMenu',
      type: 'group',
      label: 'Mega Menu Configuration',
      fields: [
        {
          name: 'showMegaMenu',
          type: 'checkbox',
          label: 'Show Digital Services Button',
          defaultValue: false,
        },
        {
          name: 'megaMenuLabel',
          type: 'text',
          label: 'Digital Services Button Label',
          defaultValue: 'Digital services',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Mega Menu Title',
          defaultValue: 'Complete IT, Security & Digital Solutions for Businesses in UAE',
        },
        {
          name: 'brandText',
          type: 'text',
          label: 'Brand Text',
          defaultValue: 'CODE3',
        },
        {
          name: 'serviceCategories',
          type: 'array',
          label: 'Service Categories',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Category Title',
              required: true,
            },
            {
              name: 'services',
              type: 'array',
              label: 'Services',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Service Name',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Service Link',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'mobileMenu',
      type: 'group',
      label: 'Mobile Menu Configuration',
      fields: [
        {
          name: 'sections',
          type: 'array',
          label: 'Menu Sections',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section Title',
              required: true,
            },
            {
              name: 'items',
              type: 'array',
              label: 'Menu Items',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Item Name',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Item Link',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'ctaButtons',
      type: 'group',
      label: 'Call to Action Buttons',
      fields: [
        {
          name: 'loginText',
          type: 'text',
          label: 'Login Button Text',
          defaultValue: 'Login',
        },
        {
          name: 'loginLink',
          type: 'text',
          label: 'Login Link',
          defaultValue: '/login',
        },
        {
          name: 'contactText',
          type: 'text',
          label: 'Contact Button Text',
          defaultValue: 'Contact',
        },
        {
          name: 'contactLink',
          type: 'text',
          label: 'Contact Link',
          defaultValue: '/contact',
        },
        {
          name: 'showLoginButton',
          type: 'checkbox',
          label: 'Show Login Button',
          defaultValue: true,
        },
        {
          name: 'showContactButton',
          type: 'checkbox',
          label: 'Show Contact Button',
          defaultValue: true,
        },
        {
          name: 'buttonStyle',
          type: 'select',
          label: 'Button Style',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Rounded', value: 'rounded' },
            { label: 'Pill', value: 'pill' },
            { label: 'Outline', value: 'outline' },
          ],
          defaultValue: 'default',
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Header Settings',
      fields: [
        {
          name: 'stickyHeader',
          type: 'checkbox',
          label: 'Sticky Header',
          defaultValue: true,
        },
        {
          name: 'showSearchIcon',
          type: 'checkbox',
          label: 'Show Search Icon',
          defaultValue: true,
        },
        {
          name: 'searchLink',
          type: 'text',
          label: 'Search Page Link',
          defaultValue: '/search',
        },
        {
          name: 'mobileMenuStyle',
          type: 'select',
          label: 'Mobile Menu Style',
          options: [
            { label: 'Slide Over', value: 'slide' },
            { label: 'Full Screen', value: 'fullscreen' },
            { label: 'Dropdown', value: 'dropdown' },
          ],
          defaultValue: 'fullscreen',
        },
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Background Color',
          defaultValue: 'bg-white',
          admin: {
            description: 'Tailwind CSS background class (e.g., bg-white, bg-gray-100)',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          label: 'Text Color',
          defaultValue: 'text-gray-900',
          admin: {
            description: 'Tailwind CSS text color class (e.g., text-gray-900, text-white)',
          },
        },
        {
          name: 'hoverColor',
          type: 'text',
          label: 'Hover Color',
          defaultValue: 'hover:text-red-600',
          admin: {
            description:
              'Tailwind CSS hover color class (e.g., hover:text-red-600, hover:text-blue-600)',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
