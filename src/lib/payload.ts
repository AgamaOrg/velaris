import 'server-only'
import { getPayload as getPayloadInstance } from 'payload'
import config from '@/payload.config'

/**
 * Singleton Payload instance.
 * Import this in Server Components, Server Actions, and route handlers.
 * Never import in client components.
 */
export async function getPayload() {
  return getPayloadInstance({ config })
}
