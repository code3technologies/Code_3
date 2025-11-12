import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { isAdmin } from '@/access/isAdmin'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      admin: {
        hidden: ({ user }) => user?.role !== 'admin',
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
      upload: true,
    },
    formOverrides: {
      admin: {
        hidden: ({ user }) => user?.role !== 'admin',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      slug: 'enquiries',
      admin: {
        group: 'Complaints and Enquiries',
        defaultColumns: ['submittedBy', 'email', 'phone', 'status', 'createdAt'],
        hidden: ({ user }) => user?.role !== 'admin',
      },
      access: {
        read: isAdmin,
        update: isAdmin,
        create: () => true,
        delete: isAdmin,
      },
      labels: {
        singular: 'Enquiry',
        plural: 'Enquiries',
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            interface SubmissionItem {
              field: string
              value: string
            }

            const submissionData = (data?.submissionData || []) as SubmissionItem[]
            
            const nameField = submissionData.find((item) => item.field === 'fullname' || item.field === 'name')
            const emailField = submissionData.find((item) => item.field === 'email')
            const phoneField = submissionData.find((item) => item.field === 'phone' || item.field === 'mobile' || item.field === 'contact')
            
            data.submittedBy = nameField?.value || 'Anonymous'
            data.email = emailField?.value || ''
            data.phone = phoneField?.value || ''

            return data
          }
        ]
      },
      fields: ({ defaultFields }) => {
        return [
          ...defaultFields.map((field) => {
            if ('name' in field && field.name === 'form') {
              return {
                ...field,
                admin: {
                  ...field.admin,
                  readOnly: true,
                  position: 'sidebar',
                },
              } as typeof field
            }

            if ('name' in field && field.name === 'submissionData') {
              return {
                ...field,
                admin: {
                  components: {
                    Field: 'src/collections/Enquiries/SubmissionDataView#SubmissionDataView',
                  },
                },
              } as typeof field
            }
            return field
          }),
          {
            name: 'status',
            type: 'select',
            label: 'Status',
            required: true,
            defaultValue: 'pending',
            options: [
              { label: 'Pending', value: 'pending' },
              { label: 'Reviewed', value: 'reviewed' },
              { label: 'Resolved', value: 'resolved' },
              { label: 'Rejected', value: 'rejected' },
            ],
            admin: {
              position: 'sidebar',
              description: 'Current status of this enquiry',
            },
          },
          {
            name: 'submittedBy',
            type: 'text',
            label: 'Name',
            admin: {
              position: 'sidebar',
              readOnly: true,
              condition: (_, { operation }) => operation === 'create',
            },
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            admin: {
              position: 'sidebar',
              readOnly: true,
              condition: (_, { operation }) => operation === 'create',
            },
          },
          {
            name: 'phone',
            type: 'text',
            label: 'Phone',
            admin: {
              position: 'sidebar',
              readOnly: true,
              condition: (_, { operation }) => operation === 'create',
            },
          }
        ]
      }
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: {
        hidden: ({ user }) => user?.role !== 'admin',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  payloadCloudPlugin(),
]
