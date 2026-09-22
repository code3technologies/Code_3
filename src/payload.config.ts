// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Devices } from './collections/Devices'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Complaints } from './collections/Complaints'
import { ComplaintAttachments } from './collections/ComplaintAttachments'
import { JobApplications } from './collections/JobApplications'
import { JobApplicationAttachments } from './collections/JobApplicationAttachments'
import { RegisterComplaint } from './globals/RegisterComplaint'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      graphics: {
        Logo: 'src/components/Logo/Logo#Logo',
        Icon: 'src/components/Logo/Icon#Icon',
      },
    },
    theme: 'light',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Devices,
    Users,
    Complaints,
    ComplaintAttachments,
    JobApplications,
    JobApplicationAttachments,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, RegisterComplaint],
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'ar', label: 'Arabic', rtl: true },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
    // Public store: marketing/site media (logos, hero images, etc). Fine to be public — it's
    // meant to be visible on the site anyway, and public blob URLs don't expire.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      clientUploads: true,
      // Without this, re-uploading a file whose name already exists in the store
      // (e.g. replacing "About Us Image 2.png") fails outright instead of just
      // storing the new upload under a unique path.
      addRandomSuffix: true,
      collections: {
        // Serve files directly from Vercel Blob's CDN instead of proxying through
        // Payload's own /api/media/file route - the proxy doesn't support HTTP
        // Range requests, which breaks <video> playback/seeking on larger files.
        [Media.slug]: { disablePayloadAccessControl: true },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    // Separate private store: files customers attach to complaint forms, and now resumes/cover
    // letters from job applications. Kept on its own token/store so this data isn't reachable
    // by direct URL the way public media is — deliberately NOT the same store as Media above.
    vercelBlobStorage({
      enabled: Boolean(process.env.COMPLAINTS_BLOB_TOKEN),
      clientUploads: true,
      // Two applicants both naming their resume "resume.pdf" would otherwise collide
      // and fail the second upload outright.
      addRandomSuffix: true,
      // The underlying Vercel Blob store is configured as private. The plugin's
      // types only advertise 'public' (its own comment says private support is
      // still "planned"), but it just forwards this value to @vercel/blob's put(),
      // which already supports 'private' - the type is simply stale.
      // @ts-expect-error - see comment above; 'private' is a valid runtime value
      access: 'private',
      collections: {
        'complaint-attachments': true,
        'job-application-attachments': true,
      },
      token: process.env.COMPLAINTS_BLOB_TOKEN,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true

        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER || 'enquiries@code3.ae',
    defaultFromName: 'Code 3',
    // The SMTP credentials are currently rejecting login (535 auth error on
    // every request), and without skipVerify the adapter does a live,
    // blocking SMTP handshake as part of building the Payload config -
    // meaning every cold server/serverless start pays that failing
    // handshake's latency before any page can render. Skipping verification
    // doesn't affect whether mail actually sends (that's a separate,
    // credentials problem - see the note where SMTP_USER/SMTP_PASS are read),
    // it just stops gating page loads on it.
    skipVerify: true,
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: true, // Verify certificates
      },
    },
  }),
})
