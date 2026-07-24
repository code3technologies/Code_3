import type { Block } from 'payload'

export const ServiceCatalog: Block = {
  slug: 'serviceCatalog',
  interfaceName: 'ServiceCatalogBlock',
  labels: {
    singular: 'Service Catalog (tabs + cards)',
    plural: 'Service Catalogs (tabs + cards)',
  },
  fields: [
    {
      name: 'titleHighlight',
      type: 'text',
      label: 'Title (highlighted part)',
      defaultValue: 'Our Services',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title (plain part)',
      defaultValue: '& Solutions',
      required: true,
    },
    {
      name: 'serviceType',
      type: 'select',
      label: 'Service Type',
      defaultValue: 'infrastructure',
      options: [
        { label: 'Infrastructure Services', value: 'infrastructure' },
        { label: 'Digital Services', value: 'digital' },
      ],
      required: true,
      admin: {
        description:
          "Tabs are built from your published top-level pages of this category; cards under each tab come from that page's sub-services (Parent Service field).",
      },
    },
  ],
}
