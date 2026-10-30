import { NextResponse } from 'next/server'

/**
 * Cron-triggered job runner.
 * Called by Vercel Cron with CRON_SECRET authorization.
 * Runs pending Payload jobs from the durable queue.
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@/payload.config')
    const payload = await getPayload({ config })

    // Run pending jobs
    await payload.jobs.run()

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('[cron/jobs] Error running jobs:', error)
    return NextResponse.json(
      { error: 'Job runner failed' },
      { status: 500 }
    )
  }
}
