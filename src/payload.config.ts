import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { resendAdapter } from '@payloadcms/email-resend'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/content/Users'
import { Media } from './collections/content/Media'
import { Pages } from './collections/content/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // ---------------------------------------------------------------------------
  // Admin
  // ---------------------------------------------------------------------------
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Velaris',
    },
  },

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------
  collections: [Users, Media, Pages],

  // ---------------------------------------------------------------------------
  // Globals (site-wide settings)
  // ---------------------------------------------------------------------------
  globals: [],

  // ---------------------------------------------------------------------------
  // Editor
  // ---------------------------------------------------------------------------
  editor: lexicalEditor(),

  // ---------------------------------------------------------------------------
  // Database
  // ---------------------------------------------------------------------------
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: 3,
    },
    push: false,
    migrationDir: path.resolve(dirname, '../migrations'),
  }),

  // ---------------------------------------------------------------------------
  // Email
  // ---------------------------------------------------------------------------
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          defaultFromAddress: process.env.RESEND_FROM_ADDRESS || 'noreply@thevelarisresidences.com',
          defaultFromName: 'The Velaris Residences',
          apiKey: process.env.RESEND_API_KEY,
        }),
      }
    : {}),

  // ---------------------------------------------------------------------------
  // Upload / Storage
  // ---------------------------------------------------------------------------
  sharp,

  // ---------------------------------------------------------------------------
  // Plugins
  // ---------------------------------------------------------------------------
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],

  // ---------------------------------------------------------------------------
  // Secret
  // ---------------------------------------------------------------------------
  secret: process.env.PAYLOAD_SECRET || 'VELARIS_DEV_SECRET_CHANGE_ME',

  // ---------------------------------------------------------------------------
  // TypeScript
  // ---------------------------------------------------------------------------
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ---------------------------------------------------------------------------
  // Jobs
  // ---------------------------------------------------------------------------
  jobs: {
    autoRun: [], // Never use autoRun on Vercel/serverless
  },

  // ---------------------------------------------------------------------------
  // Localization
  // ---------------------------------------------------------------------------
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Filipino', code: 'fil' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
})
