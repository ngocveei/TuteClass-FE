import type { RouteObject } from 'react-router-dom'
import { ClassDetailPage, ClassListPage, ProfilePage } from '@/app/router/lazy.pages'
import { RoleGuard } from '@/shared/auth/RoleGuard'
import { ROLES } from '@/shared/constants/roles'
import { TeacherLayout } from '@/shared/layouts/TeacherLayout/TeacherLayout'

export const teacherRoutes: RouteObject[] = [
  {
    element: (
      <RoleGuard allowedRoles={[ROLES.teacher]}>
        <TeacherLayout />
      </RoleGuard>
    ),
    children: [
      { path: '/classes', element: <ClassListPage /> },
      { path: '/classes/:classId', element: <ClassDetailPage /> },
      { path: '/teacher/profile', element: <ProfilePage /> },
    ],
  },
]
