import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    hidden: ({ user }) => user?.role !== 'admin',
  },
  fields: [
    {
      name: 'externalUrl',
      type: 'text',
      label: 'External Image URL',
      admin: {
        description:
          'Paste a full image URL (https://…) to use an image hosted elsewhere instead of uploading a file. When set, this is used everywhere this media is displayed. Leave the file upload empty when using this.',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        if (/^https?:\/\/.+/i.test(value)) return true
        return 'Enter a valid URL starting with http:// or https://'
      },
    },
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    // Allow creating a Media entry with no uploaded file (URL-only images via `externalUrl`).
    filesRequiredOnCreate: false,
    // Disable "paste URL" into the dropzone — it re-downloads and re-uploads the
    // image to blob storage, which fails without blob write access. Use the
    // `externalUrl` field instead to reference an image without uploading.
    pasteURL: false,
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
