import type { RouteObject } from 'react-router-dom'
import { ProfilePage, StudentClassesPage } from '@/app/router/lazy.pages'
import { RoleGuard } from '@/shared/auth/RoleGuard'
import { ROLES } from '@/shared/constants/roles'
import { StudentLayout } from '@/shared/layouts/StudentLayout/StudentLayout'

export const studentRoutes: RouteObject[] = [
  {
    element: (
      <RoleGuard allowedRoles={[ROLES.student]}>
        <StudentLayout />
      </RoleGuard>
    ),
    children: [
      { path: '/student/classes', element: <StudentClassesPage /> },
      { path: '/student/profile', element: <ProfilePage /> },
    ],
  },
]
