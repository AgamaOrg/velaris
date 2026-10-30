import 'server-only'

/**
 * Validated environment variables.
 * Import this instead of reading process.env directly.
 */
function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  DATABASE_URL: requireEnv('DATABASE_URL', 'postgresql://localhost:5432/velaris'),
  DATABASE_URL_UNPOOLED: requireEnv('DATABASE_URL_UNPOOLED', process.env.DATABASE_URL || 'postgresql://localhost:5432/velaris'),
  PAYLOAD_SECRET: requireEnv('PAYLOAD_SECRET', 'VELARIS_DEV_SECRET_CHANGE_ME'),
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || '',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  CRON_SECRET: process.env.CRON_SECRET || '',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  VERCEL: Boolean(process.env.VERCEL),
} as const
