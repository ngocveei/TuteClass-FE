import type { AppRole } from '@/shared/constants/roles'
import { getAccessToken } from '@/services/auth/tokenStorage'

interface JwtClaims {
  role?: string | string[]
  permissions?: string | string[]
  permission?: string | string[]
  exp?: number
  [key: string]: unknown
}

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function decodeClaims(): JwtClaims | null {
  const token = getAccessToken()
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(escape(atob(base64)))) as JwtClaims
  } catch {
    return null
  }
}

export function getCurrentRoles(): AppRole[] {
  const claims = decodeClaims()
  if (!claims) return []
  const roleClaim = claims.role ?? claims[ROLE_CLAIM]
  return toArray(roleClaim as string | string[] | undefined) as AppRole[]
}

export function getCurrentPermissions(): string[] {
  const claims = decodeClaims()
  return claims ? toArray(claims.permissions ?? claims.permission) : []
}

export function hasValidAccessToken(): boolean {
  const claims = decodeClaims()
  return Boolean(claims && (!claims.exp || claims.exp * 1000 > Date.now()))
}
