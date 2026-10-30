import 'server-only'
import { headers } from 'next/headers'
import { getPayload } from './payload'

export type Permission =
  | 'ops:access'
  | 'leads:read'
  | 'leads:write'
  | 'leads:assign'
  | 'pricing:read'
  | 'pricing:write'
  | 'reservations:read'
  | 'reservations:write'
  | 'reservations:approve'
  | 'kyc:review'
  | 'audit:read'
  | 'consent:read'
  | 'consent:write'
  | 'settings:manage'
  | 'content:read'
  | 'content:write'
  | 'users:manage'

/**
 * Role → Permission mapping.
 * Kept in one module so the RBAC matrix is testable and auditable.
 */
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    'ops:access', 'leads:read', 'leads:write', 'leads:assign',
    'pricing:read', 'pricing:write', 'reservations:read', 'reservations:write',
    'reservations:approve', 'kyc:review', 'audit:read', 'consent:read',
    'consent:write', 'settings:manage', 'content:read', 'content:write',
    'users:manage',
  ],
  'content-editor': [
    'ops:access', 'content:read', 'content:write',
  ],
  marketing: [
    'ops:access', 'leads:read', 'content:read',
  ],
  'sales-manager': [
    'ops:access', 'leads:read', 'leads:write', 'leads:assign',
    'pricing:read', 'reservations:read', 'reservations:write',
    'reservations:approve', 'consent:read',
  ],
  'sales-agent': [
    'ops:access', 'leads:read', 'leads:write',
    'reservations:read', 'reservations:write', 'consent:read',
  ],
  compliance: [
    'ops:access', 'audit:read', 'consent:read', 'consent:write',
    'kyc:review', 'leads:read',
  ],
}

/**
 * Check if a role has a specific permission.
 */
export function can(user: { role: string }, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[user.role]
  if (!perms) return false
  return perms.includes(permission)
}

/**
 * Require an authenticated user with a specific permission.
 * Throws if not authenticated or not authorized.
 *
 * Use at the top of every /ops page, Server Action, and route handler.
 */
export async function requireUser(permission: Permission) {
  const payload = await getPayload()
  const hdrs = await headers()
  const { user } = await payload.auth({ headers: hdrs })

  if (!user) {
    throw new Error('UNAUTHENTICATED')
  }

  if (!can(user as unknown as { role: string }, permission)) {
    throw new Error('FORBIDDEN')
  }

  return { payload, user }
}
