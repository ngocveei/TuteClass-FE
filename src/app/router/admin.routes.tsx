import type { RouteObject } from 'react-router-dom'
import { AdminUsersPage } from '@/app/router/lazy.pages'
import { RoleGuard } from '@/shared/auth/RoleGuard'
import { ROLES } from '@/shared/constants/roles'
import { AdminLayout } from '@/shared/layouts/AdminLayout/AdminLayout'

export const adminRoutes: RouteObject[] = [
  {
    element: (
      <RoleGuard allowedRoles={[ROLES.admin]}>
        <AdminLayout />
      </RoleGuard>
    ),
    children: [{ path: '/admin/users', element: <AdminUsersPage /> }],
  },
]
