/**
 * Next.js instrumentation — runs once at server startup.
 *
 * Used to attach the database pool for proper connection cleanup
 * on Vercel serverless functions.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.VERCEL && process.env.DATABASE_URL) {
    try {
      const { getPayload } = await import('payload')
      const { default: config } = await import('@/payload.config')

      const payload = await getPayload({ config })

      const { attachDatabasePool } = await import('@vercel/functions')
      const pool = (payload.db as unknown as { pool?: import('pg').Pool })?.pool
      if (pool) {
        attachDatabasePool(pool)
      }
    } catch (err) {
      console.warn('Failed to attach database pool in instrumentation:', err)
    }
  }
}
