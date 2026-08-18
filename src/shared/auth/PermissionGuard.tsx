import type { PropsWithChildren, ReactNode } from 'react'
import { getCurrentPermissions } from '@/shared/auth/authClaims'

interface PermissionGuardProps extends PropsWithChildren {
  permissions: string[]
  fallback?: ReactNode
  requireAll?: boolean
}

export function PermissionGuard({
  permissions,
  children,
  fallback = null,
  requireAll = true,
}: PermissionGuardProps) {
  const currentPermissions = getCurrentPermissions()
  const isAllowed = requireAll
    ? permissions.every((permission) => currentPermissions.includes(permission))
    : permissions.some((permission) => currentPermissions.includes(permission))

  return isAllowed ? children : fallback
}
