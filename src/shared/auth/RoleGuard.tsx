import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentRoles, hasValidAccessToken } from '@/shared/auth/authClaims'
import type { AppRole } from '@/shared/constants/roles'
import { ROUTES } from '@/shared/constants/routes'

interface RoleGuardProps extends PropsWithChildren {
  allowedRoles: AppRole[]
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const location = useLocation()

  if (!hasValidAccessToken()) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  const hasRole = getCurrentRoles().some((role) => allowedRoles.includes(role))
  return hasRole ? children : <Navigate to="/forbidden" replace />
}
