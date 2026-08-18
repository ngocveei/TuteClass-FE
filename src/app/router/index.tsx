import { Navigate, useRoutes } from 'react-router-dom'
import { adminRoutes } from '@/app/router/admin.routes'
import { publicRoutes } from '@/app/router/public.routes'
import { studentRoutes } from '@/app/router/student.routes'
import { teacherRoutes } from '@/app/router/teacher.routes'

const routes = [
  ...publicRoutes,
  ...teacherRoutes,
  ...studentRoutes,
  ...adminRoutes,
  { path: '*', element: <Navigate to="/" replace /> },
]

export function AppRouter() {
  return useRoutes(routes)
}
