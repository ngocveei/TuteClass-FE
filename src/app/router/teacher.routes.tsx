import type { RouteObject } from 'react-router-dom'
import {
  ClassJoinRequestsPage,
  ClassStudentsPage,
  ClassSettingsPage,
  CreateClassPage,
  ProfilePage,
  TeacherNotificationsPage,
  TeacherOverviewPage,
  TeacherTuitionPage,
} from '@/app/router/lazy.pages'
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
      { path: '/classes', element: <TeacherOverviewPage /> },
      { path: '/classes/new', element: <CreateClassPage /> },
      { path: '/classes/students', element: <ClassStudentsPage /> },
      { path: '/classes/:classId/settings', element: <ClassSettingsPage /> },
      { path: '/classes/:classId/approval-requests', element: <ClassJoinRequestsPage /> },
      { path: '/teacher/notifications', element: <TeacherNotificationsPage /> },
      { path: '/teacher/tuition', element: <TeacherTuitionPage /> },
      { path: '/teacher/profile', element: <ProfilePage /> },
    ],
  },
]
