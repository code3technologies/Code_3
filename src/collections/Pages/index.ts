import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { FAQ } from '@/blocks/FAQ/config'
import { Services } from '@/blocks/Services/config'
import { MissionAndValues } from '@/blocks/MissionAndValues/config'
import { WhyWorkWithUs } from '@/blocks/WhyWorkWithUs/config'
import { WhyChooseUsAbout } from '@/blocks/WhyChooseUsAbout/config'
import { WhyChooseUs } from '@/blocks/WhyChooseUs/config'
import { ContactUs } from '@/blocks/ContactUs/config'
import { AboutUsBanner } from '@/blocks/AboutUsBanner/config'
import { CurrentOpenings } from '@/blocks/CurrentOpenings/config'
import { Careers } from '@/blocks/CareersBanner/config'
import { TrustedBrands } from '@/blocks/TrustedBrands/config'
import { ServiceSolutions } from '@/blocks/ServiceSolutions/config'
import { ServicesHero } from '@/blocks/ServicesHero/config'
import { ServicesSteps } from '@/blocks/ServicesSteps/config'
import { ServiceDetailBanner } from '@/blocks/ServiceDetailBanner/config'
import { ServiceOverview } from '@/blocks/ServiceOverview/config'
import { ServiceCatalog } from '@/blocks/ServiceCatalog/config'
import { Stats } from '@/blocks/Stats/config'
import { ICON_PRESET_OPTIONS } from '@/components/site/icons'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to CollectionConfig - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    hidden: ({ user }) => user?.role !== 'admin',
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          serviceCategory: typeof data?.serviceCategory === 'string' ? data.serviceCategory : null,
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        serviceCategory: typeof data?.serviceCategory === 'string' ? data.serviceCategory : null,
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'serviceCategory',
      type: 'select',
      label: 'Service Category',
      defaultValue: 'none',
      options: [
        { label: 'Not a Service Page', value: 'none' },
        { label: 'Infrastructure Service', value: 'infrastructure' },
        { label: 'Digital Service', value: 'digital' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Categorize this page as Infrastructure or Digital to link it from Services.',
      },
    },
    {
      name: 'parentService',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Parent Service',
      admin: {
        position: 'sidebar',
        description:
          'Select a parent service if this is a sub-service. The parent must be a service page (Infrastructure or Digital).',
        condition: (data) => {
          return data?.serviceCategory === 'infrastructure' || data?.serviceCategory === 'digital'
        },
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icon (service cards)',
      options: [...ICON_PRESET_OPTIONS],
      admin: {
        position: 'sidebar',
        description:
          'Used when this page appears as a card in a Services block. Leave unset to auto-match based on the page title.',
        condition: (data) => {
          return data?.serviceCategory === 'infrastructure' || data?.serviceCategory === 'digital'
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                FAQ,
                Services,
                MissionAndValues,
                WhyWorkWithUs,
                WhyChooseUsAbout,
                WhyChooseUs,
                ContactUs,
                Careers,
                AboutUsBanner,
                TrustedBrands,
                CurrentOpenings,
                ServiceSolutions,
                ServicesHero,
                ServicesSteps,
                ServiceDetailBanner,
                ServiceOverview,
                ServiceCatalog,
                Stats,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the generateUrl function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
