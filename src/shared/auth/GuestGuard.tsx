import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentRoles, hasValidAccessToken } from '@/shared/auth/authClaims'
import { ROLES } from '@/shared/constants/roles'
import { ROUTES } from '@/shared/constants/routes'

export function GuestGuard({ children }: PropsWithChildren) {
  if (!hasValidAccessToken()) return children

  const roles = getCurrentRoles()
  if (roles.includes(ROLES.teacher)) return <Navigate to={ROUTES.teacherClasses} replace />
  if (roles.includes(ROLES.student)) return <Navigate to={ROUTES.studentClasses} replace />
  if (roles.includes(ROLES.admin)) return <Navigate to={ROUTES.adminUsers} replace />
  return <Navigate to={ROUTES.landing} replace />
}
